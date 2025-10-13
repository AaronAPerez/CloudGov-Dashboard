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
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  neutral: 'bg-neutral-100 text-neutral-700',
};

/**
 * Card border and accent color variants
 */
const cardVariants = {
  primary: 'border-l-4 border-l-primary-500 bg-gradient-to-br from-primary-50/50 to-white hover:shadow-lg hover:shadow-primary-100/50',
  success: 'border-l-4 border-l-success-500 bg-gradient-to-br from-success-50/50 to-white hover:shadow-lg hover:shadow-success-100/50',
  warning: 'border-l-4 border-l-warning-500 bg-gradient-to-br from-warning-50/50 to-white hover:shadow-lg hover:shadow-warning-100/50',
  error: 'border-l-4 border-l-error-500 bg-gradient-to-br from-error-50/50 to-white hover:shadow-lg hover:shadow-error-100/50',
  neutral: 'border-l-4 border-l-neutral-300 bg-gradient-to-br from-neutral-50/50 to-white hover:shadow-lg hover:shadow-neutral-100/50',
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
      ? 'text-success-700'
      : trend === 'down'
      ? 'text-error-700'
      : 'text-neutral-500';

  return (
    <Card
      hoverable={!!onClick}
      interactive={!!onClick}
      onClick={onClick}
      isLoading={isLoading}
      className={cn(
        'transition-all duration-200',
        cardVariants[iconVariant]
      )}
    >
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          {/* Left side: Title and value */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm font-semibold text-neutral-700 truncate">{title}</p>

            {/* Value */}
            <p
              className={cn(
                'mt-2 text-xl sm:text-2xl font-bold break-words',
                iconVariant === 'primary' && 'text-primary-900',
                iconVariant === 'success' && 'text-success-900',
                iconVariant === 'warning' && 'text-warning-900',
                iconVariant === 'error' && 'text-error-900',
                iconVariant === 'neutral' && 'text-neutral-900'
              )}
            >
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>

            {/* Change indicator */}
            {change !== undefined && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Trend badge */}
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-0.5',
                    'text-xs font-medium',
                    isPositive && 'bg-success-100 text-success-800',
                    isNegative && 'bg-error-100 text-error-800',
                    !isPositive && !isNegative && 'bg-neutral-100 text-neutral-800'
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
                <span className="text-xs text-neutral-500 whitespace-nowrap">{description}</span>
              </div>
            )}
          </div>

          {/* Right side: Icon */}
          {icon && (
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center',
                'transition-all',
                iconVariants[iconVariant],
                iconVariant === 'primary' && 'ring-primary-200/50',
                iconVariant === 'success' && 'ring-success-200/50',
                iconVariant === 'warning' && 'ring-warning-200/50',
                iconVariant === 'error' && 'ring-error-200/50',
                iconVariant === 'neutral' && 'ring-neutral-200/50'
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