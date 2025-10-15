/**
 * ResourceTable Component
 * 
 * Displays AWS resources in a sortable, filterable table.
 * Core component for resource management pages.
 * 
 * Features:
 * - Sortable columns
 * - Status badges
 * - Cost display
 * - Action buttons
 * - Responsive design
 * - Empty state
 * - Loading state
 * - Pagination support
 * 
 * Business Value:
 * - Quick overview of all AWS resources
 * - Identify high-cost resources
 * - View resource status at a glance
 * - Take action on resources (view details, terminate, etc.)
 * 
 * Real-world Use Cases:
 * - Find all stopped EC2 instances to save costs
 * - Identify resources without proper tags
 * - Audit resource ownership
 * - Track resource creation dates
 * 
 * @example
 * <ResourceTable
 *   resources={resourceData}
 *   onResourceClick={handleViewDetails}
 *   isLoading={false}
 * />
 */

import React from 'react';
import { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Badge } from '@/components/ui';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';
import type { AWSResource, ResourceStatus } from '@/lib/types';

/**
 * ResourceTable component props
 */
export interface ResourceTableProps {
  /** Array of AWS resources to display */
  resources: AWSResource[];
  /** Loading state */
  isLoading?: boolean;
  /** Callback when resource is clicked */
  onResourceClick?: (resource: AWSResource) => void;
  /** Show actions column */
  showActions?: boolean;
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc' | null;

/**
 * Resource type color variants
 */
export const typeVariants: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  'EC2': 'primary',
  'S3': 'success',
  'Lambda': 'warning',
  'RDS': 'error',
  'DynamoDB': 'info',
  'ECS': 'primary',
  'EKS': 'primary',
  'CloudFront': 'success',
  'API Gateway': 'warning',
  'WorkSpaces': 'neutral',
};

/**
 * Region color variants
 */
const regionVariants: Record<string, { color: string; bg: string }> = {
  'us-east-1': { color: 'text-blue-700', bg: 'bg-blue-50' },
  'us-west-2': { color: 'text-purple-700', bg: 'bg-purple-50' },
  'eu-west-1': { color: 'text-green-700', bg: 'bg-green-50' },
  'ap-southeast-1': { color: 'text-orange-700', bg: 'bg-orange-50' },
};

/**
 * Generate consistent color for owner name
 */
function getOwnerColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Sort configuration
 */
interface SortConfig {
  key: keyof AWSResource | null;
  direction: SortDirection;
}

/**
 * Status badge variant mapping
 */
const statusVariants: Record<ResourceStatus, 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
  running: 'success',
  stopped: 'warning',
  terminated: 'error',
  pending: 'info',
  error: 'error',
};

/**
 * ResourceTable Component
 * 
 * Table view for AWS resources with sorting and actions
 */
