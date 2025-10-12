/**
 * UI Components Barrel Export
 * 
 * Centralized export file for all UI components.
 * Allows clean imports throughout the application.
 * 
 * @example
 * import { Button, Card, Input, Badge } from '@/components/ui';
 */

// Button component and types
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Card components and types
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './Card';

// Input component and types
export { Input } from './Input';
export type { InputProps } from './Input';

// Badge component and types
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

// Spinner components and types
export { Spinner, FullPageSpinner } from './Spinner';
export type { SpinnerProps, FullPageSpinnerProps } from './Spinner';

// Modal component and types
export { Modal } from './Modal';
export type { ModalProps } from './Modal';