/**
 * WorkSpaces API Endpoint
 *
 * Simulates AWS WorkSpaces orchestration and management.
 * Provides virtual desktop monitoring and cost optimization.
 *
 * @route GET /api/workspaces - List all WorkSpaces
 * @route POST /api/workspaces - Create new WorkSpace
 * @route PATCH /api/workspaces - Update WorkSpace state
 */

import { NextRequest, NextResponse } from 'next/server';
import type { WorkSpace } from '@/lib/types';
import { getWorkSpaces, saveWorkSpace } from '@/lib/aws/dynamodb';
import { features } from '@/lib/aws/config';

/**
 * Mock WorkSpaces instances
 */
const mockWorkSpaces: WorkSpace[] = [
  {
    id: 'ws-abc123def',
    name: 'John Admin Desktop',
    directoryId: 'd-123456789a',
    username: 'john.admin',
    bundleId: 'wsb-abc123',
    bundleName: 'Performance with Windows 10',
    state: 'AVAILABLE',
    runningMode: 'AUTO_STOP',
    ipAddress: '10.0.1.25',
    subnetId: 'subnet-abc123',
    monthlyCost: 35,
    lastConnection: new Date('2025-01-13T16:30:00Z'),
    computeType: 'PERFORMANCE',
    rootVolumeSize: 80,
    userVolumeSize: 50,
  },
  {
    id: 'ws-def456ghi',
    name: 'Jane Developer Desktop',
    directoryId: 'd-123456789a',
    username: 'jane.developer',
    bundleId: 'wsb-def456',
    bundleName: 'Power with Windows 10',
    state: 'AVAILABLE',
    runningMode: 'ALWAYS_ON',
    ipAddress: '10.0.1.26',
    subnetId: 'subnet-abc123',
    monthlyCost: 52,
    lastConnection: new Date('2025-01-13T17:45:00Z'),
    computeType: 'POWER',
    rootVolumeSize: 80,
    userVolumeSize: 100,
  },
  {
    id: 'ws-ghi789jkl',
    name: 'Bob Contractor Desktop',
    directoryId: 'd-123456789a',
    username: 'bob.contractor',
    bundleId: 'wsb-ghi789',
    bundleName: 'Standard with Windows 10',
    state: 'STOPPED',
    runningMode: 'AUTO_STOP',
    ipAddress: undefined,
    subnetId: 'subnet-def456',
    monthlyCost: 25,
    lastConnection: new Date('2025-01-12T14:20:00Z'),
    computeType: 'STANDARD',
    rootVolumeSize: 80,
    userVolumeSize: 50,
  },
  {
    id: 'ws-jkl012mno',
    name: 'Alice PowerUser Desktop',
    directoryId: 'd-123456789a',
    username: 'alice.poweruser',
    bundleId: 'wsb-jkl012',
    bundleName: 'PowerPro with Windows 10',
    state: 'AVAILABLE',
    runningMode: 'ALWAYS_ON',
    ipAddress: '10.0.1.27',
    subnetId: 'subnet-abc123',
    monthlyCost: 68,
    lastConnection: new Date('2025-01-13T15:10:00Z'),
    computeType: 'POWERPRO',
    rootVolumeSize: 175,
    userVolumeSize: 100,
  },
  {
    id: 'ws-mno345pqr',
    name: 'Charlie Lambda Desktop',
    directoryId: 'd-123456789a',
    username: 'charlie.lambda',
    bundleId: 'wsb-mno345',
    bundleName: 'Value with Windows 10',
    state: 'AVAILABLE',
    runningMode: 'AUTO_STOP',
    ipAddress: '10.0.1.28',
    subnetId: 'subnet-abc123',
    monthlyCost: 22,
    lastConnection: new Date('2025-01-13T13:00:00Z'),
    computeType: 'VALUE',
    rootVolumeSize: 80,
    userVolumeSize: 10,
  },
  {
    id: 'ws-pqr678stu',
    name: 'Diana S3 Desktop',
    directoryId: 'd-123456789b',
    username: 'diana.s3',
    bundleId: 'wsb-pqr678',
    bundleName: 'Performance with Ubuntu 18.04',
    state: 'ERROR',
    runningMode: 'AUTO_STOP',
    ipAddress: undefined,
    subnetId: 'subnet-ghi789',
    monthlyCost: 35,
    lastConnection: new Date('2025-01-11T10:00:00Z'),
    computeType: 'PERFORMANCE',
    rootVolumeSize: 80,
    userVolumeSize: 50,
  },
  {
    id: 'ws-stu901vwx',
    name: 'Eve Inactive Desktop',
    directoryId: 'd-123456789a',
    username: 'eve.inactive',
    bundleId: 'wsb-stu901',
    bundleName: 'Standard with Windows 10',
    state: 'STOPPED',
    runningMode: 'AUTO_STOP',
    ipAddress: undefined,
    subnetId: 'subnet-abc123',
    monthlyCost: 0,
    lastConnection: new Date('2024-11-20T08:00:00Z'),
    computeType: 'STANDARD',
    rootVolumeSize: 80,
    userVolumeSize: 50,
  },
  {
    id: 'ws-vwx234yza',
    name: 'Frank External Desktop',
    directoryId: 'd-123456789c',
    username: 'frank.contractor',
    bundleId: 'wsb-vwx234',
    bundleName: 'Value with Windows 10',
    state: 'AVAILABLE',
    runningMode: 'AUTO_STOP',
    ipAddress: '10.0.2.15',
    subnetId: 'subnet-jkl012',
    monthlyCost: 22,
    lastConnection: new Date('2025-01-13T09:30:00Z'),
    computeType: 'VALUE',
    rootVolumeSize: 80,
    userVolumeSize: 10,
  },
];

