/**
 * Bulk WorkSpaces Operations API
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  WorkSpacesClient,
  StartWorkspacesCommand,
  StopWorkspacesCommand,
  RebootWorkspacesCommand,
  TerminateWorkspacesCommand,
} from '@aws-sdk/client-workspaces';

const workspacesClient = new WorkSpacesClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * POST /api/workspaces/bulk - Bulk Operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workspaceIds } = body;

    if (!action || !Array.isArray(workspaceIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    let command;
    switch (action) {
      case 'start':
        command = new StartWorkspacesCommand({
          StartWorkspaceRequests: workspaceIds.map((id) => ({ WorkspaceId: id })),
        });
        break;
      case 'stop':
        command = new StopWorkspacesCommand({
          StopWorkspaceRequests: workspaceIds.map((id) => ({ WorkspaceId: id })),
        });
        break;
      case 'reboot':
        command = new RebootWorkspacesCommand({
          RebootWorkspaceRequests: workspaceIds.map((id) => ({ WorkspaceId: id })),
        });
        break;
      case 'terminate':
        command = new TerminateWorkspacesCommand({
          TerminateWorkspaceRequests: workspaceIds.map((id) => ({ WorkspaceId: id })),
        });
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported action' },
          { status: 400 }
        );
    }

    const response = await workspacesClient.send(command);

    return NextResponse.json({
      success: true,
      data: {
        batchId: `batch-${Date.now()}`,
        action,
        totalRequests: workspaceIds.length,
      },
    }, { status: 202 });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute bulk operation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workspaces/bulk/:batchId - Get batch operation status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const batchId = params.batchId;

    // In a real implementation, you would fetch the status from a database or cache
    // For now, return a mock status
    return NextResponse.json({
      success: true,
      data: {
        batchId,
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching batch status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch batch status' },
      { status: 500 }
    );
  }
}
