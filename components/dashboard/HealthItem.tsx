import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import React from 'react'

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
    <div
      role="group"
      aria-label={`${label} status: ${config.label}, value: ${value}`}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.bg)} aria-hidden="true">
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
          <p className={cn("text-xs", config.color)}>{config.label}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{value}</span>
    </div>
  );
}

export default HealthItem