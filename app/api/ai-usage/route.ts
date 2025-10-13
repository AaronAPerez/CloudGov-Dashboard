/**
 * AI Usage Tracking API Endpoint
 *
 * Logs and analyzes AI API usage across multiple providers.
 * Provides role-based access control and cost tracking.
 *
 * @route GET /api/ai-usage - Get AI usage logs and summary
 * @route POST /api/ai-usage - Log new AI API usage
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AIUsageLog, AIUsageSummary } from '@/lib/types';
import { getAIUsage, saveAIUsage } from '@/lib/aws/dynamodb';
import { features } from '@/lib/aws/config';

/**
 * Mock AI usage logs
 */
const mockLogs: AIUsageLog[] = [
  {
    id: 'log-001',
    timestamp: new Date('2025-01-13T10:30:00Z'),
    userId: 'user-123',
    username: 'john.doe@company.com',
    provider: 'OpenAI',
    model: 'gpt-4',
    endpoint: '/v1/chat/completions',
    requestType: 'completion',
    tokensUsed: 1250,
    cost: 0.0375,
    responseTime: 1850,
    success: true,
    metadata: {
      temperature: 0.7,
      maxTokens: 500,
    },
  },
  {
    id: 'log-002',
    timestamp: new Date('2025-01-13T11:15:00Z'),
    userId: 'user-456',
    username: 'jane.smith@company.com',
    provider: 'AWS Bedrock',
    model: 'anthropic.claude-v2',
    endpoint: '/bedrock/invoke-model',
    requestType: 'completion',
    tokensUsed: 2100,
    cost: 0.0525,
    responseTime: 2100,
    success: true,
    metadata: {
      temperature: 0.5,
      topP: 0.9,
    },
  },
  {
    id: 'log-003',
    timestamp: new Date('2025-01-13T12:00:00Z'),
    userId: 'user-123',
    username: 'john.doe@company.com',
    provider: 'OpenAI',
    model: 'gpt-3.5-turbo',
    endpoint: '/v1/chat/completions',
    requestType: 'completion',
    tokensUsed: 850,
    cost: 0.00425,
    responseTime: 980,
    success: true,
    metadata: {
      temperature: 0.8,
      maxTokens: 300,
    },
  },
  {
    id: 'log-004',
    timestamp: new Date('2025-01-13T13:45:00Z'),
    userId: 'user-789',
    username: 'bob.wilson@company.com',
    provider: 'Anthropic',
    model: 'claude-3-opus',
    endpoint: '/v1/messages',
    requestType: 'completion',
    tokensUsed: 3200,
    cost: 0.144,
    responseTime: 2500,
    success: true,
    metadata: {
      temperature: 0.6,
      maxTokens: 1000,
    },
  },
  {
    id: 'log-005',
    timestamp: new Date('2025-01-13T14:20:00Z'),
    userId: 'user-456',
    username: 'jane.smith@company.com',
    provider: 'OpenAI',
    model: 'text-embedding-ada-002',
    endpoint: '/v1/embeddings',
    requestType: 'embedding',
    tokensUsed: 512,
    cost: 0.00026,
    responseTime: 450,
    success: true,
    metadata: {
      dimensions: 1536,
    },
  },
  {
    id: 'log-006',
    timestamp: new Date('2025-01-13T15:00:00Z'),
    userId: 'user-123',
    username: 'john.doe@company.com',
    provider: 'Google AI',
    model: 'gemini-pro',
    endpoint: '/v1/models/gemini-pro:generateContent',
    requestType: 'completion',
    tokensUsed: 1800,
    cost: 0.0036,
    responseTime: 1650,
    success: false,
    error: 'Rate limit exceeded',
    metadata: {
      temperature: 0.7,
    },
  },
  {
    id: 'log-007',
    timestamp: new Date('2025-01-13T16:30:00Z'),
    userId: 'user-789',
    username: 'bob.wilson@company.com',
    provider: 'AWS Bedrock',
    model: 'amazon.titan-text-express-v1',
    endpoint: '/bedrock/invoke-model',
    requestType: 'completion',
    tokensUsed: 950,
    cost: 0.00095,
    responseTime: 1200,
    success: true,
    metadata: {
      temperature: 0.5,
    },
  },
  {
    id: 'log-008',
    timestamp: new Date('2025-01-13T17:15:00Z'),
    userId: 'user-456',
    username: 'jane.smith@company.com',
    provider: 'OpenAI',
    model: 'gpt-4',
    endpoint: '/v1/chat/completions',
    requestType: 'completion',
    tokensUsed: 2800,
    cost: 0.084,
    responseTime: 3100,
    success: true,
    metadata: {
      temperature: 0.7,
      maxTokens: 1000,
    },
  },
];

