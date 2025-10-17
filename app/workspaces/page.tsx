'use client';

import { useWorkSpaces } from '@/hooks/useWorkSpaces';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardBody, Badge, Button } from '@/components/ui';
import { Monitor, Play, Square, RotateCw, Trash2, Loader2 } from 'lucide-react';

export default function WorkSpacesPage() {
  const {
    workspaces,
    isLoading,
    error,
    startWorkSpaces,
    stopWorkSpaces,
    rebootWorkSpace,
    deleteWorkSpace,
  } = useWorkSpaces();

  if (isLoading) {
    return (
      <DashboardLayout activeRoute="/workspaces">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeRoute="/workspaces">
        <div className="text-center py-12">
          <p className="text-error-600">Error: {error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRoute="/workspaces">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Monitor className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            WorkSpaces
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your AWS WorkSpaces virtual desktop infrastructure
        </p>
      </div>

      <div className="grid gap-6">
        {workspaces.map((workspace) => (
          <Card key={workspace.workspaceId}>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {workspace.userName}
                    </h3>
                    <Badge
                      variant={
                        workspace.state === 'AVAILABLE'
                          ? 'success'
                          : workspace.state === 'STOPPED'
                          ? 'neutral'
                          : 'error'
                      }
                    >
                      {workspace.state}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Workspace ID</p>
                      <p className="font-mono text-neutral-900 dark:text-neutral-100">
                        {workspace.workspaceId}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Compute Type</p>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {workspace.computeTypeName}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Running Mode</p>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {workspace.runningMode}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Monthly Cost</p>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        ${workspace.monthlyCost}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {workspace.state === 'STOPPED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startWorkSpaces([workspace.workspaceId])}
                      leftIcon={<Play className="h-4 w-4" />}
                    >
                      Start
                    </Button>
                  )}
                  {workspace.state === 'AVAILABLE' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => stopWorkSpaces([workspace.workspaceId])}
                        leftIcon={<Square className="h-4 w-4" />}
                      >
                        Stop
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => rebootWorkSpace(workspace.workspaceId)}
                        leftIcon={<RotateCw className="h-4 w-4" />}
                      >
                        Reboot
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWorkSpace(workspace.workspaceId)}
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}