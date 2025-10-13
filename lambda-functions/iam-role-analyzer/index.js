const AWS = require('aws-sdk');
const iam = new AWS.IAM();

/**
 * AWS Lambda function to analyze IAM roles for security risks
 * Triggered by: EventBridge schedule (daily) or API Gateway
 */
exports.handler = async (event) => {
    console.log('IAM Role Analyzer invoked', JSON.stringify(event));

    try {
        // Analyze IAM roles for security risks
        const analysis = await analyzeIAMRoles();

        // Store results in DynamoDB
        await storeAnalysisResults(analysis);

        // Send notifications if high-risk roles found
        if (analysis.highRiskRoles.length > 0) {
            await sendSecurityAlert(analysis);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'IAM role analysis completed',
                summary: {
                    totalRoles: analysis.totalRoles,
                    highRiskRoles: analysis.highRiskRoles.length,
                    recommendations: analysis.recommendations.length
                }
            })
        };
    } catch (error) {
        console.error('Error analyzing IAM roles:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to analyze IAM roles',
                message: error.message
            })
        };
    }
};

async function analyzeIAMRoles() {
    const roles = await iam.listRoles().promise();
    const analysis = {
        totalRoles: roles.Roles.length,
        highRiskRoles: [],
        mediumRiskRoles: [],
        lowRiskRoles: [],
        recommendations: []
    };

    for (const role of roles.Roles) {
        const riskScore = await calculateRiskScore(role);
        const roleAnalysis = {
            roleName: role.RoleName,
            roleArn: role.Arn,
            riskScore,
            issues: []
        };

        // Check for overly permissive policies
        const policies = await iam.listAttachedRolePolicies({ RoleName: role.RoleName }).promise();
        for (const policy of policies.AttachedPolicies) {
            if (policy.PolicyName === 'AdministratorAccess' || policy.PolicyArn.includes('FullAccess')) {
                roleAnalysis.issues.push('Overly permissive policy attached');
            }
        }

        // Check for unused roles
        const roleLastUsed = role.RoleLastUsed?.LastUsedDate;
        if (!roleLastUsed || (Date.now() - new Date(roleLastUsed).getTime()) > 90 * 24 * 60 * 60 * 1000) {
            roleAnalysis.issues.push('Role not used in 90+ days');
        }

        // Categorize by risk
        if (riskScore >= 60) {
            analysis.highRiskRoles.push(roleAnalysis);
        } else if (riskScore >= 30) {
            analysis.mediumRiskRoles.push(roleAnalysis);
        } else {
            analysis.lowRiskRoles.push(roleAnalysis);
        }

        // Generate recommendations
        if (roleAnalysis.issues.length > 0) {
            analysis.recommendations.push({
                roleArn: role.Arn,
                roleName: role.RoleName,
                issues: roleAnalysis.issues,
                action: 'Review and apply least-privilege principles'
            });
        }
    }

    return analysis;
}

async function calculateRiskScore(role) {
    let score = 0;

    // Check attached policies
    const policies = await iam.listAttachedRolePolicies({ RoleName: role.RoleName }).promise();
    if (policies.AttachedPolicies.some(p => p.PolicyName === 'AdministratorAccess')) {
        score += 50;
    }
    if (policies.AttachedPolicies.some(p => p.PolicyArn.includes('FullAccess'))) {
        score += 30;
    }

    // Check last used date
    const roleLastUsed = role.RoleLastUsed?.LastUsedDate;
    if (!roleLastUsed || (Date.now() - new Date(roleLastUsed).getTime()) > 90 * 24 * 60 * 60 * 1000) {
        score += 20;
    }

    return Math.min(score, 100);
}

async function storeAnalysisResults(analysis) {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    await dynamodb.put({
        TableName: process.env.ANALYSIS_TABLE || 'iam-analysis-results',
        Item: {
            analysisId: `analysis-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...analysis
        }
    }).promise();
}

async function sendSecurityAlert(analysis) {
    const sns = new AWS.SNS();
    await sns.publish({
        TopicArn: process.env.ALERT_TOPIC_ARN,
        Subject: 'IAM Security Alert: High-Risk Roles Detected',
        Message: JSON.stringify({
            message: `Found ${analysis.highRiskRoles.length} high-risk IAM roles`,
            roles: analysis.highRiskRoles.map(r => r.roleName),
            timestamp: new Date().toISOString()
        }, null, 2)
    }).promise();
}
