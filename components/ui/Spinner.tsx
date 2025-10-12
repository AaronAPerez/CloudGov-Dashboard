/**
 * Spinner Component
 * 
 * Loading indicator component with multiple sizes and variants.
 * Includes proper accessibility attributes for screen readers.
 * 
 * Features:
 * - Three sizes (sm, md, lg)
 * - Color variants matching design system
 * - Optional text label
 * - ARIA live region for screen reader announcements
 * - Center alignment option
 * 
 * @example
 * <Spinner size="md" variant="primary" />
 * <Spinner size="lg" text="Loading..." />
 */

import { HTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Spinner component props interface
 */
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'neutral' | 'white';
  /** Optional loading text */
  text?: string;
  /** Centers the spinner in its container */
  centered?: boolean;
}

/**
 * Size styles mapping (icon size)
 */
const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

/**
 * Text size styles
 */
const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

/**
 * Variant color styles
 */
const variantStyles = {
  primary: 'text-primary-600',
  neutral: 'text-neutral-600',
  white: 'text-white',
};

/**
 * Spinner Component
 * 
 * Displays an animated loading indicator
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      text,
      centered = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2',
          centered && 'justify-center w-full',
          className
        )}
        // Accessibility: announce loading to screen readers
        role="status"
        aria-live="polite"
        aria-busy="true"
        {...props}
      >
        {/* Animated spinner icon */}
        <Loader2
          className={cn(
            'animate-spin',
            sizeStyles[size],
            variantStyles[variant]
          )}
          aria-hidden="true"
        />

        {/* Optional loading text */}
        {text && (
          <span
            className={cn(
              'font-medium',
              textSizeStyles[size],
              variantStyles[variant]
            )}
          >
            {text}
          </span>
        )}

        {/* Screen reader only text */}
        <span className="sr-only">Loading{text ? `: ${text}` : '...'}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

/**
 * FullPageSpinner Component
 * 
 * Displays a spinner centered in a full-page overlay
 * Useful for page-level loading states
 * 
 * @example
 * <FullPageSpinner text="Loading application..." />
 */
export interface FullPageSpinnerProps {
  /** Loading text to display */
  text?: string;
  /** Background opacity (0-100) */
  opacity?: number;
}

export function FullPageSpinner({
  text = 'Loading...',
  opacity = 80,
}: FullPageSpinnerProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'backdrop-blur-sm'
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
      }}
      role="alert"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" variant="primary" />
        {text && (
          <p className="text-lg font-medium text-neutral-700">{text}</p>
        )}
      </div>
    </div>
  );
}