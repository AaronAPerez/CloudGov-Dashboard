/**
 * Individual WorkSpace Operations API
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  WorkSpacesClient,
  TerminateWorkspacesCommand,
  ModifyWorkspacePropertiesCommand,
} from '@aws-sdk/client-workspaces';

const workspacesClient = new WorkSpacesClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * DELETE /api/workspaces/:workspaceId - Delete/Terminate a WorkSpace
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const workspaceId = params.workspaceId;

    const command = new TerminateWorkspacesCommand({
      TerminateWorkspaceRequests: [{ WorkspaceId: workspaceId }],
    });

    await workspacesClient.send(command);

    return NextResponse.json({
      success: true,
      message: 'WorkSpace termination initiated',
    });
  } catch (error) {
    console.error('Error deleting WorkSpace:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete WorkSpace' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workspaces/:workspaceId - Modify a WorkSpace
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const workspaceId = params.workspaceId;
    const body = await request.json();

    const command = new ModifyWorkspacePropertiesCommand({
      WorkspaceId: workspaceId,
      WorkspaceProperties: {
        RunningMode: body.runningMode,
        RunningModeAutoStopTimeoutInMinutes: body.runningModeAutoStopTimeoutInMinutes,
      },
    });

    await workspacesClient.send(command);

    return NextResponse.json({
      success: true,
      message: 'WorkSpace modified successfully',
    });
  } catch (error) {
    console.error('Error modifying WorkSpace:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to modify WorkSpace' },
      { status: 500 }
    );
  }
}
