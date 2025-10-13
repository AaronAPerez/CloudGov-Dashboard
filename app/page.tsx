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
  Activity,
  CheckCircle,
  Cloud,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CostChart } from '@/components/dashboard/CostChart';
import { ResourceTable } from '@/components/dashboard/ResourceTable';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import { useResources, useCosts, useSecurity } from '@/hooks';
import { cn, formatCurrency } from '@/lib/utils';
import type { AWSResource } from '@/lib/types';
import HealthItem from '@/components/dashboard/HealthItem';
import StatItem from '@/components/dashboard/StatItem';
import MetricsCard from '@/components/dashboard/MetricsCard';

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
      {/* Hero Section with Gradient Background */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 p-8 shadow-xl dark:from-primary-700 dark:via-secondary-700 dark:to-primary-800 animate-fade-in">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-bg absolute inset-0" />
        </div>
        
        {/* Floating gradient orbs */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Cloud className="h-10 w-10 text-white" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-md animate-pulse-soft" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl animate-slide-up">
                  Dashboard Overview
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="warning" 
                    size="sm" 
                    className="border-white/30 text-white backdrop-blur-sm"
                  >
                    Demo Mode
                  </Badge>
                  <span className="text-sm text-white/80">
                    Real-time monitoring active
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-white/90 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Monitor your AWS infrastructure with AI-powered insights and real-time analytics
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleRefreshAll}
            leftIcon={<RefreshCw className="h-4 w-4" />}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            Refresh All
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {(resourcesError || costsError || securityError) && (
        <div className="mb-6 rounded-2xl border border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-950/50 p-4 animate-slide-down backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-error-600 dark:text-error-400 animate-pulse" />
            <div className="flex-1">
              <p className="font-medium text-error-900 dark:text-error-100">
                Error Loading Data
              </p>
              <p className="mt-1 text-sm text-error-700 dark:text-error-300">
                {resourcesError || costsError || securityError}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshAll}
                className="mt-2 text-error-700 dark:text-error-300 hover:bg-error-100 dark:hover:bg-error-900"
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Monthly Cost Metric */}
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
            iconColor="from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500"
            description="vs last month"
            isLoading={costsLoading}
            delay="0s"
          />

          {/* Total Resources Metric */}
          <MetricsCard
            title="Total Resources"
            value={resources.length}
            icon={<Server className="h-6 w-6" />}
            iconColor="from-success-500 to-success-600 dark:from-success-400 dark:to-success-500"
            description="active resources"
            isLoading={resourcesLoading}
            delay="0.1s"
          />

          {/* Security Findings Metric */}
          <MetricsCard
            title="Security Findings"
            value={compliance?.breakdown.critical || 0}
            icon={<Shield className="h-6 w-6" />}
            iconColor="from-error-500 to-error-600 dark:from-error-400 dark:to-error-500"
            description="critical issues"
            isLoading={securityLoading}
            delay="0.2s"
          />

          {/* Compliance Score Metric */}
          <MetricsCard
            title="Compliance Score"
            value={`${compliance?.score || 0}%`}
            icon={<Sparkles className="h-6 w-6" />}
            iconColor="from-secondary-500 to-secondary-600 dark:from-secondary-400 dark:to-secondary-500"
            description={`Grade: ${compliance?.grade || 'N/A'}`}
            badge={
              compliance && compliance.score >= 85 ? (
                <Badge variant="success" size="sm">Excellent</Badge>
              ) : compliance && compliance.score >= 70 ? (
                <Badge variant="warning" size="sm">Good</Badge>
              ) : (
                <Badge variant="error" size="sm">Needs Work</Badge>
              )
            }
            isLoading={securityLoading}
            delay="0.3s"
          />
        </div>
      </section>

      {/* Cost Trend Chart */}
      <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }} aria-labelledby="cost-trend-heading">
        <h2 id="cost-trend-heading" className="sr-only">
          Cost Trend
        </h2>
        
        <div className={cn(
          "rounded-2xl border overflow-hidden",
          "bg-white dark:bg-neutral-900",
          "border-neutral-200 dark:border-neutral-800",
          "shadow-soft hover:shadow-medium transition-shadow duration-300"
        )}>
          <CostChart
            data={costs}
            title="30-Day Cost Trend"
            description="Daily spending analysis with projections"
            isLoading={costsLoading}
            height={320}
            onTimeRangeChange={(range) => {
              console.log('Time range changed:', range);
            }}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Resources Table - 2/3 width */}
        <section 
          className="xl:col-span-2 animate-slide-up" 
          style={{ animationDelay: '0.5s' }}
          aria-labelledby="resources-heading"
        >
          <h2 id="resources-heading" className="sr-only">
            Recent Resources
          </h2>
          
          <div className={cn(
            "rounded-2xl border overflow-hidden",
            "bg-white dark:bg-neutral-900",
            "border-neutral-200 dark:border-neutral-800",
            "shadow-soft hover:shadow-medium transition-shadow duration-300"
          )}>
            <ResourceTable
              resources={resources}
              isLoading={resourcesLoading}
              onResourceClick={handleResourceClick}
              showActions
            />
          </div>
        </section>

        {/* Sidebar - 1/3 width */}
        <aside className="space-y-6">
          {/* Security Findings Card */}
          <div 
            className={cn(
              "rounded-2xl border overflow-hidden animate-slide-up",
              "bg-white dark:bg-neutral-900",
              "border-neutral-200 dark:border-neutral-800",
              "shadow-soft hover:shadow-medium transition-all duration-300"
            )}
            style={{ animationDelay: '0.6s' }}
          >
            {/* Header */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-br from-error-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-100 dark:bg-error-950">
                    <Shield className="h-5 w-5 text-error-600 dark:text-error-400" />
                  </div>
                  {compliance && compliance.breakdown.critical > 0 && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-400 opacity-75" />
                      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-error-600 text-[10px] font-bold text-white">
                        {compliance.breakdown.critical}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Security Findings
                  </h3>
                  {compliance && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Score: {compliance.score}% • Grade: {compliance.grade}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {securityLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="h-20 animate-pulse rounded-lg skeleton"
                    />
                  ))}
                </div>
              ) : priorityFindings.length > 0 ? (
                <div className="space-y-3">
                  {priorityFindings.slice(0, 3).map((finding, index) => (
                    <div
                      key={finding.id}
                      className={cn(
                        "group rounded-lg border p-3",
                        "bg-neutral-50 dark:bg-neutral-800/50",
                        "border-neutral-200 dark:border-neutral-700",
                        "hover:shadow-md hover:scale-[1.02]",
                        "transition-all duration-200",
                        "cursor-pointer animate-scale-in"
                      )}
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {finding.title}
                            </h4>
                          </div>
                          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                            {finding.description}
                          </p>
                        </div>
                        <Badge
                          variant={finding.severity === 'critical' ? 'error' : 'warning'}
                          size="sm"
                          withDot
                        >
                          {finding.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    className="mt-4 group"
                  >
                    View All Findings 
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center animate-scale-in">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100 dark:bg-success-950 animate-bounce-soft">
                    <CheckCircle className="h-6 w-6 text-success-600 dark:text-success-400" />
                  </div>
                  <p className="mt-3 font-medium text-success-900 dark:text-success-100">
                    All Clear!
                  </p>
                  <p className="mt-1 text-sm text-success-700 dark:text-success-300">
                    No critical security issues found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div 
            className={cn(
              "rounded-2xl border p-6 overflow-hidden animate-slide-up",
              "bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-transparent",
              "dark:from-primary-500/20 dark:via-secondary-500/10",
              "border-primary-200 dark:border-primary-800",
              "shadow-soft hover:shadow-medium transition-all duration-300",
              "relative"
            )}
            style={{ animationDelay: '0.8s' }}
          >
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Quick Stats
                </h3>
              </div>
              
              <div className="space-y-3">
                <StatItem
                  label="Active Deployments"
                  value="24"
                  trend="up"
                  change="+12%"
                  icon={<Zap className="h-4 w-4" />}
                />
                <StatItem
                  label="API Requests Today"
                  value="1.2M"
                  trend="up"
                  change="+8%"
                  icon={<Activity className="h-4 w-4" />}
                />
                <StatItem
                  label="Avg Response Time"
                  value="145ms"
                  trend="down"
                  change="-5%"
                  icon={<Zap className="h-4 w-4" />}
                />
                <StatItem
                  label="Success Rate"
                  value="99.8%"
                  trend="up"
                  change="+0.2%"
                  icon={<CheckCircle className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* System Health Card */}
          <div 
            className={cn(
              "rounded-2xl border p-6 animate-slide-up",
              "bg-white dark:bg-neutral-900",
              "border-neutral-200 dark:border-neutral-800",
              "shadow-soft hover:shadow-medium transition-all duration-300"
            )}
            style={{ animationDelay: '0.9s' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-100 dark:bg-success-950">
                <Activity className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                System Health
              </h3>
            </div>
            
            <div className="space-y-4">
              <HealthItem
                label="API Services"
                status="operational"
                value="100%"
              />
              <HealthItem
                label="Database"
                status="operational"
                value="100%"
              />
              <HealthItem
                label="Storage"
                status="operational"
                value="99.9%"
              />
              <HealthItem
                label="CDN"
                status="degraded"
                value="98.5%"
              />
            </div>
          </div>
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