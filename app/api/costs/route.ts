/**
 * Costs API Route
 *
 * Handles AWS cost analytics and trend analysis.
 * In production, this would integrate with AWS Cost Explorer API.
 *
 * Endpoints:
 * - GET /api/costs - Get cost analytics with time range
 * - GET /api/costs?range=30d&groupBy=day - Get costs grouped by day
 *
 * Business Value:
 * - Cost visibility and tracking
 * - Budget forecasting
 * - Spend optimization insights
 *
 * Security:
 * - Input validation with Zod
 * - Error handling
 * - Rate limiting ready
 *
 * @route GET /api/costs
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Query parameters schema for validation
 */
const querySchema = z.object({
  range: z.enum(['7d', '30d', '90d', '12m']).optional().default('30d'),
  groupBy: z.enum(['day', 'service', 'region', 'project']).optional().default('day'),
  service: z.string().optional(),
});

/**
 * Cost data point interface
 */
interface CostDataPoint {
  date: string;
  cost: number;
}

/**
 * Cost summary interface
 */
interface CostSummary {
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
  projected: number;
  history: CostDataPoint[];
}

/**
 * Generate mock cost data
 * In production, this would call AWS Cost Explorer API
 */
function generateMockCosts(range: string, _groupBy: string): { costs: CostDataPoint[], summary: CostSummary } {
  const costs: CostDataPoint[] = [];
  const now = new Date();

  // Determine number of data points based on range
  let dataPoints = 30;
  const baselineCost = 1200;

  switch (range) {
    case '7d':
      dataPoints = 7;
      break;
    case '30d':
      dataPoints = 30;
      break;
    case '90d':
      dataPoints = 90;
      break;
    case '12m':
      dataPoints = 12;
      break;
  }

  // Generate cost data points with realistic variation
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now);

    if (range === '12m') {
      date.setMonth(date.getMonth() - i);
    } else {
      date.setDate(date.getDate() - i);
    }

    // Add realistic cost variation (±15%)
    const variation = (Math.random() - 0.5) * 0.3;
    const cost = Math.floor(baselineCost * (1 + variation));

    costs.push({
      date: range === '12m'
        ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cost,
    });
  }

  // Calculate summary statistics
  const currentMonth = costs.slice(-30).reduce((sum, item) => sum + item.cost, 0);
  const previousMonth = costs.slice(-60, -30).reduce((sum, item) => sum + item.cost, 0) || currentMonth * 0.92;
  const percentageChange = ((currentMonth - previousMonth) / previousMonth) * 100;

  // Project end of month based on current daily average
  const daysElapsed = new Date().getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyAverage = currentMonth / daysElapsed;
  const projected = Math.floor(dailyAverage * daysInMonth);

  const summary: CostSummary = {
    currentMonth,
    previousMonth: Math.floor(previousMonth),
    percentageChange: Math.round(percentageChange * 10) / 10,
    projected,
    history: costs.slice(-12), // Last 12 periods for trend
  };

  return { costs, summary };
}

/**
 * Generate service breakdown data
 */
function generateServiceBreakdown() {
  const services = [
    { name: 'EC2', cost: Math.floor(Math.random() * 15000 + 10000) },
    { name: 'S3', cost: Math.floor(Math.random() * 5000 + 2000) },
    { name: 'RDS', cost: Math.floor(Math.random() * 10000 + 5000) },
    { name: 'Lambda', cost: Math.floor(Math.random() * 3000 + 1000) },
    { name: 'DynamoDB', cost: Math.floor(Math.random() * 4000 + 2000) },
    { name: 'CloudFront', cost: Math.floor(Math.random() * 2000 + 500) },
  ];

  return services;
}

/**
 * Generate region breakdown data
 */
function generateRegionBreakdown() {
  const regions = [
    { name: 'us-east-1', cost: Math.floor(Math.random() * 20000 + 15000) },
    { name: 'us-west-2', cost: Math.floor(Math.random() * 15000 + 10000) },
    { name: 'eu-west-1', cost: Math.floor(Math.random() * 10000 + 5000) },
    { name: 'ap-southeast-1', cost: Math.floor(Math.random() * 8000 + 4000) },
  ];

  return regions;
}

/**
 * GET /api/costs
 *
 * Retrieve cost analytics data
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      range: searchParams.get('range') || undefined,
      groupBy: searchParams.get('groupBy') || undefined,
      service: searchParams.get('service') || undefined,
    };

    // Validate query parameters
    const validatedParams = querySchema.parse(queryParams);

    // Simulate API delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate mock cost data
    const { costs, summary } = generateMockCosts(
      validatedParams.range,
      validatedParams.groupBy
    );

    // Prepare response data
    const responseData = {
      costs,
      summary,
      range: validatedParams.range,
      groupBy: validatedParams.groupBy,
      breakdown: validatedParams.groupBy === 'service'
        ? generateServiceBreakdown()
        : validatedParams.groupBy === 'region'
        ? generateRegionBreakdown()
        : undefined,
    };

    // Return response with metadata
    return NextResponse.json(
      {
        success: true,
        data: responseData,
        metadata: {
          count: costs.length,
          totalCost: costs.reduce((sum, item) => sum + item.cost, 0),
          mock: true,
          note: 'This is mock data. In production, this would connect to AWS Cost Explorer API.',
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.issues,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Error in costs API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/costs
 *
 * Create cost alert or budget (for future implementation)
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not implemented',
      timestamp: new Date().toISOString(),
    },
    { status: 501 }
  );
}
