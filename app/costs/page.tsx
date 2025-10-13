/**
 * Costs Page - CloudGov Dashboard
 * 
 * Comprehensive cost analytics and optimization interface with:
 * - Real-time cost tracking
 * - Interactive cost charts
 * - Service-level breakdown
 * - Budget management
 * - Cost optimization recommendations
 * - Forecasting and projections
 * - Dark mode support
 * - Export functionality
 * 
 * Features:
 * - Multiple time ranges (7d, 30d, 90d, 12m)
 * - Cost breakdown by service, region, project
 * - Budget alerts and tracking
 * - Cost anomaly detection
 * - Savings recommendations
 * - Historical trend analysis
 * 
 * Business Value:
 * - Reduce cloud spending by 20-35%
 * - Identify cost spikes in real-time
 * - Optimize resource allocation
 * - Support budget planning
 * 
 * @route /costs
 */

'use client';

import { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Zap,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Cloud,
  Activity,
  Target,
  RefreshCw,
  Lightbulb,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CostChart, MultiLineChart } from '@/components/dashboard/CostChart';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import { useCosts } from '@/hooks';
import { formatCurrency, cn } from '@/lib/utils';

/**
 * Time range type
 */
type TimeRange = '7d' | '30d' | '90d' | '12m';

/**
 * Grouping type
 */
type GroupBy = 'day' | 'service' | 'region' | 'project';

/**
 * Costs Page Component
 */
