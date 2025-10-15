/**
 * WorkSpace Reboot API
 */

import { NextRequest, NextResponse } from 'next/server';
import { WorkSpacesClient, RebootWorkspacesCommand } from '@aws-sdk/client-workspaces';

const workspacesClient = new WorkSpacesClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * POST /api/workspaces/:workspaceId/reboot - Reboot a WorkSpace
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const workspaceId = params.workspaceId;

    const command = new RebootWorkspacesCommand({
      RebootWorkspaceRequests: [{ WorkspaceId: workspaceId }],
    });

    await workspacesClient.send(command);

    return NextResponse.json({
      success: true,
      message: 'WorkSpace reboot initiated',
    });
  } catch (error) {
    console.error('Error rebooting WorkSpace:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reboot WorkSpace' },
      { status: 500 }
    );
  }
}
