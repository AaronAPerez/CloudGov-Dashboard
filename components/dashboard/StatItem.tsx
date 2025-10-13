import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react'

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
    <div
      role="group"
      aria-label={`${label}: ${value}, change ${change}`}
      className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-neutral-800/50 p-3 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-colors"
    >
      <div className="flex items-center gap-2 flex-1">
        {icon && <div className="text-neutral-600 dark:text-neutral-400" aria-hidden="true">{icon}</div>}
        <div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">{label}</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          trend === 'up' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
        )}
        aria-label={`Trend ${trend}, change ${change}`}
      >
        {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change}
      </div>
    </div>
  );
}

export default StatItem