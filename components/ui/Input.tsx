/**
 * Input Component
 * 
 * A fully accessible form input component with validation support.
 * Follows WCAG 2.1 AA standards for form accessibility.
 * 
 * Features:
 * - Multiple input types (text, email, password, number, etc.)
 * - Label and helper text support
 * - Error state with validation messages
 * - Required field indication
 * - Left and right icons/addons
 * - Disabled state
 * - Full keyboard navigation
 * - ARIA attributes for screen readers
 * 
 * @example
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email"
 *   error="Invalid email format"
 *   required
 * />
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import type { InputType } from '@/lib/types';

/**
 * Input component props interface
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text for the input */
  label?: string;
  /** Input type */
  type?: InputType;
  /** Helper text displayed below input */
  helperText?: string;
  /** Error message (shows input in error state) */
  error?: string;
  /** Icon or element to display on the left */
  leftAddon?: React.ReactNode;
  /** Icon or element to display on the right */
  rightAddon?: React.ReactNode;
  /** Container className */
  containerClassName?: string;
  /** Makes input full width */
  fullWidth?: boolean;
}

/**
 * Input Component
 * 
 * Accessible form input with validation support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
      helperText,
      error,
      leftAddon,
      rightAddon,
      containerClassName,
      fullWidth = false,
      className,
      required = false,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const inputId = id || generateId('input');
    const helperTextId = generateId('helper');
    const errorId = generateId('error');

    // Determine if input has error state
    const hasError = Boolean(error);

    return (
      <div
        className={cn(
          'flex flex-col gap-1.5',
          fullWidth && 'w-full',
          containerClassName
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-neutral-700',
              disabled && 'text-neutral-400'
            )}
          >
            {label}
            {/* Required indicator */}
            {required && (
              <span
                className="ml-1 text-error-600"
                aria-label="required"
                role="presentation"
              >
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper (for addons) */}
        <div className="relative">
          {/* Left addon */}
          {leftAddon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            >
              {leftAddon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            className={cn(
              // Base styles
              'w-full px-3 py-2 text-base border rounded-lg transition-colors',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              // Normal state
              'border-neutral-300 bg-white text-neutral-900',
              'hover:border-neutral-400',
              'focus:border-primary-500 focus:ring-primary-500',
              // Error state
              hasError &&
                'border-error-500 focus:border-error-500 focus:ring-error-500',
              // Disabled state
              disabled &&
                'bg-neutral-100 text-neutral-500 cursor-not-allowed opacity-60',
              // Addon padding adjustments
              leftAddon && 'pl-10',
              rightAddon && 'pr-10',
              // Error icon padding
              hasError && !rightAddon && 'pr-10',
              className
            )}
            // Accessibility attributes
            aria-invalid={hasError}
            aria-describedby={cn(
              helperText && helperTextId,
              hasError && errorId
            )}
            aria-required={required}
            {...props}
          />

          {/* Right addon or error icon */}
          {(rightAddon || hasError) && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              {hasError && !rightAddon ? (
                <AlertCircle className="h-5 w-5 text-error-500" />
              ) : (
                <span className="text-neutral-400">{rightAddon}</span>
              )}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(helperText || error) && (
          <div className="text-sm">
            {error ? (
              <p
                id={errorId}
                className="text-error-600 flex items-center gap-1"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            ) : (
              <p id={helperTextId} className="text-neutral-600">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';