const AWS = require('aws-sdk');
const costExplorer = new AWS.CostExplorer({ region: 'us-east-1' });

/**
 * AWS Lambda function to calculate and analyze AWS costs
 * Triggered by: EventBridge schedule (daily) or API Gateway
 */
exports.handler = async (event) => {
    console.log('Cost Calculator invoked', JSON.stringify(event));

    try {
        const period = event.queryStringParameters?.period || '30d';
        const groupBy = event.queryStringParameters?.groupBy || 'SERVICE';

        // Calculate costs for the specified period
        const costData = await calculateCosts(period, groupBy);

        // Analyze cost trends and anomalies
        const analysis = await analyzeCostTrends(costData);

        // Store results in DynamoDB
        await storeCostAnalysis(costData, analysis);

        // Send alerts if cost anomalies detected
        if (analysis.anomalies.length > 0) {
            await sendCostAlert(analysis);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                costs: costData,
                analysis,
                period,
                groupBy
            })
        };
    } catch (error) {
        console.error('Error calculating costs:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to calculate costs',
                message: error.message
            })
        };
    }
};

async function calculateCosts(period, groupBy) {
    const now = new Date();
    const days = parseInt(period.replace('d', '')) || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const params = {
        TimePeriod: {
            Start: startDate.toISOString().split('T')[0],
            End: now.toISOString().split('T')[0]
        },
        Granularity: 'DAILY',
        Metrics: ['UnblendedCost'],
        GroupBy: [
            {
                Type: 'DIMENSION',
                Key: groupBy
            }
        ]
    };

    const response = await costExplorer.getCostAndUsage(params).promise();

    const costsByService = {};
    let totalCost = 0;

    response.ResultsByTime.forEach(result => {
        result.Groups.forEach(group => {
            const service = group.Keys[0];
            const cost = parseFloat(group.Metrics.UnblendedCost.Amount);

            if (!costsByService[service]) {
                costsByService[service] = {
                    service,
                    total: 0,
                    daily: []
                };
            }

            costsByService[service].total += cost;
            costsByService[service].daily.push({
                date: result.TimePeriod.Start,
                cost
            });

            totalCost += cost;
        });
    });

    return {
        totalCost,
        period: `${days} days`,
        breakdown: Object.values(costsByService).sort((a, b) => b.total - a.total),
        startDate: startDate.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
    };
}

async function analyzeCostTrends(costData) {
    const analysis = {
        trends: [],
        anomalies: [],
        recommendations: []
    };

    // Analyze each service
    costData.breakdown.forEach(service => {
        const dailyCosts = service.daily.map(d => d.cost);
        const avgCost = dailyCosts.reduce((sum, cost) => sum + cost, 0) / dailyCosts.length;
        const maxCost = Math.max(...dailyCosts);
        const minCost = Math.min(...dailyCosts);

        // Detect trend
        const recentAvg = dailyCosts.slice(-7).reduce((sum, cost) => sum + cost, 0) / 7;
        const olderAvg = dailyCosts.slice(0, 7).reduce((sum, cost) => sum + cost, 0) / 7;
        const trendPercentage = ((recentAvg - olderAvg) / olderAvg) * 100;

        analysis.trends.push({
            service: service.service,
            trend: trendPercentage > 10 ? 'increasing' : trendPercentage < -10 ? 'decreasing' : 'stable',
            percentage: Math.round(trendPercentage),
            avgDailyCost: avgCost.toFixed(2)
        });

        // Detect anomalies (costs > 2x average)
        service.daily.forEach(day => {
            if (day.cost > avgCost * 2) {
                analysis.anomalies.push({
                    service: service.service,
                    date: day.date,
                    cost: day.cost.toFixed(2),
                    average: avgCost.toFixed(2),
                    deviation: ((day.cost / avgCost - 1) * 100).toFixed(1) + '%'
                });
            }
        });

        // Generate recommendations for high-cost services
        if (service.total > costData.totalCost * 0.2) {
            analysis.recommendations.push({
                service: service.service,
                currentCost: service.total.toFixed(2),
                recommendation: `High cost service (${((service.total / costData.totalCost) * 100).toFixed(1)}% of total). Review for optimization opportunities.`
            });
        }
    });

    return analysis;
}

async function storeCostAnalysis(costData, analysis) {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    await dynamodb.put({
        TableName: process.env.COST_TABLE || 'cost-analysis-results',
        Item: {
            analysisId: `cost-${Date.now()}`,
            timestamp: new Date().toISOString(),
            costs: costData,
            analysis
        }
    }).promise();
}

async function sendCostAlert(analysis) {
    const sns = new AWS.SNS();
    await sns.publish({
        TopicArn: process.env.ALERT_TOPIC_ARN,
        Subject: 'AWS Cost Alert: Anomalies Detected',
        Message: JSON.stringify({
            message: `Detected ${analysis.anomalies.length} cost anomalies`,
            anomalies: analysis.anomalies,
            timestamp: new Date().toISOString()
        }, null, 2)
    }).promise();
}
