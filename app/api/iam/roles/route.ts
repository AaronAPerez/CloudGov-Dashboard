/**
 * IAM Roles API Endpoint
 *
 * Simulates AWS IAM role management with least-privilege patterns.
 * Demonstrates security best practices and risk assessment.
 *
 * @route GET /api/iam/roles - List all IAM roles
 * @route POST /api/iam/roles - Create new IAM role
 */

import { NextRequest, NextResponse } from 'next/server';
import type { IAMRole, IAMPolicy, IAMPolicyDocument } from '@/lib/types';
import { getIAMRoles, saveIAMRole } from '@/lib/aws/dynamodb';
import { features } from '@/lib/aws/config';

/**
 * Mock IAM policies with varying risk levels
 */
const mockPolicies: IAMPolicy[] = [
  {
    id: 'arn:aws:iam::aws:policy/ReadOnlyAccess',
    name: 'ReadOnlyAccess',
    type: 'AWS Managed',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['s3:Get*', 's3:List*', 'ec2:Describe*', 'dynamodb:Describe*'],
          Resource: '*',
        },
      ],
    },
    attachedRolesCount: 12,
    isHighRisk: false,
  },
  {
    id: 'arn:aws:iam::aws:policy/PowerUserAccess',
    name: 'PowerUserAccess',
    type: 'AWS Managed',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: '*',
          Resource: '*',
        },
        {
          Effect: 'Deny',
          Action: ['iam:*', 'organizations:*', 'account:*'],
          Resource: '*',
        },
      ],
    },
    attachedRolesCount: 5,
    isHighRisk: true,
  },
  {
    id: 'arn:aws:iam::123456789012:policy/S3BucketAccess',
    name: 'S3BucketAccess',
    type: 'Customer Managed',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
          Resource: 'arn:aws:s3:::my-app-bucket/*',
        },
      ],
    },
    attachedRolesCount: 3,
    isHighRisk: false,
  },
  {
    id: 'arn:aws:iam::aws:policy/AdministratorAccess',
    name: 'AdministratorAccess',
    type: 'AWS Managed',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: '*',
          Resource: '*',
        },
      ],
    },
    attachedRolesCount: 2,
    isHighRisk: true,
  },
  {
    id: 'arn:aws:iam::123456789012:policy/LambdaExecutionRole',
    name: 'LambdaExecutionRole',
    type: 'Customer Managed',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
          Resource: 'arn:aws:logs:*:*:*',
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem', 'dynamodb:Query'],
          Resource: 'arn:aws:dynamodb:us-east-1:123456789012:table/Users',
        },
      ],
    },
    attachedRolesCount: 8,
    isHighRisk: false,
  },
];

/**
 * Mock IAM roles with realistic data
 */
const mockRoles: IAMRole[] = [
  {
    arn: 'arn:aws:iam::123456789012:role/AdminRole',
    name: 'AdminRole',
    description: 'Full administrator access - USE WITH CAUTION',
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2025-01-10'),
    policies: [mockPolicies[3]], // AdministratorAccess
    inlinePolicies: [],
    isOverlyPermissive: true,
    trustedEntities: ['arn:aws:iam::123456789012:user/admin'],
    permissionsBoundary: undefined,
    tags: { Environment: 'Production', Team: 'Platform' },
    riskScore: 95,
  },
  {
    arn: 'arn:aws:iam::123456789012:role/LambdaExecutionRole',
    name: 'LambdaExecutionRole',
    description: 'Least-privilege role for Lambda functions',
    createdAt: new Date('2024-03-20'),
    lastUsed: new Date('2025-01-13'),
    policies: [mockPolicies[4]], // LambdaExecutionRole
    inlinePolicies: [],
    isOverlyPermissive: false,
    trustedEntities: ['lambda.amazonaws.com'],
    permissionsBoundary: 'arn:aws:iam::123456789012:policy/DeveloperBoundary',
    tags: { Environment: 'Production', Application: 'UserService' },
    riskScore: 15,
  },
  {
    arn: 'arn:aws:iam::123456789012:role/DeveloperRole',
    name: 'DeveloperRole',
    description: 'Power user access for development team',
    createdAt: new Date('2024-02-10'),
    lastUsed: new Date('2025-01-12'),
    policies: [mockPolicies[1]], // PowerUserAccess
    inlinePolicies: [],
    isOverlyPermissive: true,
    trustedEntities: ['arn:aws:iam::123456789012:user/dev-*'],
    permissionsBoundary: 'arn:aws:iam::123456789012:policy/DeveloperBoundary',
    tags: { Environment: 'Development', Team: 'Engineering' },
    riskScore: 65,
  },
  {
    arn: 'arn:aws:iam::123456789012:role/ReadOnlyAuditor',
    name: 'ReadOnlyAuditor',
    description: 'Read-only access for compliance audits',
    createdAt: new Date('2024-04-05'),
    lastUsed: new Date('2025-01-11'),
    policies: [mockPolicies[0]], // ReadOnlyAccess
    inlinePolicies: [],
    isOverlyPermissive: false,
    trustedEntities: ['arn:aws:iam::123456789012:role/ComplianceTeam'],
    permissionsBoundary: undefined,
    tags: { Environment: 'Production', Team: 'Compliance' },
    riskScore: 5,
  },
  {
    arn: 'arn:aws:iam::123456789012:role/S3DataProcessorRole',
    name: 'S3DataProcessorRole',
    description: 'Scoped access to specific S3 bucket',
    createdAt: new Date('2024-05-18'),
    lastUsed: new Date('2025-01-13'),
    policies: [mockPolicies[2]], // S3BucketAccess
    inlinePolicies: [],
    isOverlyPermissive: false,
    trustedEntities: ['ec2.amazonaws.com'],
    permissionsBoundary: undefined,
    tags: { Environment: 'Production', Application: 'DataPipeline' },
    riskScore: 20,
  },
  {
    arn: 'arn:aws:iam::123456789012:role/EC2DefaultRole',
    name: 'EC2DefaultRole',
    description: 'Default role for EC2 instances',
    createdAt: new Date('2024-06-22'),
    lastUsed: undefined,
    policies: [mockPolicies[0]], // ReadOnlyAccess
    inlinePolicies: [],
    isOverlyPermissive: false,
    trustedEntities: ['ec2.amazonaws.com'],
    permissionsBoundary: undefined,
    tags: { Environment: 'Staging' },
    riskScore: 10,
  },
];

