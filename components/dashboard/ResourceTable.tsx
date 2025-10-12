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

import { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
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
        <CardBody>
          <div className="flex flex-col items-center justify-center py-12">
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
        <p className="text-sm text-neutral-600">
          {resources.length} total resources
        </p>
      </CardHeader>
      <CardBody className="p-0">
        {/* Table container with horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table header */}
            <thead className="border-b border-neutral-200 bg-neutral-50">
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
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-600">
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
                    onResourceClick && 'cursor-pointer hover:bg-neutral-50'
                  )}
                  onClick={() => onResourceClick?.(resource)}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">
                      {resource.name}
                    </div>
                    <div className="text-xs text-neutral-500">{resource.id}</div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <Badge variant="neutral" size="sm">
                      {resource.type}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[resource.status]} size="sm" withDot>
                      {resource.status}
                    </Badge>
                  </td>

                  {/* Region */}
                  <td className="px-4 py-3 text-sm text-neutral-700">
                    {resource.region}
                  </td>

                  {/* Monthly Cost */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-neutral-900">
                      {formatCurrency(resource.monthlyCost)}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3 text-sm text-neutral-700">
                    {resource.owner}
                  </td>

                  {/* Last Accessed */}
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {formatRelativeTime(resource.lastAccessed)}
                  </td>

                  {/* Actions */}
                  {showActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
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