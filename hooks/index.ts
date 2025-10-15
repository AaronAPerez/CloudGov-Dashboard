/**
 * Hooks Barrel Export
 * 
 * Centralized export file for all custom React hooks.
 * 
 * @example
 * import { useResources, useCosts, useSecurity } from '@/hooks';
 */

// Resource management hooks
export { useResources, useResourceStats } from './useResources';

// Cost analytics hooks
export { useCosts, useCostAlerts } from './useCosts';

// Security and compliance hooks
export { useSecurity, useSecurityAlerts } from './useSecurity';

// WorkSpaces management hooks
export { useWorkSpaces } from './useWorkSpaces';

// Settings hooks
export { useSettings } from './useSettings';

// Toast notifications
export { useToast } from './useToast';