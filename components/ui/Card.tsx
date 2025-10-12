/**
 * Card Component
 * 
 * A flexible container component for grouping related content.
 * Used throughout the dashboard for metrics, charts, and data displays.
 * 
 * Features:
 * - Composable structure (Card, CardHeader, CardBody, CardFooter)
 * - Responsive padding and spacing
 * - Shadow and border styling
 * - Hover effects (optional)
 * - Loading state support
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <h3>Title</h3>
 *   </CardHeader>
 *   <CardBody>
 *     Content goes here
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 */

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { BaseProps } from '@/lib/types';

/**
 * Card component props
 */
export interface CardProps extends BaseProps, HTMLAttributes<HTMLDivElement> {
  /** Adds hover effect to card */
  hoverable?: boolean;
  /** Shows loading state */
  isLoading?: boolean;
  /** Adds interactive cursor */
  interactive?: boolean;
}

/**
 * CardHeader component props
 */
export interface CardHeaderProps
  extends BaseProps,
    HTMLAttributes<HTMLDivElement> {
  /** Optional action element (e.g., button, dropdown) */
  action?: React.ReactNode;
}

/**
 * CardBody component props
 */
export interface CardBodyProps
  extends BaseProps,
    HTMLAttributes<HTMLDivElement> {
  /** Reduces padding for compact layouts */
  compact?: boolean;
}

/**
 * CardFooter component props
 */
export interface CardFooterProps
  extends BaseProps,
    HTMLAttributes<HTMLDivElement> {
  /** Aligns content to the right */
  alignRight?: boolean;
}

/**
 * Base Card Component
 * 
 * Container for card content with consistent styling
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hoverable = false,
      isLoading = false,
      interactive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-white rounded-lg border border-neutral-200 shadow-sm',
          // Hover effect
          hoverable &&
            'transition-shadow duration-200 hover:shadow-md hover:border-neutral-300',
          // Interactive cursor
          interactive && 'cursor-pointer',
          // Loading state
          isLoading && 'animate-pulse-slow',
          className
        )}
        // Accessibility: indicate if card is interactive
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 * 
 * Header section of the card, typically contains title and actions
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ action, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between px-6 py-4 border-b border-neutral-200',
          className
        )}
        {...props}
      >
        {/* Title/content area */}
        <div className="flex-1">{children}</div>

        {/* Action buttons/dropdown area */}
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardBody Component
 * 
 * Main content area of the card
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ compact = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6', compact ? 'py-3' : 'py-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/**
 * CardFooter Component
 * 
 * Footer section of the card, typically contains actions or metadata
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ alignRight = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center px-6 py-4 border-t border-neutral-200 bg-neutral-50',
          alignRight ? 'justify-end' : 'justify-between',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';