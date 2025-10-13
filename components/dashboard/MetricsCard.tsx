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
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';


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
  iconColor: string;
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
 * MetricsCard Component
 * 
 * Displays a single metric with trend information
 */
function MetricsCard({
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
}: MetricsCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-2xl border p-6",
          "bg-white dark:bg-neutral-900",
          "border-neutral-200 dark:border-neutral-800",
          "shadow-soft animate-pulse"
        )}
        aria-busy="true"
        aria-label={`${title} loading`}
      >
        <div className="space-y-3">
          <div className="h-4 w-24 skeleton rounded" />
          <div className="h-8 w-32 skeleton rounded" />
          <div className="h-4 w-20 skeleton rounded" />
        </div>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Optional: trigger click logic here
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6",
        "bg-white dark:bg-neutral-900",
        "border-neutral-200 dark:border-neutral-800",
        "shadow-soft hover:shadow-medium",
        "transition-all duration-300 hover:-translate-y-1",
        "animate-scale-in"
      )}
      style={{ animationDelay: delay }}
      aria-label={`${title}: ${value}`}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity",
        `bg-gradient-to-br ${iconColor}`
      )} />

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
                <div
                  aria-label={`Change: ${change.toFixed(1)}% ${trend}`}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    trend === 'up'
                      ? 'bg-success-100 dark:bg-success-950 text-success-700 dark:text-success-300'
                      : trend === 'down'
                      ? 'bg-error-100 dark:bg-error-950 text-error-700 dark:text-error-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  )}
                >
                  {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                  {Math.abs(change).toFixed(1)}%
                </div>
              )}
              {description && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </span>
              )}
              {badge}
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
            `bg-gradient-to-br ${iconColor}`,
            "text-white shadow-lg",
            "group-hover:scale-110 transition-transform duration-300"
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default MetricsCard;