/**
 * Badge Component
 * 
 * Small status indicator component for displaying categorical information.
 * Commonly used for resource status, severity levels, and categories.
 * 
 * Features:
 * - Multiple variants (success, warning, error, info, neutral)
 * - Two sizes (sm, md)
 * - Optional dot indicator
 * - Optional icon support
 * - WCAG 2.1 AA compliant colors
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" withDot>Critical</Badge>
 * <Badge variant="info" size="sm">New</Badge>
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { BadgeVariant } from '@/lib/types';

/**
 * Badge component props interface
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: 'sm' | 'md';
  /** Shows a dot indicator before text */
  withDot?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
}

/**
 * Variant styles mapping
 * All variants meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text)
 */
const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-100 text-success-900 border-success-200 dark:bg-success-950 dark:text-success-100 dark:border-success-800',
  warning: 'bg-warning-100 text-warning-900 border-warning-200 dark:bg-warning-950 dark:text-warning-100 dark:border-warning-800',
  error: 'bg-error-100 text-error-900 border-error-200 dark:bg-error-950 dark:text-error-100 dark:border-error-800',
  info: 'bg-primary-100 text-primary-900 border-primary-200 dark:bg-primary-950 dark:text-primary-100 dark:border-primary-800',
  neutral: 'bg-neutral-100 text-neutral-900 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700',
};

/**
 * Dot styles for each variant
 */
const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-600',
  warning: 'bg-warning-600',
  error: 'bg-error-600',
  info: 'bg-primary-600',
  neutral: 'bg-neutral-600',
};

/**
 * Size styles mapping
 */
const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

/**
 * Badge Component
 * 
 * Displays status or category information with appropriate styling
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      withDot = false,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1.5 font-medium rounded-full border',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Dot indicator */}
        {withDot && (
          <span
            className={cn('h-1.5 w-1.5 rounded-full', dotStyles[variant])}
            aria-hidden="true"
          />
        )}

        {/* Icon */}
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Badge text content */}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';