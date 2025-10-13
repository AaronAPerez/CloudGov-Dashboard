const { DefaultAzureCredential } = require('@azure/identity');
const { CostManagementClient } = require('@azure/arm-costmanagement');

/**
 * Azure Function to calculate and analyze Azure costs
 * Triggered by: HTTP request or Timer (daily)
 */
module.exports = async function (context, req) {
    context.log('Cost Calculator function triggered');

    try {
        const period = req.query.period || '30d';
        const groupBy = req.query.groupBy || 'ResourceType';

        // Calculate costs (mocked for demonstration)
        const costData = await calculateCosts(period, groupBy);

        // Analyze trends
        const analysis = await analyzeCostTrends(costData);

        // Store results
        await storeCostAnalysis(context, costData, analysis);

        // Alert on anomalies
        if (analysis.anomalies.length > 0) {
            await sendCostAlert(context, analysis);
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                costs: costData,
                analysis,
                period,
                groupBy
            }
        };
    } catch (error) {
        context.log.error('Error calculating costs:', error);
        context.res = {
            status: 500,
            body: {
                error: 'Failed to calculate costs',
                message: error.message
            }
        };
    }
};

async function calculateCosts(period, groupBy) {
    // Mock cost data - in production, would use Azure Cost Management API
    const days = parseInt(period.replace('d', '')) || 30;

    const mockServices = [
        { name: 'Virtual Machines', dailyCost: 45.50 },
        { name: 'Storage Accounts', dailyCost: 12.30 },
        { name: 'Azure Functions', dailyCost: 8.75 },
        { name: 'SQL Database', dailyCost: 65.00 },
        { name: 'App Service', dailyCost: 35.20 }
    ];

    const breakdown = mockServices.map(service => ({
        service: service.name,
        total: service.dailyCost * days,
        daily: Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            cost: service.dailyCost * (0.9 + Math.random() * 0.2) // Add some variation
        }))
    }));

    const totalCost = breakdown.reduce((sum, service) => sum + service.total, 0);

    return {
        totalCost,
        period: `${days} days`,
        breakdown,
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    };
}

async function analyzeCostTrends(costData) {
    const analysis = {
        trends: [],
        anomalies: [],
        recommendations: []
    };

    costData.breakdown.forEach(service => {
        const dailyCosts = service.daily.map(d => d.cost);
        const avgCost = dailyCosts.reduce((sum, cost) => sum + cost, 0) / dailyCosts.length;

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

        // Detect anomalies
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

        // Recommendations for high-cost services
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

async function storeCostAnalysis(context, costData, analysis) {
    context.log('Storing cost analysis results', {
        totalCost: costData.totalCost,
        anomalies: analysis.anomalies.length
    });
    // In production, would store in Cosmos DB or Azure Table Storage
}

async function sendCostAlert(context, analysis) {
    context.log('COST ALERT: Anomalies detected', {
        count: analysis.anomalies.length,
        anomalies: analysis.anomalies
    });
    // In production, would send email, Teams notification, or Azure Monitor alert
}