export function ResourceTable({
  resources,
  isLoading = false,
  onResourceClick,
  showActions = true,
}: ResourceTableProps) {
  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  /**
   * Handle column sort
   */
  const handleSort = (key: keyof AWSResource) => {
    let direction: SortDirection = 'asc';

    // Toggle direction if clicking same column
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }

    setSortConfig({ key, direction });
  };

  /**
   * Sort resources based on current sort configuration
   */
  const sortedResources = [...resources].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return 0;
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle different value types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  /**
   * Render sort icon
   */
  const renderSortIcon = (columnKey: keyof AWSResource) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" aria-hidden="true" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
    );
  };

  // Loading state
  if (isLoading) {
    return <ResourceTableSkeleton />;
  }

  // Empty state
  if (resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            AWS Resources
          </h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center justify-center py-12" role="status">
            <p className="text-lg font-medium text-neutral-900">
              No resources found
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Try adjusting your filters or create a new resource
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          AWS Resources
        </h3>
        <p className="text-sm text-neutral-200">
          {resources.length} total resources
        </p>
      </CardHeader>
      <CardBody className="p-0">
        {/* Table container with horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table header */}
            <thead className="border-b border-neutral-200">
              <tr>
                <TableHeader
                  label="Name"
                  onClick={() => handleSort('name')}
                  sortIcon={renderSortIcon('name')}
                />
                <TableHeader
                  label="Type"
                  onClick={() => handleSort('type')}
                  sortIcon={renderSortIcon('type')}
                />
                <TableHeader
                  label="Status"
                  onClick={() => handleSort('status')}
                  sortIcon={renderSortIcon('status')}
                />
                <TableHeader
                  label="Region"
                  onClick={() => handleSort('region')}
                  sortIcon={renderSortIcon('region')}
                />
                <TableHeader
                  label="Monthly Cost"
                  onClick={() => handleSort('monthlyCost')}
                  sortIcon={renderSortIcon('monthlyCost')}
                  align="right"
                />
                <TableHeader
                  label="Owner"
                  onClick={() => handleSort('owner')}
                  sortIcon={renderSortIcon('owner')}
                />
                <TableHeader
                  label="Last Accessed"
                  onClick={() => handleSort('lastAccessed')}
                  sortIcon={renderSortIcon('lastAccessed')}
                />
                {showActions && (
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-200">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table body */}
            <tbody className="divide-y divide-neutral-100">
              {sortedResources.map(resource => (
                <tr
                  key={resource.id}
                  className={cn(
                    'transition-colors',
                    onResourceClick && 'cursor-pointer hover:bg-neutral-800'
                  )}
                  onClick={() => onResourceClick?.(resource)}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="font-medium 
        text-gray-900 dark:text-gray-100">
                      {resource.name}
                    </div>
                    <div className="text-xs text-neutral-500">{resource.id}</div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[resource.status]} size="sm" withDot>
                      {resource.status}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[resource.status]} size="sm" withDot>
                      {resource.status}
                    </Badge>
                  </td>

                  {/* Region */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        regionVariants[resource.region]?.bg || 'bg-neutral-100',
                        regionVariants[resource.region]?.color || 'text-neutral-700'
                      )}
                    >
                      {resource.region}
                    </span>
                  </td>

                  {/* Monthly Cost */}
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'font-medium',
                        resource.monthlyCost >= 500
                          ? 'text-error-700'
                          : resource.monthlyCost >= 200
                          ? 'text-warning-700'
                          : 'text-success-700'
                      )}
                    >
                      {formatCurrency(resource.monthlyCost)}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold  bg-gray-100 text-gray-900 dark:text-gray-100',
                          getOwnerColor(resource.owner)
                        )}
                      >
                        {resource.owner
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <span className="text-sm text-neutral-200">
                        {resource.owner}
                      </span>
                    </div>
                  </td>

                  {/* Last Accessed */}
                  <td className="px-4 py-3 text-sm text-neutral-200">
                    {formatRelativeTime(resource.lastAccessed)}
                  </td>

                  {/* Actions */}
                  {showActions && (
                    <td className="px-4 py-3 text-right text-gray-200">
                      <div className="flex items-center justify-end gap-2 text-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                             className=' bg-gray-100 text-gray-900 dark:text-gray-100'
                          onClick={e => {
                            e.stopPropagation();
                            console.log('View details:', resource.id);
                          }}
                          aria-label="View resource details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className=' bg-gray-100 text-gray-900 dark:text-gray-100'
                          onClick={e => {
                            e.stopPropagation();
                            console.log('More options:', resource.id);
                          }}
                          aria-label="More options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * TableHeader Component
 * Sortable table header cell
 */
interface TableHeaderProps {
  label: string;
  onClick?: () => void;
  sortIcon?: React.ReactNode;
  align?: 'left' | 'right';
}

function TableHeader({
  label,
  onClick,
  sortIcon,
  align = 'left',
}: TableHeaderProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-medium uppercase tracking-wide text-neutral-600',
        align === 'right' && 'text-right',
        onClick && 'cursor-pointer hover:text-neutral-900'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex items-center gap-1',
          align === 'right' && 'justify-end'
        )}
      >
        {label}
        {sortIcon}
      </div>
    </th>
  );
}

/**
 * ResourceTableSkeleton Component
 * Loading skeleton for ResourceTable
 */
export function ResourceTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}