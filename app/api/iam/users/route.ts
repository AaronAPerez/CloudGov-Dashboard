/**
 * IAM Users API Endpoint
 *
 * Simulates IAM user management with least-privilege access patterns.
 * Demonstrates role-based access control and permission auditing.
 *
 * @route GET /api/iam/users - List all IAM users
 * @route POST /api/iam/users - Create new IAM user
 */

import { NextRequest, NextResponse } from 'next/server';
import type { IAMUser } from '@/lib/types';

/**
 * Mock IAM users with varying access levels
 */
const mockUsers: IAMUser[] = [
  {
    id: 'user-001',
    username: 'john.admin',
    arn: 'arn:aws:iam::123456789012:user/john.admin',
    email: 'john.admin@company.com',
    roles: ['arn:aws:iam::123456789012:role/AdminRole'],
    permissions: ['*:*'],
    mfaEnabled: true,
    lastActivity: new Date('2025-01-13T15:30:00Z'),
    accessLevel: 'admin',
    riskScore: 85,
  },
  {
    id: 'user-002',
    username: 'jane.developer',
    arn: 'arn:aws:iam::123456789012:user/jane.developer',
    email: 'jane.developer@company.com',
    roles: ['arn:aws:iam::123456789012:role/DeveloperRole'],
    permissions: [
      's3:*',
      'lambda:*',
      'dynamodb:*',
      'ec2:Describe*',
      'logs:*',
    ],
    mfaEnabled: true,
    lastActivity: new Date('2025-01-13T16:45:00Z'),
    accessLevel: 'power-user',
    riskScore: 45,
  },
  {
    id: 'user-003',
    username: 'bob.readonly',
    arn: 'arn:aws:iam::123456789012:user/bob.readonly',
    email: 'bob.readonly@company.com',
    roles: ['arn:aws:iam::123456789012:role/ReadOnlyAuditor'],
    permissions: [
      's3:Get*',
      's3:List*',
      'ec2:Describe*',
      'lambda:Get*',
      'lambda:List*',
    ],
    mfaEnabled: true,
    lastActivity: new Date('2025-01-13T14:20:00Z'),
    accessLevel: 'read-only',
    riskScore: 10,
  },
  {
    id: 'user-004',
    username: 'alice.poweruser',
    arn: 'arn:aws:iam::123456789012:user/alice.poweruser',
    email: 'alice.poweruser@company.com',
    roles: ['arn:aws:iam::123456789012:role/DeveloperRole'],
    permissions: [
      's3:*',
      'lambda:*',
      'dynamodb:*',
      'ec2:*',
      'rds:Describe*',
    ],
    mfaEnabled: false,
    lastActivity: new Date('2025-01-13T17:00:00Z'),
    accessLevel: 'power-user',
    riskScore: 65,
  },
  {
    id: 'user-005',
    username: 'charlie.lambda',
    arn: 'arn:aws:iam::123456789012:user/charlie.lambda',
    email: 'charlie.lambda@company.com',
    roles: ['arn:aws:iam::123456789012:role/LambdaExecutionRole'],
    permissions: [
      'lambda:InvokeFunction',
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
      'dynamodb:GetItem',
      'dynamodb:Query',
    ],
    mfaEnabled: true,
    lastActivity: new Date('2025-01-13T13:15:00Z'),
    accessLevel: 'read-only',
    riskScore: 15,
  },
  {
    id: 'user-006',
    username: 'diana.s3',
    arn: 'arn:aws:iam::123456789012:user/diana.s3',
    email: 'diana.s3@company.com',
    roles: ['arn:aws:iam::123456789012:role/S3DataProcessorRole'],
    permissions: [
      's3:GetObject',
      's3:PutObject',
      's3:DeleteObject',
      's3:ListBucket',
    ],
    mfaEnabled: true,
    lastActivity: new Date('2025-01-13T12:30:00Z'),
    accessLevel: 'power-user',
    riskScore: 25,
  },
  {
    id: 'user-007',
    username: 'eve.inactive',
    arn: 'arn:aws:iam::123456789012:user/eve.inactive',
    email: 'eve.inactive@company.com',
    roles: ['arn:aws:iam::123456789012:role/ReadOnlyAuditor'],
    permissions: ['s3:Get*', 'ec2:Describe*'],
    mfaEnabled: false,
    lastActivity: new Date('2024-11-15T10:00:00Z'),
    accessLevel: 'read-only',
    riskScore: 30,
  },
  {
    id: 'user-008',
    username: 'frank.contractor',
    arn: 'arn:aws:iam::123456789012:user/frank.contractor',
    email: 'frank.contractor@external.com',
    roles: ['arn:aws:iam::123456789012:role/EC2DefaultRole'],
    permissions: ['ec2:Describe*', 's3:GetObject'],
    mfaEnabled: true,
    lastActivity: new Date('2025-01-12T09:00:00Z'),
    accessLevel: 'read-only',
    riskScore: 20,
  },
];