/**
 * GET /api/iam/roles
 * Retrieve all IAM roles with risk analysis
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel'); // 'high', 'medium', 'low'
    const search = searchParams.get('search');

    let filteredRoles: IAMRole[] = [];
    let dataSource = 'mock';

    // Try to fetch from DynamoDB first
    if (features.useRealAWS) {
      try {
        const dbRoles = await getIAMRoles();
        if (dbRoles && dbRoles.length > 0) {
          filteredRoles = dbRoles as IAMRole[];
          dataSource = 'dynamodb';
        } else {
          // If empty, populate with mock data
          filteredRoles = [...mockRoles];
          await Promise.all(mockRoles.map(role => saveIAMRole({ ...role, id: role.arn } as Record<string, unknown>)));
        }
      } catch (error) {
        console.error('DynamoDB error, using mock data:', error);
        filteredRoles = [...mockRoles];
      }
    } else {
      filteredRoles = [...mockRoles];
    }

    // Filter by risk level
    if (riskLevel === 'high') {
      filteredRoles = filteredRoles.filter((r) => r.riskScore >= 60);
    } else if (riskLevel === 'medium') {
      filteredRoles = filteredRoles.filter((r) => r.riskScore >= 30 && r.riskScore < 60);
    } else if (riskLevel === 'low') {
      filteredRoles = filteredRoles.filter((r) => r.riskScore < 30);
    }

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filteredRoles = filteredRoles.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.trustedEntities.some((e) => e.toLowerCase().includes(query))
      );
    }

    // Calculate summary statistics
    const summary = {
      totalRoles: mockRoles.length,
      highRisk: mockRoles.filter((r) => r.riskScore >= 60).length,
      mediumRisk: mockRoles.filter((r) => r.riskScore >= 30 && r.riskScore < 60).length,
      lowRisk: mockRoles.filter((r) => r.riskScore < 30).length,
      overlyPermissive: mockRoles.filter((r) => r.isOverlyPermissive).length,
      withBoundary: mockRoles.filter((r) => r.permissionsBoundary).length,
      averageRiskScore:
        mockRoles.reduce((sum, r) => sum + r.riskScore, 0) / mockRoles.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        roles: filteredRoles,
        summary,
        policies: mockPolicies,
      },
      metadata: {
        source: dataSource,
        note: dataSource === 'dynamodb'
          ? 'Data from DynamoDB'
          : 'Using local mock data. Set USE_REAL_AWS=true to enable DynamoDB.',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching IAM roles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch IAM roles',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/iam/roles
 * Create a new IAM role (simulated)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, policies, trustedEntities, permissionsBoundary } = body;

    // Validate required fields
    if (!name || !description || !policies || !trustedEntities) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, description, policies, trustedEntities',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Calculate risk score based on policies
    let riskScore = 0;
    let isOverlyPermissive = false;

    policies.forEach((policyId: string) => {
      const policy = mockPolicies.find((p) => p.id === policyId);
      if (policy?.isHighRisk) {
        riskScore += 40;
        isOverlyPermissive = true;
      } else {
        riskScore += 10;
      }
    });

    // Reduce risk if permissions boundary is set
    if (permissionsBoundary) {
      riskScore = Math.max(riskScore - 20, 0);
    }

    const newRole: IAMRole = {
      arn: `arn:aws:iam::123456789012:role/${name}`,
      name,
      description,
      createdAt: new Date(),
      lastUsed: undefined,
      policies: policies
        .map((policyId: string) => mockPolicies.find((p) => p.id === policyId))
        .filter(Boolean),
      inlinePolicies: [],
      isOverlyPermissive,
      trustedEntities,
      permissionsBoundary,
      tags: {},
      riskScore,
    };

    // Save to DynamoDB if enabled
    if (features.useRealAWS) {
      try {
        await saveIAMRole({ ...newRole, id: newRole.arn });
      } catch (error) {
        console.error('Failed to save role to DynamoDB:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: newRole,
      message: 'IAM role created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating IAM role:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create IAM role',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