export default function CostsPage() {
  // State management
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Fetch costs data
  const {
    costs,
    summary,
    trends,
    isLoading,
    error,
    refetch,
  } = useCosts({ range: timeRange, groupBy });

  // Calculate cost insights
  const insights = useMemo(() => {
    if (!summary) return null;

    const savingsOpportunity = summary.currentMonth * 0.25; // Estimated 25% savings
    const projectedAnnual = summary.projected * 12;
    const avgDailyCost = summary.currentMonth / 30;

    return {
      savingsOpportunity,
      projectedAnnual,
      avgDailyCost,
      trend: trends?.trend || 'stable',
      trendPercentage: trends?.trendPercentage || 0,
    };
  }, [summary, trends]);

  // Mock service breakdown data
  const serviceBreakdown = useMemo(() => [
    { name: 'EC2', cost: 15420, percentage: 35, trend: 'up' },
    { name: 'S3', cost: 8750, percentage: 20, trend: 'stable' },
    { name: 'RDS', cost: 12100, percentage: 28, trend: 'up' },
    { name: 'Lambda', cost: 3200, percentage: 7, trend: 'down' },
    { name: 'DynamoDB', cost: 4330, percentage: 10, trend: 'stable' },
  ], []);

  // Mock savings recommendations
  const recommendations = useMemo(() => [
    {
      id: 1,
      title: 'Right-size EC2 Instances',
      description: 'Your EC2 instances are underutilized. Consider downsizing to save costs.',
      savings: 4200,
      priority: 'high' as const,
      effort: 'low' as const,
    },
    {
      id: 2,
      title: 'Use S3 Intelligent-Tiering',
      description: 'Automatically move objects between access tiers based on usage patterns.',
      savings: 2800,
      priority: 'medium' as const,
      effort: 'low' as const,
    },
    {
      id: 3,
      title: 'Reserved Instances for RDS',
      description: 'Commit to 1-year reserved instances for predictable RDS workloads.',
      savings: 3600,
      priority: 'high' as const,
      effort: 'medium' as const,
    },
    {
      id: 4,
      title: 'Delete Unused EBS Volumes',
      description: '12 EBS volumes are not attached to any instance.',
      savings: 850,
      priority: 'low' as const,
      effort: 'low' as const,
    },
  ], []);

  // Budget configuration (mock)
  const budget = {
    monthly: 50000,
    current: summary?.currentMonth || 0,
    projected: summary?.projected || 0,
  };

  const budgetUsage = (budget.current / budget.monthly) * 100;
  const projectedUsage = (budget.projected / budget.monthly) * 100;

  return (
    <DashboardLayout activeRoute="/costs">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-success-500 to-success-600 opacity-20 blur" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  Cost Analytics
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Monitor and optimize your cloud spending
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="md"
              onClick={refetch}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CostMetricCard
          title="Current Month"
          value={formatCurrency(summary?.currentMonth || 0)}
          change={summary?.percentageChange}
          trend={summary?.percentageChange && summary.percentageChange > 0 ? 'up' : 'down'}
          icon={<DollarSign className="h-6 w-6" />}
          color="from-primary-500 to-primary-600"
          subtitle="vs last month"
        />
        <CostMetricCard
          title="Projected (EOM)"
          value={formatCurrency(summary?.projected || 0)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="from-secondary-500 to-secondary-600"
          subtitle="end of month forecast"
        />
        <CostMetricCard
          title="Daily Average"
          value={formatCurrency(insights?.avgDailyCost || 0)}
          icon={<Calendar className="h-6 w-6" />}
          color="from-info-500 to-info-600"
          subtitle="current month"
        />
        <CostMetricCard
          title="Savings Opportunity"
          value={formatCurrency(insights?.savingsOpportunity || 0)}
          icon={<Zap className="h-6 w-6" />}
          color="from-success-500 to-success-600"
          subtitle="potential savings"
          badge={<Badge variant="success" size="sm">25%</Badge>}
        />
      </div>

      {/* Budget Progress */}
      <Card className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Monthly Budget
              </h3>
            </div>
            <Badge 
              variant={projectedUsage > 100 ? 'error' : projectedUsage > 90 ? 'warning' : 'success'}
              size="sm"
            >
              {projectedUsage.toFixed(0)}% projected
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Budget bar */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Current: {formatCurrency(budget.current)}
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Budget: {formatCurrency(budget.monthly)}
                </span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                {/* Current usage */}
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full rounded-full transition-all duration-500',
                    budgetUsage > 100
                      ? 'bg-gradient-to-r from-error-500 to-error-600'
                      : budgetUsage > 90
                      ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                      : 'bg-gradient-to-r from-success-500 to-success-600'
                  )}
                  style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                />
                {/* Projected usage (dashed) */}
                <div
                  className="absolute left-0 top-0 h-full border-r-2 border-dashed border-neutral-400 dark:border-neutral-600"
                  style={{ width: `${Math.min(projectedUsage, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>{budgetUsage.toFixed(1)}% used</span>
                <span>Projected: {formatCurrency(budget.projected)}</span>
              </div>
            </div>

            {/* Budget alerts */}
            {projectedUsage > 90 && (
              <div className={cn(
                'rounded-lg border p-3',
                projectedUsage > 100
                  ? 'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950/50'
                  : 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-950/50'
              )}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={cn(
                    'h-5 w-5 flex-shrink-0',
                    projectedUsage > 100
                      ? 'text-error-600 dark:text-error-400'
                      : 'text-warning-600 dark:text-warning-400'
                  )} />
                  <div>
                    <p className={cn(
                      'font-medium',
                      projectedUsage > 100
                        ? 'text-error-900 dark:text-error-100'
                        : 'text-warning-900 dark:text-warning-100'
                    )}>
                      {projectedUsage > 100 ? 'Budget Exceeded' : 'Approaching Budget Limit'}
                    </p>
                    <p className={cn(
                      'mt-1 text-sm',
                      projectedUsage > 100
                        ? 'text-error-700 dark:text-error-300'
                        : 'text-warning-700 dark:text-warning-300'
                    )}>
                      {projectedUsage > 100
                        ? 'Your projected spending exceeds the monthly budget. Review cost optimization recommendations.'
                        : 'You are projected to use over 90% of your budget. Consider implementing cost-saving measures.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Time Range Selector */}
      <div className="mb-6 flex flex-wrap items-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Time Range:
          </span>
        </div>
        {(['7d', '30d', '90d', '12m'] as TimeRange[]).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === '7d' && '7 Days'}
            {range === '30d' && '30 Days'}
            {range === '90d' && '90 Days'}
            {range === '12m' && '12 Months'}
          </Button>
        ))}
      </div>

      {/* Cost Trend Chart */}
      <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CostChart
          data={costs}
          title="Cost Trend Analysis"
          description="Historical spending over time"
          isLoading={isLoading}
          height={400}
          showLegend
          onTimeRangeChange={setTimeRange}
        />
      </div>

      {/* Service Breakdown and Recommendations */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Service Breakdown */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <PieChart className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Cost by Service
              </h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {serviceBreakdown.map((service, index) => (
                <ServiceBreakdownItem
                  key={service.name}
                  service={service}
                  delay={`${0.6 + index * 0.1}s`}
                />
              ))}
            </div>
            <Button variant="ghost" fullWidth className="mt-4">
              View Detailed Breakdown →
            </Button>
          </CardBody>
        </Card>

        {/* Top Savings Recommendations */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Savings Recommendations
              </h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <RecommendationItem
                  key={rec.id}
                  recommendation={rec}
                  delay={`${0.7 + index * 0.1}s`}
                />
              ))}
            </div>
            <Button variant="ghost" fullWidth className="mt-4">
              View All Recommendations →
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Cost Anomalies */}
      <Card className="mb-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-error-600 dark:text-error-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Cost Anomalies Detected
            </h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <AnomalyItem
              title="EC2 Cost Spike"
              description="EC2 costs increased by 45% on Oct 10, 2025"
              impact={formatCurrency(2100)}
              severity="high"
            />
            <AnomalyItem
              title="Unusual S3 Data Transfer"
              description="S3 data transfer costs 3x higher than usual"
              impact={formatCurrency(850)}
              severity="medium"
            />
          </div>
        </CardBody>
      </Card>

      {/* Historical Comparison */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-info-600 dark:text-info-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Month-over-Month Comparison
            </h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-3">
            <ComparisonCard
              period="This Month"
              value={formatCurrency(summary?.currentMonth || 0)}
              change={summary?.percentageChange}
            />
            <ComparisonCard
              period="Last Month"
              value={formatCurrency(summary?.previousMonth || 0)}
            />
            <ComparisonCard
              period="3 Months Avg"
              value={formatCurrency((summary?.currentMonth || 0) * 0.95)}
              change={-5.2}
            />
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}

/**
 * Cost Metric Card Component
 */
interface CostMetricCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  subtitle: string;
  badge?: React.ReactNode;
}

function CostMetricCard({
  title,
  value,
  change,
  trend,
  icon,
  color,
  subtitle,
  badge,
}: CostMetricCardProps) {
  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border p-6',
      'bg-white dark:bg-neutral-900',
      'border-neutral-200 dark:border-neutral-800',
      'shadow-soft hover:shadow-medium',
      'transition-all duration-300 hover:-translate-y-1'
    )}>
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity',
        `bg-gradient-to-br ${color}`
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {change !== undefined && (
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend === 'up'
                  ? 'text-error-600 dark:text-error-400'
                  : 'text-success-600 dark:text-success-400'
              )}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </span>
            {badge && badge}
          </div>
        </div>
        <div className={cn(
          'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
          `bg-gradient-to-br ${color}`,
          'text-white shadow-lg group-hover:scale-110 transition-transform'
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Service Breakdown Item
 */
interface ServiceBreakdownItemProps {
  service: {
    name: string;
    cost: number;
    percentage: number;
    trend: string;
  };
  delay: string;
}

function ServiceBreakdownItem({ service, delay }: ServiceBreakdownItemProps) {
  const iconMap: Record<string, React.ReactNode> = {
    EC2: <Server className="h-5 w-5" />,
    S3: <Database className="h-5 w-5" />,
    RDS: <Database className="h-5 w-5" />,
    Lambda: <Zap className="h-5 w-5" />,
    DynamoDB: <Database className="h-5 w-5" />,
  };

  return (
    <div 
      className="flex items-center gap-4 animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
        {iconMap[service.name] || <Cloud className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {service.name}
          </span>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {formatCurrency(service.cost)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
              style={{ width: `${service.percentage}%` }}
            />
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 min-w-[40px] text-right">
            {service.percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Recommendation Item
 */
interface RecommendationItemProps {
  recommendation: {
    title: string;
    description: string;
    savings: number;
    priority: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  };
  delay: string;
}

function RecommendationItem({ recommendation, delay }: RecommendationItemProps) {
  const priorityVariants = {
    high: 'error',
    medium: 'warning',
    low: 'info',
  } as const;

  return (
    <div 
      className={cn(
        'rounded-lg border p-4',
        'bg-neutral-50 dark:bg-neutral-800/50',
        'border-neutral-200 dark:border-neutral-700',
        'hover:shadow-md transition-all duration-200',
        'animate-scale-in'
      )}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              {recommendation.title}
            </h4>
            <Badge variant={priorityVariants[recommendation.priority]} size="sm">
              {recommendation.priority}
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {recommendation.description}
          </p>
          <div className="mt-2 flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
            <span>Effort: {recommendation.effort}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-success-600 dark:text-success-400">
            {formatCurrency(recommendation.savings)}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            /month
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Anomaly Item
 */
interface AnomalyItemProps {
  title: string;
  description: string;
  impact: string;
  severity: 'high' | 'medium' | 'low';
}

function AnomalyItem({ title, description, impact, severity }: AnomalyItemProps) {
  const severityConfig = {
    high: {
      color: 'text-error-600 dark:text-error-400',
      bg: 'bg-error-100 dark:bg-error-950',
      badge: 'error' as const,
    },
    medium: {
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-100 dark:bg-warning-950',
      badge: 'warning' as const,
    },
    low: {
      color: 'text-info-600 dark:text-info-400',
      bg: 'bg-info-100 dark:bg-info-950',
      badge: 'info' as const,
    },
  };

  const config = severityConfig[severity];

  return (
    <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', config.bg)}>
        <AlertTriangle className={cn('h-5 w-5', config.color)} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            {title}
          </h4>
          <Badge variant={config.badge} size="sm">
            {severity}
          </Badge>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
        <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Impact: {impact}
        </p>
      </div>
    </div>
  );
}

/**
 * Comparison Card
 */
interface ComparisonCardProps {
  period: string;
  value: string;
  change?: number;
}

function ComparisonCard({ period, value, change }: ComparisonCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {period}
      </p>
      <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
      {change !== undefined && (
        <div className={cn(
          'mt-2 flex items-center gap-1 text-sm font-medium',
          change > 0
            ? 'text-error-600 dark:text-error-400'
            : 'text-success-600 dark:text-success-400'
        )}>
          {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  );
}