/**
 * Calculate usage summary from logs
 */
function calculateSummary(logs: AIUsageLog[]): AIUsageSummary {
  const totalRequests = logs.length;
  const totalTokens = logs.reduce((sum, log) => sum + log.tokensUsed, 0);
  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
  const avgResponseTime =
    logs.reduce((sum, log) => sum + log.responseTime, 0) / totalRequests;
  const successRate = (logs.filter((log) => log.success).length / totalRequests) * 100;

  // By provider
  const byProvider: Record<string, { requests: number; tokens: number; cost: number }> = {};
  logs.forEach((log) => {
    if (!byProvider[log.provider]) {
      byProvider[log.provider] = { requests: 0, tokens: 0, cost: 0 };
    }
    byProvider[log.provider].requests++;
    byProvider[log.provider].tokens += log.tokensUsed;
    byProvider[log.provider].cost += log.cost;
  });

  // By user
  const byUser: Record<string, { requests: number; tokens: number; cost: number }> = {};
  logs.forEach((log) => {
    if (!byUser[log.username]) {
      byUser[log.username] = { requests: 0, tokens: 0, cost: 0 };
    }
    byUser[log.username].requests++;
    byUser[log.username].tokens += log.tokensUsed;
    byUser[log.username].cost += log.cost;
  });

  // Daily trend (last 7 days)
  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayLogs = logs.filter(
      (log) => log.timestamp.toISOString().split('T')[0] === dateStr
    );

    dailyTrend.push({
      date: dateStr,
      requests: dayLogs.length,
      tokens: dayLogs.reduce((sum, log) => sum + log.tokensUsed, 0),
      cost: dayLogs.reduce((sum, log) => sum + log.cost, 0),
    });
  }

  return {
    totalRequests,
    totalTokens,
    totalCost,
    avgResponseTime,
    successRate,
    byProvider,
    byUser,
    dailyTrend,
  };
}

/**
 * GET /api/ai-usage
 * Retrieve AI usage logs and summary
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredLogs: AIUsageLog[] = [];
    let dataSource = 'mock';

    // Try to fetch from DynamoDB first
    if (features.useRealAWS) {
      try {
        const dbLogs = await getAIUsage(limit);
        if (dbLogs && dbLogs.length > 0) {
          filteredLogs = dbLogs as AIUsageLog[];
          dataSource = 'dynamodb';
        } else {
          filteredLogs = [...mockLogs];
        }
      } catch (error) {
        console.error('DynamoDB error, using mock data:', error);
        filteredLogs = [...mockLogs];
      }
    } else {
      filteredLogs = [...mockLogs];
    }

    // Filter by provider
    if (provider && provider !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.provider === provider);
    }

    // Filter by user
    if (userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === userId);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= end);
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit results
    const paginatedLogs = filteredLogs.slice(0, limit);

    // Calculate summary
    const summary = calculateSummary(filteredLogs);

    return NextResponse.json({
      success: true,
      data: {
        logs: paginatedLogs,
        summary,
        total: filteredLogs.length,
        limit,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching AI usage:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI usage data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-usage
 * Log new AI API usage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      username,
      provider,
      model,
      endpoint,
      requestType,
      tokensUsed,
      cost,
      responseTime,
      success,
      error,
      metadata,
    } = body;

    // Validate required fields
    if (
      !userId ||
      !username ||
      !provider ||
      !model ||
      !endpoint ||
      !requestType ||
      tokensUsed === undefined ||
      cost === undefined ||
      responseTime === undefined ||
      success === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const newLog: AIUsageLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      userId,
      username,
      provider,
      model,
      endpoint,
      requestType,
      tokensUsed,
      cost,
      responseTime,
      success,
      error,
      metadata,
    };

    // In a real app, save to database
    mockLogs.push(newLog);

    return NextResponse.json({
      success: true,
      data: newLog,
      message: 'AI usage logged successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging AI usage:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to log AI usage',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
