/**
 * MetricsCard Component
 * 
 * Displays key performance metrics with trend indicators.
 * Used on the dashboard for at-a-glance monitoring.
 * 
 * Features:
 * - Large value display
 * - Percentage change indicator
 * - Trend arrow (up/down/neutral)
 * - Icon support
 * - Color-coded trends
 * - Optional description
 * 
 * Business Value:
 * - Quick visibility into key metrics (costs, resources, alerts)
 * - Trend indicators show if metrics are improving/degrading
 * - Helps identify issues at a glance
 * 
 * Real-world Use Cases:
 * - Monthly cloud spending ($12,450 ↑ 8.5%)
 * - Total resources (847 ↑ 3.2%)
 * - Security findings (12 ↓ 15%)
 * - AI recommendations (23 active)
 * 
 * @example
 * <MetricsCard
 *   title="Monthly Cost"
 *   value="$12,450"
 *   change={8.5}
 *   trend="up"
 *   icon={<DollarSign />}
 *   description="vs last month"
 * />
 */

import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardBody } from '@/components/ui';
import { cn, formatNumber } from '@/lib/utils';

/**
 * MetricsCard component props
 */
export interface MetricsCardProps {
  /** Metric title */
  title: string;
  /** Current metric value (can be string for formatted values or number) */
  value: string | number;
  /** Percentage change from previous period */
  change?: number;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Icon to display */
  icon?: React.ReactNode;
  /** Icon background color variant */
  iconVariant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  /** Description or comparison text */
  description?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for interactive cards */
  onClick?: () => void;
}

/**
 * Icon background color variants
 */
const iconVariants = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-950 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-300',
  error: 'bg-error-100 text-error-700 dark:bg-error-950 dark:text-error-300',
  neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
};

/**
 * MetricsCard Component
 * 
 * Displays a single metric with trend information
 */
export function MetricsCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  iconVariant = 'primary',
  description = 'vs last month',
  isLoading = false,
  onClick,
}: MetricsCardProps) {
  // Determine if change is positive or negative for styling
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Determine trend icon
  const TrendIcon =
    trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;

  // Trend color based on direction
  const trendColor =
    trend === 'up'
      ? 'text-success-700 dark:text-success-300'
      : trend === 'down'
      ? 'text-error-700 dark:text-error-300'
      : 'text-neutral-500 dark:text-neutral-400';

  return (
    <Card
      hoverable={!!onClick}
      interactive={!!onClick}
      onClick={onClick}
      isLoading={isLoading}
      className="transition-all duration-200"
      aria-label={`${title}: ${value}${change !== undefined ? `, ${change > 0 ? 'up' : change < 0 ? 'down' : 'unchanged'} ${Math.abs(change).toFixed(1)}%` : ''}`}
    >
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          {/* Left side: Title and value */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{title}</p>

            {/* Value */}
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>

            {/* Change indicator */}
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {/* Trend badge */}
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-0.5',
                    'text-xs font-medium',
                    isPositive && 'bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-200',
                    isNegative && 'bg-error-100 text-error-800 dark:bg-error-950 dark:text-error-200',
                    !isPositive && !isNegative && 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                  )}
                >
                  <TrendIcon
                    className={cn('h-3 w-3', trendColor)}
                    aria-hidden="true"
                  />
                  <span>
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </div>

                {/* Description */}
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{description}</span>
              </div>
            )}
          </div>

          {/* Right side: Icon */}
          {icon && (
            <div
              className={cn(
                'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg',
                iconVariants[iconVariant]
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * MetricsCardSkeleton Component
 * 
 * Loading skeleton for MetricsCard
 */
export function MetricsCardSkeleton() {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Title skeleton */}
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
            {/* Value skeleton */}
            <div className="h-8 w-32 animate-pulse rounded bg-neutral-200" />
            {/* Change skeleton */}
            <div className="h-6 w-28 animate-pulse rounded bg-neutral-200" />
          </div>
          {/* Icon skeleton */}
          <div className="h-12 w-12 animate-pulse rounded-lg bg-neutral-200" />
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * MetricsGrid Component
 * 
 * Grid layout for displaying multiple metrics cards
 * Responsive: 1 column on mobile, 2 on tablet, 4 on desktop
 */
export interface MetricsGridProps {
  children: React.ReactNode;
}

export function MetricsGrid({ children }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}