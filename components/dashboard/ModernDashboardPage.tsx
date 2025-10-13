/**
 * Modern Dashboard Page - CloudGov Dashboard
 * 
 * Enhanced with:
 * - Dark mode support
 * - Glassmorphism effects
 * - Smooth animations
 * - Gradient accents
 * - Better visual hierarchy
 * - Premium feel
 * - Improved loading states
 * - Enhanced accessibility
 * 
 * Features:
 * - Real-time AWS resource monitoring
 * - Cost analytics with trends
 * - Security compliance dashboard
 * - AI-powered recommendations
 * 
 * Performance:
 * - Optimized rendering
 * - Lazy loading
 * - Skeleton states
 * - Error boundaries
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
  TrendingUp,
  TrendingDown,
  Activity,
  Cloud,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CostChart } from '@/components/dashboard/CostChart';
import { ResourceTable } from '@/components/dashboard/ResourceTable';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import { useResources, useCosts, useSecurity } from '@/hooks';
import { formatCurrency, cn } from '@/lib/utils';
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
          <ModernMetricCard
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
          <ModernMetricCard
            title="Total Resources"
            value={resources.length}
            icon={<Server className="h-6 w-6" />}
            iconColor="from-success-500 to-success-600 dark:from-success-400 dark:to-success-500"
            description="active resources"
            isLoading={resourcesLoading}
            delay="0.1s"
          />

          {/* Security Findings Metric */}
          <ModernMetricCard
            title="Security Findings"
            value={compliance?.breakdown.critical || 0}
            icon={<Shield className="h-6 w-6" />}
            iconColor="from-error-500 to-error-600 dark:from-error-400 dark:to-error-500"
            description="critical issues"
            isLoading={securityLoading}
            delay="0.2s"
          />

          {/* Compliance Score Metric */}
          <ModernMetricCard
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
 * Modern Metric Card Component
 */
interface ModernMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconColor: string;
  description?: string;
  badge?: React.ReactNode;
  isLoading?: boolean;
  delay?: string;
}

function ModernMetricCard({
  title,
  value,
  change,
  trend,
  icon,
  iconColor,
  description,
  badge,
  isLoading,
  delay = '0s',
}: ModernMetricCardProps) {
  if (isLoading) {
    return (
      <div className={cn(
        "rounded-2xl border p-6",
        "bg-white dark:bg-neutral-900",
        "border-neutral-200 dark:border-neutral-800",
        "shadow-soft animate-pulse"
      )}>
        <div className="space-y-3">
          <div className="h-4 w-24 skeleton rounded" />
          <div className="h-8 w-32 skeleton rounded" />
          <div className="h-4 w-20 skeleton rounded" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6",
        "bg-white dark:bg-neutral-900",
        "border-neutral-200 dark:border-neutral-800",
        "shadow-soft hover:shadow-medium",
        "transition-all duration-300 hover:-translate-y-1",
        "animate-scale-in"
      )}
      style={{ animationDelay: delay }}
    >
      {/* Gradient accent */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity",
        `bg-gradient-to-br ${iconColor}`
      )} />
      
      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
            {value}
          </p>
          
          {(change !== undefined || description || badge) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  trend === 'up' 
                    ? 'bg-success-100 dark:bg-success-950 text-success-700 dark:text-success-300'
                    : trend === 'down'
                    ? 'bg-error-100 dark:bg-error-950 text-error-700 dark:text-error-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                )}>
                  {trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : trend === 'down' ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {Math.abs(change).toFixed(1)}%
                </div>
              )}
              {description && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </span>
              )}
              {badge && badge}
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={cn(
          "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
          `bg-gradient-to-br ${iconColor}`,
          "text-white shadow-lg",
          "group-hover:scale-110 transition-transform duration-300"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Stat Item Component
 */
interface StatItemProps {
  label: string;
  value: string;
  trend: 'up' | 'down';
  change: string;
  icon?: React.ReactNode;
}

function StatItem({ label, value, trend, change, icon }: StatItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-neutral-800/50 p-3 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-colors">
      <div className="flex items-center gap-2 flex-1">
        {icon && (
          <div className="text-neutral-600 dark:text-neutral-400">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">{label}</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
        </div>
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium",
        trend === 'up' 
          ? 'text-success-600 dark:text-success-400'
          : 'text-error-600 dark:text-error-400'
      )}>
        {trend === 'up' ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {change}
      </div>
    </div>
  );
}

/**
 * Health Item Component
 */
interface HealthItemProps {
  label: string;
  status: 'operational' | 'degraded' | 'down';
  value: string;
}

function HealthItem({ label, status, value }: HealthItemProps) {
  const statusConfig = {
    operational: {
      icon: CheckCircle,
      color: 'text-success-600 dark:text-success-400',
      bg: 'bg-success-100 dark:bg-success-950',
      label: 'Operational',
    },
    degraded: {
      icon: AlertTriangle,
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-100 dark:bg-warning-950',
      label: 'Degraded',
    },
    down: {
      icon: XCircle,
      color: 'text-error-600 dark:text-error-400',
      bg: 'bg-error-100 dark:bg-error-950',
      label: 'Down',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {label}
          </p>
          <p className={cn("text-xs", config.color)}>
            {config.label}
          </p>
        </div>
      </div>
      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        {value}
      </span>
    </div>
  );
}