/**
 * useWorkSpaces Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { workspacesClient } from '@/lib/api/workspaces-client';
import { WorkSpace } from '@/lib/types/workspaces';

export function useWorkSpaces() {
  const [workspaces, setWorkSpaces] = useState<WorkSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkSpaces = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await workspacesClient.listWorkSpaces();
      setWorkSpaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkSpaces();
  }, [fetchWorkSpaces]);

  return {
    workspaces,
    bundles: [],
    directories: [],
    metrics: null,
    isLoading,
    error,
    refetch: fetchWorkSpaces,
    createWorkSpace: workspacesClient.createWorkSpace.bind(workspacesClient),
    deleteWorkSpace: workspacesClient.deleteWorkSpace.bind(workspacesClient),
    rebootWorkSpace: workspacesClient.rebootWorkSpace.bind(workspacesClient),
    rebuildWorkSpace: async () => {},
    startWorkSpaces: workspacesClient.startWorkSpaces.bind(workspacesClient),
    stopWorkSpaces: workspacesClient.stopWorkSpaces.bind(workspacesClient),
    modifyWorkSpace: async () => {},
  };
}
