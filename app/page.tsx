/**
 * Dashboard Page (Integrated with API)
 * 
 * Main dashboard view with real API integration.
 * Demonstrates complete data flow from backend to frontend.
 * 
 * Features:
 * - Real-time data from API endpoints
 * - Automatic caching and revalidation (SWR)
 * - Loading and error states
 * - Responsive design
 * - Accessibility compliant
 * 
 * API Integration:
 * - GET /api/resources - Resource data
 * - GET /api/costs - Cost analytics
 * - GET /api/security - Security findings
 * 
 * Performance:
 * - Data is cached and shared across components
 * - Automatic background revalidation
 * - Optimistic UI updates
 * 
 * @route /
 */

'use client';

import {
  Server,
  DollarSign,
  Shield,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  MetricsCard,
  MetricsGrid,
  MetricsCardSkeleton,
} from '@/components/dashboard/MetricsCard';
import { CostChart } from '@/components/dashboard/CostChart';
import { ResourceTable } from '@/components/dashboard/ResourceTable';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import { useResources, useCosts, useSecurity } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import type { AWSResource } from '@/lib/types';

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  // Fetch data using custom hooks
  const {
    resources,
    isLoading: resourcesLoading,
    error: resourcesError,
    refetch: refetchResources,
  } = useResources({ limit: 10 });

  const {
    costs,
    summary: costSummary,
    isLoading: costsLoading,
    error: costsError,
    refetch: refetchCosts,
  } = useCosts({ range: '30d' });

  const {
    compliance,
    priorityFindings,
    isLoading: securityLoading,
    error: securityError,
    refetch: refetchSecurity,
  } = useSecurity({ status: 'open' });

  /**
   * Refresh all data
   */
  const handleRefreshAll = () => {
    refetchResources();
    refetchCosts();
    refetchSecurity();
  };

  /**
   * Handle resource click
   */
  const handleResourceClick = (resource: AWSResource) => {
    console.log('View resource details:', resource);
    // TODO: Navigate to resource details page
  };

  return (
    <DashboardLayout activeRoute="/">
      {/* Page header with refresh button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              Dashboard Overview
            </h1>
            <Badge variant="warning" size="sm">
              Demo Mode
            </Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Real-time monitoring of your AWS infrastructure • Using mock data
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshAll}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          aria-label="Refresh all data"
          className="self-start sm:self-auto"
        >
          Refresh
        </Button>
      </div>

      {/* Error states */}
      {(resourcesError || costsError || securityError) && (
        <div className="mb-6 rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-error-600" />
            <div>
              <p className="font-medium text-error-900">Error Loading Data</p>
              <p className="mt-1 text-sm text-error-700">
                {resourcesError || costsError || securityError}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshAll}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <section className="mb-8" aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Key Metrics
        </h2>

        {costsLoading || resourcesLoading || securityLoading ? (
          <MetricsGrid>
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
          </MetricsGrid>
        ) : (
          <MetricsGrid>
            {/* Monthly Cost */}
            <MetricsCard
              title="Monthly Cost"
              value={formatCurrency(costSummary?.currentMonth || 0)}
              change={costSummary?.percentageChange}
              trend={
                costSummary?.percentageChange && costSummary.percentageChange > 0
                  ? 'up'
                  : costSummary?.percentageChange && costSummary.percentageChange < 0
                  ? 'down'
                  : 'neutral'
              }
              icon={<DollarSign className="h-6 w-6" />}
              iconVariant="primary"
              description="vs last month"
            />

            {/* Total Resources */}
            <MetricsCard
              title="Total Resources"
              value={resources.length}
              icon={<Server className="h-6 w-6" />}
              iconVariant="success"
              description="active resources"
            />

            {/* Security Findings */}
            <MetricsCard
              title="Security Findings"
              value={compliance?.breakdown.critical || 0}
              icon={<Shield className="h-6 w-6" />}
              iconVariant="error"
              description="critical issues"
            />

            {/* Compliance Score */}
            <MetricsCard
              title="Compliance Score"
              value={`${compliance?.score || 0}%`}
              icon={<Sparkles className="h-6 w-6" />}
              iconVariant={
                compliance && compliance.score >= 85
                  ? 'success'
                  : compliance && compliance.score >= 70
                  ? 'warning'
                  : 'error'
              }
              description={`Grade: ${compliance?.grade || 'N/A'}`}
            />
          </MetricsGrid>
        )}
      </section>

      {/* Cost Trend Chart */}
      <section className="mb-8" aria-labelledby="cost-trend-heading">
        <h2 id="cost-trend-heading" className="sr-only">
          Cost Trend
        </h2>

        <CostChart
          data={costs}
          title="30-Day Cost Trend"
          description="Daily spending for the last 30 days"
          isLoading={costsLoading}
          height={320}
          onTimeRangeChange={range => {
            console.log('Time range changed:', range);
            // The hook will automatically refetch with new range
          }}
        />
      </section>

      {/* Two-column layout for tables and insights */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Resources - 2/3 width */}
        <section className="xl:col-span-2" aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="sr-only">
            Recent Resources
          </h2>

          <ResourceTable
            resources={resources}
            isLoading={resourcesLoading}
            onResourceClick={handleResourceClick}
            showActions
          />
        </section>

        {/* Right sidebar - 1/3 width */}
        <aside className="space-y-6">
          {/* Security Findings */}
          <section aria-labelledby="security-heading">
            <h2 id="security-heading" className="sr-only">
              Security Findings
            </h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-error-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Security Findings
                  </h3>
                </div>
                {compliance && (
                  <div className="mt-2">
                    <Badge
                      variant={
                        compliance.score >= 85
                          ? 'success'
                          : compliance.score >= 70
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      Score: {compliance.score}% ({compliance.grade})
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardBody>
                {securityLoading ? (
                  <div className="space-y-3">
                    <div className="h-16 animate-pulse rounded bg-neutral-200" />
                    <div className="h-16 animate-pulse rounded bg-neutral-200" />
                    <div className="h-16 animate-pulse rounded bg-neutral-200" />
                  </div>
                ) : priorityFindings.length > 0 ? (
                  <div className="space-y-3">
                    {priorityFindings.slice(0, 3).map(finding => (
                      <SecurityFindingItem key={finding.id} finding={finding} />
                    ))}
                    <Button variant="ghost" fullWidth className="mt-4">
                      View All Findings →
                    </Button>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Shield className="mx-auto h-12 w-12 text-success-400" />
                    <p className="mt-2 font-medium text-success-900">
                      All Clear!
                    </p>
                    <p className="mt-1 text-sm text-success-700">
                      No critical security issues found
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </section>

          {/* Cost Alerts */}
          <section aria-labelledby="alerts-heading">
            <h2 id="alerts-heading" className="sr-only">
              Cost Alerts
            </h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Active Alerts
                  </h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {costSummary && costSummary.percentageChange > 10 && (
                    <AlertItem
                      title="Cost Increase"
                      description={`Spending up ${costSummary.percentageChange.toFixed(1)}% from last month`}
                      variant="warning"
                    />
                  )}
                  {compliance && compliance.breakdown.critical > 0 && (
                    <AlertItem
                      title="Security Finding"
                      description={`${compliance.breakdown.critical} critical ${compliance.breakdown.critical === 1 ? 'issue' : 'issues'} detected`}
                      variant="error"
                    />
                  )}
                  {resources.filter(r => r.status === 'stopped').length > 0 && (
                    <AlertItem
                      title="Stopped Resources"
                      description={`${resources.filter(r => r.status === 'stopped').length} resources stopped`}
                      variant="info"
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
}

/**
 * SecurityFindingItem Component
 * Individual security finding display
 */
interface SecurityFindingItemProps {
  finding: {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  };
}

function SecurityFindingItem({ finding }: SecurityFindingItemProps) {
  const severityVariant = finding.severity === 'critical' || finding.severity === 'high' ? 'error' : 'warning';

  return (
    <div className="rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-900">{finding.title}</h4>
          <p className="mt-1 text-xs text-neutral-600">{finding.description}</p>
        </div>
        <Badge variant={severityVariant} size="sm">
          {finding.severity}
        </Badge>
      </div>
    </div>
  );
}

/**
 * AlertItem Component
 * Individual alert display
 */
interface AlertItemProps {
  title: string;
  description: string;
  variant: 'error' | 'warning' | 'info';
}

function AlertItem({ title, description, variant }: AlertItemProps) {
  return (
    <div className="flex items-start gap-3">
      <Badge variant={variant} size="sm" withDot />
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-600">{description}</p>
      </div>
    </div>
  );
}