/**
 * GET /api/iam/users
 * Retrieve all IAM users with access analysis
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 250));

    const { searchParams } = new URL(request.url);
    const accessLevel = searchParams.get('accessLevel');
    const mfaEnabled = searchParams.get('mfaEnabled');
    const riskLevel = searchParams.get('riskLevel');
    const search = searchParams.get('search');

    let filteredUsers = [...mockUsers];

    // Filter by access level
    if (accessLevel && accessLevel !== 'all') {
      filteredUsers = filteredUsers.filter((u) => u.accessLevel === accessLevel);
    }

    // Filter by MFA status
    if (mfaEnabled === 'true') {
      filteredUsers = filteredUsers.filter((u) => u.mfaEnabled);
    } else if (mfaEnabled === 'false') {
      filteredUsers = filteredUsers.filter((u) => !u.mfaEnabled);
    }

    // Filter by risk level
    if (riskLevel === 'high') {
      filteredUsers = filteredUsers.filter((u) => u.riskScore >= 60);
    } else if (riskLevel === 'medium') {
      filteredUsers = filteredUsers.filter((u) => u.riskScore >= 30 && u.riskScore < 60);
    } else if (riskLevel === 'low') {
      filteredUsers = filteredUsers.filter((u) => u.riskScore < 30);
    }

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    // Calculate summary statistics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const summary = {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter((u) => u.lastActivity > thirtyDaysAgo).length,
      inactiveUsers: mockUsers.filter((u) => u.lastActivity <= thirtyDaysAgo).length,
      mfaEnabled: mockUsers.filter((u) => u.mfaEnabled).length,
      mfaDisabled: mockUsers.filter((u) => !u.mfaEnabled).length,
      byAccessLevel: {
        admin: mockUsers.filter((u) => u.accessLevel === 'admin').length,
        powerUser: mockUsers.filter((u) => u.accessLevel === 'power-user').length,
        readOnly: mockUsers.filter((u) => u.accessLevel === 'read-only').length,
      },
      highRisk: mockUsers.filter((u) => u.riskScore >= 60).length,
      mediumRisk: mockUsers.filter((u) => u.riskScore >= 30 && u.riskScore < 60).length,
      lowRisk: mockUsers.filter((u) => u.riskScore < 30).length,
      averageRiskScore:
        mockUsers.reduce((sum, u) => sum + u.riskScore, 0) / mockUsers.length,
    };

    // Least privilege recommendations
    const recommendations = [];

    // Check for users without MFA
    const noMfaUsers = mockUsers.filter((u) => !u.mfaEnabled);
    if (noMfaUsers.length > 0) {
      recommendations.push({
        type: 'security',
        severity: 'high',
        title: 'Enable MFA for all users',
        description: `${noMfaUsers.length} user(s) do not have MFA enabled`,
        affectedUsers: noMfaUsers.map((u) => u.username),
      });
    }

    // Check for inactive users
    const inactiveUsers = mockUsers.filter((u) => u.lastActivity <= thirtyDaysAgo);
    if (inactiveUsers.length > 0) {
      recommendations.push({
        type: 'access',
        severity: 'medium',
        title: 'Review inactive users',
        description: `${inactiveUsers.length} user(s) have been inactive for >30 days`,
        affectedUsers: inactiveUsers.map((u) => u.username),
      });
    }

    // Check for overly permissive users
    const highRiskUsers = mockUsers.filter((u) => u.riskScore >= 60);
    if (highRiskUsers.length > 0) {
      recommendations.push({
        type: 'permissions',
        severity: 'high',
        title: 'Reduce excessive permissions',
        description: `${highRiskUsers.length} user(s) have high-risk permission sets`,
        affectedUsers: highRiskUsers.map((u) => u.username),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        users: filteredUsers,
        summary,
        recommendations,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching IAM users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch IAM users',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/iam/users
 * Create a new IAM user (simulated)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, roles, accessLevel, mfaEnabled } = body;

    // Validate required fields
    if (!username || !email || !roles || !accessLevel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: username, email, roles, accessLevel',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Calculate risk score based on access level and MFA
    let riskScore = 0;
    if (accessLevel === 'admin') {
      riskScore = 70;
    } else if (accessLevel === 'power-user') {
      riskScore = 40;
    } else {
      riskScore = 15;
    }

    // Reduce risk if MFA is enabled
    if (mfaEnabled) {
      riskScore = Math.max(riskScore - 15, 5);
    } else {
      riskScore += 20;
    }

    // Generate permissions based on access level
    let permissions: string[] = [];
    if (accessLevel === 'admin') {
      permissions = ['*:*'];
    } else if (accessLevel === 'power-user') {
      permissions = ['s3:*', 'lambda:*', 'dynamodb:*', 'ec2:Describe*'];
    } else {
      permissions = ['s3:Get*', 'ec2:Describe*'];
    }

    const newUser: IAMUser = {
      id: `user-${Date.now()}`,
      username,
      arn: `arn:aws:iam::123456789012:user/${username}`,
      email,
      roles,
      permissions,
      mfaEnabled: mfaEnabled || false,
      lastActivity: new Date(),
      accessLevel,
      riskScore,
    };

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'IAM user created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating IAM user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create IAM user',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
