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
import type { AWSResource, AWSResourceType, ResourceStatus } from '@/lib/types';

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
 * Mock data generator for AWS resources
 * In production, this would call AWS SDK
 */
function generateMockResources(): AWSResource[] {
  const types: AWSResourceType[] = ['EC2', 'S3', 'Lambda', 'RDS', 'DynamoDB', 'ECS', 'WorkSpaces'];
  const statuses: ResourceStatus[] = ['running', 'stopped', 'pending', 'terminated', 'error'];
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
  const owners = ['Alice Chen', 'Bob Smith', 'Carol Johnson', 'David Lee', 'Emma Wilson'];
  const projects = ['Project-Alpha', 'Project-Beta', 'Project-Gamma', 'Project-Delta'];
  const environments = ['Production', 'Staging', 'Development', 'Testing'];

  const resources: AWSResource[] = [];
  
  // Generate 50 mock resources
  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const environment = environments[Math.floor(Math.random() * environments.length)];
    
    // Generate realistic costs based on resource type
    let baseCost = 100;
    if (type === 'EC2') baseCost = Math.random() * 500 + 200;
    if (type === 'RDS') baseCost = Math.random() * 800 + 300;
    if (type === 'S3') baseCost = Math.random() * 100 + 10;
    if (type === 'Lambda') baseCost = Math.random() * 50 + 5;
    if (type === 'DynamoDB') baseCost = Math.random() * 200 + 50;

    resources.push({
      id: `${type.toLowerCase()}-${Math.random().toString(36).substr(2, 12)}`,
      name: `${type}-${environment.toLowerCase()}-${i + 1}`,
      type,
      status,
      region,
      monthlyCost: Math.floor(baseCost),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      owner,
      tags: {
        Project: project,
        Environment: environment,
        ManagedBy: 'CloudGov',
        CostCenter: `CC-${Math.floor(Math.random() * 1000)}`,
      },
    });
  }

  return resources;
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

    // Simulate API delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate mock data (replace with AWS SDK calls)
    let resources = generateMockResources();

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
          mock: true,
          note: 'This is mock data. In production, this would connect to AWS SDK (EC2, S3, Lambda, etc.).',
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