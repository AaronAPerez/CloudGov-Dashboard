/**
 * useResources Hook
 * 
 * Custom React hook for fetching and managing AWS resource data.
 * Uses SWR for data fetching, caching, and revalidation.
 * 
 * Features:
 * - Automatic caching and revalidation
 * - Loading and error states
 * - Real-time updates
 * - Polling support
 * - Filter management
 * 
 * Business Value:
 * - Consistent data fetching pattern
 * - Reduced API calls through caching
 * - Better user experience with optimistic updates
 * 
 * @example
 * const { resources, isLoading, error, refetch } = useResources({
 *   type: 'EC2',
 *   status: 'running'
 * });
 */

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import type { AWSResource, AWSResourceType, ResourceStatus, FilterParams } from '@/lib/types';

/**
 * API response structure
 */
interface ResourcesResponse {
  success: boolean;
  data: AWSResource[];
  metadata: {
    total: number;
    offset: number;
    limit: number;
    count: number;
  };
  timestamp: string;
}

/**
 * Hook options
 */
interface UseResourcesOptions {
  /** Filter by resource type */
  type?: AWSResourceType;
  /** Filter by status */
  status?: ResourceStatus;
  /** Filter by region */
  region?: string;
  /** Filter by owner */
  owner?: string;
  /** Number of results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Enable automatic polling (in milliseconds) */
  refreshInterval?: number;
  /** Disable automatic fetching */
  disabled?: boolean;
}

/**
 * Fetcher function for SWR
 */
const fetcher = async (url: string): Promise<ResourcesResponse> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch resources');
  }
  
  return response.json();
};

/**
 * Build query string from options
 */
function buildQueryString(options: UseResourcesOptions): string {
  const params = new URLSearchParams();
  
  if (options.type) params.append('type', options.type);
  if (options.status) params.append('status', options.status);
  if (options.region) params.append('region', options.region);
  if (options.owner) params.append('owner', options.owner);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * useResources Hook
 * 
 * Fetch and manage AWS resources with filtering and pagination
 */
export function useResources(options: UseResourcesOptions = {}) {
  // Build API URL with query parameters
  const queryString = buildQueryString(options);
  const apiUrl = options.disabled ? null : `/api/resources${queryString}`;

  // Use SWR for data fetching
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<ResourcesResponse>(
    apiUrl,
    fetcher,
    {
      // Revalidate on focus
      revalidateOnFocus: true,
      // Revalidate on reconnect
      revalidateOnReconnect: true,
      // Refresh interval (if specified)
      refreshInterval: options.refreshInterval,
      // Keep previous data while loading new data
      keepPreviousData: true,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  /**
   * Refetch data manually
   */
  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  /**
   * Update a single resource optimistically
   */
  const updateResource = useCallback(
    async (resourceId: string, updates: Partial<AWSResource>) => {
      if (!data) return;

      // Optimistic update
      const optimisticData: ResourcesResponse = {
        ...data,
        data: data.data.map(resource =>
          resource.id === resourceId
            ? { ...resource, ...updates }
            : resource
        ),
      };

      // Update cache optimistically
      await mutate(optimisticData, false);

      // TODO: Make actual API call here
      // await fetch(`/api/resources/${resourceId}`, { method: 'PATCH', body: JSON.stringify(updates) });

      // Revalidate
      await mutate();
    },
    [data, mutate]
  );

  /**
   * Delete a resource optimistically
   */
  const deleteResource = useCallback(
    async (resourceId: string) => {
      if (!data) return;

      // Optimistic update
      const optimisticData: ResourcesResponse = {
        ...data,
        data: data.data.filter(resource => resource.id !== resourceId),
        metadata: {
          ...data.metadata,
          total: data.metadata.total - 1,
          count: data.metadata.count - 1,
        },
      };

      // Update cache optimistically
      await mutate(optimisticData, false);

      // TODO: Make actual API call here
      // await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' });

      // Revalidate
      await mutate();
    },
    [data, mutate]
  );

  return {
    // Data
    resources: data?.data || [],
    metadata: data?.metadata,
    
    // Loading states
    isLoading,
    isValidating,
    
    // Error state
    error: error?.message,
    
    // Actions
    refetch,
    updateResource,
    deleteResource,
  };
}

/**
 * useResourceStats Hook
 * 
 * Get aggregated statistics about resources
 */
export function useResourceStats() {
  const { resources, isLoading, error } = useResources();

  // Calculate statistics
  const stats = {
    total: resources.length,
    byType: {} as Record<AWSResourceType, number>,
    byStatus: {} as Record<ResourceStatus, number>,
    byRegion: {} as Record<string, number>,
    totalMonthlyCost: 0,
  };

  resources.forEach(resource => {
    // Count by type
    stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
    
    // Count by status
    stats.byStatus[resource.status] = (stats.byStatus[resource.status] || 0) + 1;
    
    // Count by region
    stats.byRegion[resource.region] = (stats.byRegion[resource.region] || 0) + 1;
    
    // Sum costs
    stats.totalMonthlyCost += resource.monthlyCost;
  });

  return {
    stats,
    isLoading,
    error,
  };
}