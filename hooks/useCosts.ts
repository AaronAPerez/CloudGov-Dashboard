/**
 * useCosts Hook
 * 
 * Custom React hook for fetching and managing cost analytics data.
 * Integrates with AWS Cost Explorer API via backend.
 * 
 * Features:
 * - Time range selection (7d, 30d, 90d, 12m)
 * - Service-level breakdown
 * - Cost forecasting
 * - Trend analysis
 * - Automatic caching with SWR
 * 
 * Business Value:
 * - Track spending trends in real-time
 * - Identify cost anomalies quickly
 * - Support budget planning
 * - Enable cost optimization
 * 
 * @example
 * const { costs, summary, isLoading } = useCosts({ range: '30d' });
 */

import useSWR from 'swr';
import { useCallback } from 'react';
import type { CostDataPoint, CostSummary } from '@/lib/types';

/**
 * API response structure
 */
interface CostsResponse {
  success: boolean;
  data: {
    costs: CostDataPoint[];
    summary: CostSummary;
    range: string;
    groupBy: string;
  };
  metadata: {
    count: number;
    totalCost: number;
  };
  timestamp: string;
}

/**
 * Hook options
 */
interface UseCostsOptions {
  /** Time range for cost data */
  range?: '7d' | '30d' | '90d' | '12m';
  /** Group costs by day, service, region, or project */
  groupBy?: 'day' | 'service' | 'region' | 'project';
  /** Filter by specific service */
  service?: string;
  /** Enable automatic polling (in milliseconds) */
  refreshInterval?: number;
  /** Disable automatic fetching */
  disabled?: boolean;
}

/**
 * Fetcher function for SWR
 */
const fetcher = async (url: string): Promise<CostsResponse> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch costs');
  }
  
  return response.json();
};

/**
 * Build query string from options
 */
function buildQueryString(options: UseCostsOptions): string {
  const params = new URLSearchParams();
  
  if (options.range) params.append('range', options.range);
  if (options.groupBy) params.append('groupBy', options.groupBy);
  if (options.service) params.append('service', options.service);
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * useCosts Hook
 * 
 * Fetch and manage cost analytics data
 */
export function useCosts(options: UseCostsOptions = {}) {
  // Default to 30 days
  const defaultOptions = {
    range: '30d' as const,
    groupBy: 'day' as const,
    ...options,
  };

  // Build API URL with query parameters
  const queryString = buildQueryString(defaultOptions);
  const apiUrl = options.disabled ? null : `/api/costs${queryString}`;

  // Use SWR for data fetching
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<CostsResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: options.refreshInterval,
      keepPreviousData: true,
      dedupingInterval: 5000, // Dedupe for 5 seconds (costs don't change rapidly)
    }
  );

  /**
   * Refetch data manually
   */
  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  /**
   * Calculate cost trends
   */
  const calculateTrends = useCallback(() => {
    if (!data?.data.costs) return null;

    const costs = data.data.costs;
    if (costs.length < 2) return null;

    // Calculate average daily cost
    const totalCost = costs.reduce((sum, d) => sum + d.cost, 0);
    const avgDailyCost = totalCost / costs.length;

    // Calculate trend (comparing first half vs second half)
    const midpoint = Math.floor(costs.length / 2);
    const firstHalf = costs.slice(0, midpoint);
    const secondHalf = costs.slice(midpoint);

    const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.cost, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.cost, 0) / secondHalf.length;

    const trendPercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

    return {
      avgDailyCost: Math.floor(avgDailyCost),
      trend: trendPercentage > 0 ? 'increasing' : trendPercentage < 0 ? 'decreasing' : 'stable',
      trendPercentage: Math.floor(trendPercentage * 10) / 10,
      firstHalfAvg: Math.floor(firstHalfAvg),
      secondHalfAvg: Math.floor(secondHalfAvg),
    };
  }, [data]);

  return {
    // Data
    costs: data?.data.costs || [],
    summary: data?.data.summary,
    metadata: data?.metadata,
    
    // Trends
    trends: calculateTrends(),
    
    // Loading states
    isLoading,
    isValidating,
    
    // Error state
    error: error?.message,
    
    // Actions
    refetch,
  };
}

/**
 * useCostAlerts Hook
 * 
 * Monitor costs and generate alerts when thresholds are exceeded
 */
export function useCostAlerts(budgetLimit: number = 15000) {
  const { summary, isLoading, error } = useCosts({ range: '30d' });

  // Calculate alerts
  const alerts = [];

  if (summary) {
    // Current month spending
    const currentSpending = summary.currentMonth;
    const percentOfBudget = (currentSpending / budgetLimit) * 100;

    // Budget threshold alerts
    if (percentOfBudget >= 90) {
      alerts.push({
        type: 'error' as const,
        message: `Critical: ${percentOfBudget.toFixed(0)}% of budget used`,
        detail: `Current spending: $${currentSpending.toLocaleString()} of $${budgetLimit.toLocaleString()}`,
      });
    } else if (percentOfBudget >= 75) {
      alerts.push({
        type: 'warning' as const,
        message: `Warning: ${percentOfBudget.toFixed(0)}% of budget used`,
        detail: `Current spending: $${currentSpending.toLocaleString()} of $${budgetLimit.toLocaleString()}`,
      });
    }

    // Projection alerts
    if (summary.projected > budgetLimit * 1.1) {
      alerts.push({
        type: 'warning' as const,
        message: 'Projected to exceed budget',
        detail: `Projected: $${summary.projected.toLocaleString()} (${((summary.projected / budgetLimit - 1) * 100).toFixed(0)}% over)`,
      });
    }

    // Month-over-month increase
    if (summary.percentageChange > 20) {
      alerts.push({
        type: 'warning' as const,
        message: `Costs up ${summary.percentageChange.toFixed(1)}% vs last month`,
        detail: `Current: $${currentSpending.toLocaleString()}, Previous: $${summary.previousMonth.toLocaleString()}`,
      });
    }
  }

  return {
    alerts,
    hasAlerts: alerts.length > 0,
    criticalAlerts: alerts.filter(a => a.type === 'error').length,
    warningAlerts: alerts.filter(a => a.type === 'warning').length,
    isLoading,
    error,
  };
}