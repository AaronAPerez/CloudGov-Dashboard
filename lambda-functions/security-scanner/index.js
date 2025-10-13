const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ec2 = new AWS.EC2();

/**
 * AWS Lambda function to scan AWS resources for security vulnerabilities
 * Triggered by: EventBridge schedule (daily) or S3 object creation
 */
exports.handler = async (event) => {
    console.log('Security Scanner invoked', JSON.stringify(event));

    try {
        const findings = {
            timestamp: new Date().toISOString(),
            s3Findings: [],
            ec2Findings: [],
            summary: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
            }
        };

        // Scan S3 buckets
        const s3Findings = await scanS3Buckets();
        findings.s3Findings = s3Findings;

        // Scan EC2 instances
        const ec2Findings = await scanEC2Instances();
        findings.ec2Findings = ec2Findings;

        // Calculate summary
        [...s3Findings, ...ec2Findings].forEach(finding => {
            findings.summary[finding.severity]++;
        });

        // Store findings in DynamoDB
        await storeFindings(findings);

        // Send alerts for critical findings
        const criticalFindings = [...s3Findings, ...ec2Findings].filter(f => f.severity === 'critical');
        if (criticalFindings.length > 0) {
            await sendSecurityAlert(criticalFindings);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Security scan completed',
                findings: findings.summary,
                details: {
                    s3Issues: s3Findings.length,
                    ec2Issues: ec2Findings.length
                }
            })
        };
    } catch (error) {
        console.error('Error during security scan:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Security scan failed',
                message: error.message
            })
        };
    }
};

async function scanS3Buckets() {
    const findings = [];

    // List all buckets
    const bucketsResponse = await s3.listBuckets().promise();

    for (const bucket of bucketsResponse.Buckets) {
        try {
            // Check bucket encryption
            try {
                await s3.getBucketEncryption({ Bucket: bucket.Name }).promise();
            } catch (err) {
                if (err.code === 'ServerSideEncryptionConfigurationNotFoundError') {
                    findings.push({
                        resourceId: bucket.Name,
                        resourceType: 'S3 Bucket',
                        finding: 'Bucket encryption not enabled',
                        severity: 'high',
                        recommendation: 'Enable default encryption for the bucket'
                    });
                }
            }

            // Check public access
            const aclResponse = await s3.getBucketAcl({ Bucket: bucket.Name }).promise();
            const isPublic = aclResponse.Grants.some(grant =>
                grant.Grantee.Type === 'Group' &&
                (grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers' ||
                    grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers')
            );

            if (isPublic) {
                findings.push({
                    resourceId: bucket.Name,
                    resourceType: 'S3 Bucket',
                    finding: 'Bucket is publicly accessible',
                    severity: 'critical',
                    recommendation: 'Remove public access and use bucket policies for controlled access'
                });
            }

            // Check versioning
            const versioningResponse = await s3.getBucketVersioning({ Bucket: bucket.Name }).promise();
            if (versioningResponse.Status !== 'Enabled') {
                findings.push({
                    resourceId: bucket.Name,
                    resourceType: 'S3 Bucket',
                    finding: 'Versioning not enabled',
                    severity: 'medium',
                    recommendation: 'Enable versioning to protect against accidental deletions'
                });
            }

            // Check logging
            try {
                const loggingResponse = await s3.getBucketLogging({ Bucket: bucket.Name }).promise();
                if (!loggingResponse.LoggingEnabled) {
                    findings.push({
                        resourceId: bucket.Name,
                        resourceType: 'S3 Bucket',
                        finding: 'Access logging not enabled',
                        severity: 'medium',
                        recommendation: 'Enable access logging for audit trail'
                    });
                }
            } catch (err) {
                // Logging might not be configured
            }
        } catch (err) {
            console.error(`Error scanning bucket ${bucket.Name}:`, err);
        }
    }

    return findings;
}

async function scanEC2Instances() {
    const findings = [];

    // Describe all instances
    const instancesResponse = await ec2.describeInstances().promise();

    for (const reservation of instancesResponse.Reservations) {
        for (const instance of reservation.Instances) {
            const instanceId = instance.InstanceId;

            // Check if instance has IMDSv2 enabled
            if (instance.MetadataOptions?.HttpTokens !== 'required') {
                findings.push({
                    resourceId: instanceId,
                    resourceType: 'EC2 Instance',
                    finding: 'IMDSv2 not enforced',
                    severity: 'high',
                    recommendation: 'Require IMDSv2 to prevent SSRF attacks'
                });
            }

            // Check for instances with public IP in production
            if (instance.PublicIpAddress) {
                const isProd = instance.Tags?.some(tag =>
                    tag.Key === 'Environment' && tag.Value.toLowerCase() === 'production'
                );

                if (isProd) {
                    findings.push({
                        resourceId: instanceId,
                        resourceType: 'EC2 Instance',
                        finding: 'Production instance has public IP',
                        severity: 'medium',
                        recommendation: 'Use load balancer or bastion host instead'
                    });
                }
            }

            // Check security groups
            for (const sg of instance.SecurityGroups) {
                const sgResponse = await ec2.describeSecurityGroups({
                    GroupIds: [sg.GroupId]
                }).promise();

                const securityGroup = sgResponse.SecurityGroups[0];

                // Check for overly permissive ingress rules
                const hasOpenSsh = securityGroup.IpPermissions.some(rule =>
                    rule.FromPort === 22 &&
                    rule.IpRanges?.some(range => range.CidrIp === '0.0.0.0/0')
                );

                if (hasOpenSsh) {
                    findings.push({
                        resourceId: `${instanceId} (SG: ${sg.GroupId})`,
                        resourceType: 'EC2 Security Group',
                        finding: 'SSH (port 22) open to the internet',
                        severity: 'critical',
                        recommendation: 'Restrict SSH access to specific IP ranges'
                    });
                }

                const hasOpenRdp = securityGroup.IpPermissions.some(rule =>
                    rule.FromPort === 3389 &&
                    rule.IpRanges?.some(range => range.CidrIp === '0.0.0.0/0')
                );

                if (hasOpenRdp) {
                    findings.push({
                        resourceId: `${instanceId} (SG: ${sg.GroupId})`,
                        resourceType: 'EC2 Security Group',
                        finding: 'RDP (port 3389) open to the internet',
                        severity: 'critical',
                        recommendation: 'Restrict RDP access to specific IP ranges'
                    });
                }
            }

            // Check for missing tags
            const hasCostCenter = instance.Tags?.some(tag => tag.Key === 'CostCenter');
            const hasOwner = instance.Tags?.some(tag => tag.Key === 'Owner');

            if (!hasCostCenter || !hasOwner) {
                findings.push({
                    resourceId: instanceId,
                    resourceType: 'EC2 Instance',
                    finding: 'Missing required tags (CostCenter, Owner)',
                    severity: 'low',
                    recommendation: 'Add required tags for resource tracking'
                });
            }
        }
    }

    return findings;
}

async function storeFindings(findings) {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    await dynamodb.put({
        TableName: process.env.FINDINGS_TABLE || 'security-findings',
        Item: {
            scanId: `scan-${Date.now()}`,
            ...findings
        }
    }).promise();
}

async function sendSecurityAlert(criticalFindings) {
    const sns = new AWS.SNS();
    await sns.publish({
        TopicArn: process.env.ALERT_TOPIC_ARN,
        Subject: 'CRITICAL: Security Vulnerabilities Detected',
        Message: JSON.stringify({
            message: `Found ${criticalFindings.length} critical security findings`,
            findings: criticalFindings,
            timestamp: new Date().toISOString()
        }, null, 2)
    }).promise();
}
