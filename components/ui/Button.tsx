/**
 * Button Component
 * 
 * A fully accessible, reusable button component with multiple variants,
 * sizes, and states. Follows WCAG 2.1 AA standards for accessibility.
 * 
 * Features:
 * - Multiple variants (primary, secondary, ghost, danger)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Disabled state
 * - Icon support
 * - Full keyboard navigation
 * - ARIA attributes
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from '@/lib/types';

/**
 * Button component props interface
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Shows loading spinner and disables button */
  isLoading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Makes button full width */
  fullWidth?: boolean;
}

/**
 * Variant styles mapping
 * Each variant meets WCAG 2.1 AA contrast requirements
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800 disabled:bg-primary-300',
  secondary:
    'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-400 active:bg-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-400',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-300 active:bg-neutral-200 disabled:text-neutral-400',
  danger:
    'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 active:bg-error-800 disabled:bg-error-300',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Base button styles applied to all variants
 */
const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Button Component
 * 
 * Accessible button with loading states and multiple variants
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Determine if button should be disabled (disabled prop or loading state)
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        // Accessibility: announce loading state to screen readers
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner (replaces left icon when loading) */}
        {isLoading && (
          <Loader2
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
            data-testid="button-loading-spinner"
          />
        )}

        {/* Left icon (hidden when loading) */}
        {!isLoading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button text content */}
        {children}

        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

// Display name for debugging
Button.displayName = 'Button';