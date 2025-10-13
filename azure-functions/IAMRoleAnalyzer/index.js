const { DefaultAzureCredential } = require('@azure/identity');
const { CosmosClient } = require('@azure/cosmos');

/**
 * Azure Function to analyze IAM roles for security risks
 * Triggered by: HTTP request or Timer (daily)
 */
module.exports = async function (context, req) {
    context.log('IAM Role Analyzer function triggered');

    try {
        // Analyze IAM roles (mocked for demonstration)
        const analysis = await analyzeIAMRoles();

        // Store results in Cosmos DB
        await storeAnalysisResults(context, analysis);

        // Send alerts if high-risk roles found
        if (analysis.highRiskRoles.length > 0) {
            await sendSecurityAlert(context, analysis);
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                message: 'IAM role analysis completed',
                summary: {
                    totalRoles: analysis.totalRoles,
                    highRiskRoles: analysis.highRiskRoles.length,
                    recommendations: analysis.recommendations.length
                }
            }
        };
    } catch (error) {
        context.log.error('Error analyzing IAM roles:', error);
        context.res = {
            status: 500,
            body: {
                error: 'Failed to analyze IAM roles',
                message: error.message
            }
        };
    }
};

async function analyzeIAMRoles() {
    // Mock analysis - in production, would connect to Azure AD or AWS IAM
    const mockRoles = [
        {
            roleName: 'GlobalAdministrator',
            roleId: 'role-admin-001',
            riskScore: 85,
            issues: ['Overly permissive', 'No MFA required']
        },
        {
            roleName: 'Developer',
            roleId: 'role-dev-001',
            riskScore: 35,
            issues: []
        },
        {
            roleName: 'ReadOnly',
            roleId: 'role-readonly-001',
            riskScore: 15,
            issues: []
        }
    ];

    const analysis = {
        totalRoles: mockRoles.length,
        highRiskRoles: mockRoles.filter(r => r.riskScore >= 60),
        mediumRiskRoles: mockRoles.filter(r => r.riskScore >= 30 && r.riskScore < 60),
        lowRiskRoles: mockRoles.filter(r => r.riskScore < 30),
        recommendations: []
    };

    // Generate recommendations
    mockRoles.forEach(role => {
        if (role.issues.length > 0) {
            analysis.recommendations.push({
                roleId: role.roleId,
                roleName: role.roleName,
                issues: role.issues,
                action: 'Review and apply least-privilege principles'
            });
        }
    });

    return analysis;
}

async function storeAnalysisResults(context, analysis) {
    try {
        const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
        const cosmosKey = process.env.COSMOS_KEY;

        if (!cosmosEndpoint || !cosmosKey) {
            context.log.warn('Cosmos DB credentials not configured, skipping storage');
            return;
        }

        const client = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
        const database = client.database('cloudgov');
        const container = database.container('iam-analysis');

        await container.items.create({
            id: `analysis-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...analysis
        });

        context.log('Analysis results stored in Cosmos DB');
    } catch (error) {
        context.log.error('Error storing analysis results:', error);
    }
}

async function sendSecurityAlert(context, analysis) {
    context.log('SECURITY ALERT: High-risk roles detected', {
        count: analysis.highRiskRoles.length,
        roles: analysis.highRiskRoles.map(r => r.roleName)
    });

    // In production, would send email, Teams notification, or Azure Monitor alert
}