/**
 * GET /api/workspaces
 * Retrieve all WorkSpaces with usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const runningMode = searchParams.get('runningMode');
    const search = searchParams.get('search');

    let filteredWorkSpaces: WorkSpace[] = [];
    let dataSource = 'mock';

    // Try to fetch from DynamoDB first
    if (features.useRealAWS) {
      try {
        const dbWorkSpaces = await getWorkSpaces();
        if (dbWorkSpaces && dbWorkSpaces.length > 0) {
          filteredWorkSpaces = dbWorkSpaces as WorkSpace[];
          dataSource = 'dynamodb';
        } else {
          filteredWorkSpaces = [...mockWorkSpaces];
        }
      } catch (error) {
        console.error('DynamoDB error, using mock data:', error);
        filteredWorkSpaces = [...mockWorkSpaces];
      }
    } else {
      filteredWorkSpaces = [...mockWorkSpaces];
    }

    // Filter by state
    if (state && state !== 'all') {
      filteredWorkSpaces = filteredWorkSpaces.filter((ws) => ws.state === state);
    }

    // Filter by running mode
    if (runningMode && runningMode !== 'all') {
      filteredWorkSpaces = filteredWorkSpaces.filter((ws) => ws.runningMode === runningMode);
    }

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filteredWorkSpaces = filteredWorkSpaces.filter(
        (ws) =>
          ws.name.toLowerCase().includes(query) ||
          ws.username.toLowerCase().includes(query) ||
          ws.id.toLowerCase().includes(query)
      );
    }

    // Calculate summary statistics
    const summary = {
      totalWorkSpaces: mockWorkSpaces.length,
      available: mockWorkSpaces.filter((ws) => ws.state === 'AVAILABLE').length,
      stopped: mockWorkSpaces.filter((ws) => ws.state === 'STOPPED').length,
      error: mockWorkSpaces.filter((ws) => ws.state === 'ERROR').length,
      alwaysOn: mockWorkSpaces.filter((ws) => ws.runningMode === 'ALWAYS_ON').length,
      autoStop: mockWorkSpaces.filter((ws) => ws.runningMode === 'AUTO_STOP').length,
      totalMonthlyCost: mockWorkSpaces.reduce((sum, ws) => sum + ws.monthlyCost, 0),
      avgMonthlyCost:
        mockWorkSpaces.reduce((sum, ws) => sum + ws.monthlyCost, 0) / mockWorkSpaces.length,
      byComputeType: {
        VALUE: mockWorkSpaces.filter((ws) => ws.computeType === 'VALUE').length,
        STANDARD: mockWorkSpaces.filter((ws) => ws.computeType === 'STANDARD').length,
        PERFORMANCE: mockWorkSpaces.filter((ws) => ws.computeType === 'PERFORMANCE').length,
        POWER: mockWorkSpaces.filter((ws) => ws.computeType === 'POWER').length,
        POWERPRO: mockWorkSpaces.filter((ws) => ws.computeType === 'POWERPRO').length,
      },
    };

    // Cost optimization recommendations
    const recommendations = [];

    // Check for always-on WorkSpaces
    const alwaysOnWorkSpaces = mockWorkSpaces.filter(
      (ws) => ws.runningMode === 'ALWAYS_ON' && ws.state === 'AVAILABLE'
    );
    if (alwaysOnWorkSpaces.length > 0) {
      const potentialSavings = alwaysOnWorkSpaces.reduce(
        (sum, ws) => sum + ws.monthlyCost * 0.3,
        0
      );
      recommendations.push({
        type: 'cost',
        severity: 'medium',
        title: 'Switch to AUTO_STOP for unused WorkSpaces',
        description: `${alwaysOnWorkSpaces.length} WorkSpace(s) running in ALWAYS_ON mode`,
        potentialSavings,
        affectedWorkSpaces: alwaysOnWorkSpaces.map((ws) => ws.name),
      });
    }

    // Check for inactive WorkSpaces
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const inactiveWorkSpaces = mockWorkSpaces.filter(
      (ws) => ws.lastConnection && ws.lastConnection < thirtyDaysAgo
    );
    if (inactiveWorkSpaces.length > 0) {
      const potentialSavings = inactiveWorkSpaces.reduce((sum, ws) => sum + ws.monthlyCost, 0);
      recommendations.push({
        type: 'cost',
        severity: 'high',
        title: 'Terminate inactive WorkSpaces',
        description: `${inactiveWorkSpaces.length} WorkSpace(s) not used in 30+ days`,
        potentialSavings,
        affectedWorkSpaces: inactiveWorkSpaces.map((ws) => ws.name),
      });
    }

    // Check for error state WorkSpaces
    const errorWorkSpaces = mockWorkSpaces.filter((ws) => ws.state === 'ERROR');
    if (errorWorkSpaces.length > 0) {
      recommendations.push({
        type: 'health',
        severity: 'high',
        title: 'Fix or terminate error WorkSpaces',
        description: `${errorWorkSpaces.length} WorkSpace(s) in ERROR state`,
        affectedWorkSpaces: errorWorkSpaces.map((ws) => ws.name),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        workspaces: filteredWorkSpaces,
        summary,
        recommendations,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching WorkSpaces:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch WorkSpaces',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workspaces
 * Create a new WorkSpace (simulated)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, bundleId, runningMode, computeType, directoryId } = body;

    // Validate required fields
    if (!name || !username || !bundleId || !computeType || !directoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Determine cost based on compute type and running mode
    const costMap: Record<string, number> = {
      VALUE: 22,
      STANDARD: 25,
      PERFORMANCE: 35,
      POWER: 52,
      POWERPRO: 68,
    };

    let monthlyCost = costMap[computeType] || 25;
    if (runningMode === 'ALWAYS_ON') {
      monthlyCost *= 1.5; // 50% more for always-on
    }

    const newWorkSpace: WorkSpace = {
      id: `ws-${Date.now()}`,
      name,
      directoryId,
      username,
      bundleId,
      bundleName: `${computeType} with Windows 10`,
      state: 'PENDING',
      runningMode: runningMode || 'AUTO_STOP',
      ipAddress: undefined,
      subnetId: 'subnet-abc123',
      monthlyCost,
      lastConnection: undefined,
      computeType,
      rootVolumeSize: 80,
      userVolumeSize: 50,
    };

    return NextResponse.json({
      success: true,
      data: newWorkSpace,
      message: 'WorkSpace creation initiated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating WorkSpace:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create WorkSpace',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workspaces
 * Update WorkSpace state (start, stop, reboot)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, action } = body;

    if (!workspaceId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: workspaceId, action',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const validActions = ['start', 'stop', 'reboot', 'rebuild', 'terminate'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Must be one of: ${validActions.join(', ')}`,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        workspaceId,
        action,
        status: 'initiated',
      },
      message: `WorkSpace ${action} initiated`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating WorkSpace:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update WorkSpace',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
