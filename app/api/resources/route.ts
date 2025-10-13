/**
 * Resources API Route
 * 
 * Handles AWS resource data retrieval and management.
 * In production, this would integrate with AWS SDK to fetch real data.
 * 
 * Endpoints:
 * - GET /api/resources - List all resources with optional filtering
 * - GET /api/resources?type=EC2 - Filter by resource type
 * - GET /api/resources?status=running - Filter by status
 * 
 * Business Value:
 * - Centralized resource data access
 * - Consistent API structure
 * - Easy to extend with caching and rate limiting
 * 
 * Security:
 * - Input validation with Zod
 * - Error handling
 * - Rate limiting ready
 * 
 * @route GET /api/resources
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { AWSResource, AWSResourceType } from '@/lib/types';
import { getResources, saveResource } from '@/lib/aws/dynamodb';
import { getAllAWSResources } from '@/lib/aws/services';
import { features } from '@/lib/aws/config';

/**
 * Query parameters schema for validation
 */
const querySchema = z.object({
  type: z.enum(['EC2', 'S3', 'Lambda', 'DynamoDB', 'RDS', 'ECS', 'EKS', 'CloudFront', 'API Gateway', 'WorkSpaces']).optional(),
  status: z.enum(['running', 'stopped', 'terminated', 'pending', 'error']).optional(),
  region: z.string().optional(),
  owner: z.string().optional(),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 100),
  offset: z.string().optional().transform(val => val ? parseInt(val) : 0),
});

/**
 * Fetch real AWS resources using AWS SDK
 */
async function fetchAWSResources(): Promise<AWSResource[]> {
  try {
    // Fetch all AWS resources from actual AWS account
    const resources = await getAllAWSResources();
    return resources;
  } catch (error) {
    console.error('Error fetching AWS resources:', error);
    throw error;
  }
}

/**
 * GET /api/resources
 * 
 * Retrieve AWS resources with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      region: searchParams.get('region') || undefined,
      owner: searchParams.get('owner') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    };

    // Validate query parameters
    const validatedParams = querySchema.parse(queryParams);

    // Fetch real data from AWS SDK
    let resources: AWSResource[] = [];
    let dataSource = 'aws-sdk';

    try {
      // First, try to fetch from AWS SDK (real AWS resources)
      resources = await fetchAWSResources();

      // Save to DynamoDB for caching
      if (features.useRealAWS) {
        try {
          await Promise.all(resources.map(resource => saveResource(resource as unknown as Record<string, unknown>)));
        } catch (dbError) {
          console.error('Failed to save to DynamoDB:', dbError);
        }
      }
    } catch (awsError) {
      console.error('AWS SDK error, trying DynamoDB cache:', awsError);

      // Fallback to DynamoDB cache
      try {
        resources = await getResources() as AWSResource[];
        if (resources.length > 0) {
          dataSource = 'dynamodb-cache';
        } else {
          throw new Error('DynamoDB cache is empty');
        }
      } catch (dbError) {
        console.error('DynamoDB error:', dbError);
        throw new Error('No data source available. Please configure AWS credentials.');
      }
    }

    // Apply filters
    if (validatedParams.type) {
      resources = resources.filter(r => r.type === validatedParams.type);
    }

    if (validatedParams.status) {
      resources = resources.filter(r => r.status === validatedParams.status);
    }

    if (validatedParams.region) {
      resources = resources.filter(r => r.region === validatedParams.region);
    }

    if (validatedParams.owner) {
      resources = resources.filter(r =>
        r.owner.toLowerCase().includes(validatedParams.owner!.toLowerCase())
      );
    }

    // Calculate total count before pagination
    const total = resources.length;

    // Apply pagination
    const offset = validatedParams.offset || 0;
    const limit = validatedParams.limit || 100;
    resources = resources.slice(offset, offset + limit);

    // Return response with metadata
    return NextResponse.json(
      {
        success: true,
        data: resources,
        metadata: {
          total,
          offset,
          limit,
          count: resources.length,
          source: dataSource,
          note: dataSource === 'aws-sdk'
            ? 'Live data from AWS SDK'
            : 'Cached data from DynamoDB',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
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
    console.error('Error in resources API:', error);
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
 * POST /api/resources
 * 
 * Create or update resource (for future implementation)
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