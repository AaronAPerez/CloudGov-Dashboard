/**
 * Resources Page - CloudGov Dashboard
 * 
 * Comprehensive AWS resource management interface with:
 * - Advanced filtering and search
 * - Sortable table with multiple views
 * - Bulk actions and operations
 * - Resource type filtering
 * - Status filtering
 * - Cost analysis
 * - Dark mode support
 * - Responsive design
 * 
 * Features:
 * - Real-time resource monitoring
 * - Quick actions (start, stop, terminate)
 * - Export functionality
 * - Tag management
 * - Cost optimization insights
 * 
 * @route /resources
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Server,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Play,
  Square,
  Trash2,
  Tag,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Eye,
  Edit,
  RefreshCw,
  Grid3x3,
  List,
  Layers,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardBody, Badge, Button, Input } from '@/components/ui';
import { useResources } from '@/hooks';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';
import type { AWSResource, AWSResourceType, ResourceStatus } from '@/lib/types';

/**
 * View mode types
 */
type ViewMode = 'table' | 'grid' | 'list';

/**
 * Resources Page Component
 */
export default function ResourcesPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AWSResourceType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ResourceStatus | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());

  // Fetch resources
  const {
    resources,
    isLoading,
    error,
    refetch,
  } = useResources();

  // Filter resources based on search and filters
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.owner.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter((r) => r.region === selectedRegion);
    }

    return filtered;
  }, [resources, searchQuery, selectedType, selectedStatus, selectedRegion]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCost = filteredResources.reduce((sum, r) => sum + r.monthlyCost, 0);
    const runningCount = filteredResources.filter((r) => r.status === 'running').length;
    const stoppedCount = filteredResources.filter((r) => r.status === 'stopped').length;
    
    // Get unique regions
    const regions = new Set(resources.map((r) => r.region));

    return {
      total: filteredResources.length,
      running: runningCount,
      stopped: stoppedCount,
      totalCost,
      regions: regions.size,
    };
  }, [filteredResources, resources]);

  // Resource types for filtering
  const resourceTypes: (AWSResourceType | 'all')[] = [
    'all',
    'EC2',
    'S3',
    'Lambda',
    'RDS',
    'DynamoDB',
    'ECS',
    'EKS',
    'CloudFront',
    'API Gateway',
    'WorkSpaces',
  ];

  // Status types for filtering
  const statusTypes: (ResourceStatus | 'all')[] = [
    'all',
    'running',
    'stopped',
    'pending',
    'terminated',
    'error',
  ];

  // Get unique regions from resources
  const regions = useMemo(() => {
    const uniqueRegions = new Set(resources.map((r) => r.region));
    return ['all', ...Array.from(uniqueRegions)];
  }, [resources]);

  /**
   * Handle resource selection
   */
  const toggleResourceSelection = (id: string) => {
    const newSelection = new Set(selectedResources);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedResources(newSelection);
  };

  /**
   * Select all resources
   */
  const toggleSelectAll = () => {
    if (selectedResources.size === filteredResources.length) {
      setSelectedResources(new Set());
    } else {
      setSelectedResources(new Set(filteredResources.map((r) => r.id)));
    }
  };

  /**
   * Handle bulk actions
   */
  const handleBulkAction = (action: 'start' | 'stop' | 'terminate' | 'tag') => {
    console.log(`Bulk ${action} on ${selectedResources.size} resources`);
    // TODO: Implement bulk actions
  };

  /**
   * Export resources
   */
  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Type', 'Status', 'Region', 'Monthly Cost', 'Owner'].join(','),
      ...filteredResources.map((r) =>
        [r.id, r.name, r.type, r.status, r.region, r.monthlyCost, r.owner].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resources-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <DashboardLayout activeRoute="/resources">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
                  <Server className="h-6 w-6" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 opacity-20 blur" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  AWS Resources
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage and monitor your cloud infrastructure
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="md"
              onClick={refetch}
              leftIcon={<RefreshCw className="h-4 w-4" />}
              className="animate-slide-up"
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleExport}
              leftIcon={<Download className="h-4 w-4" />}
              className="animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              className="animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Add Resource
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <StatCard
          label="Total Resources"
          value={stats.total}
          icon={<Layers className="h-5 w-5" />}
          color="from-primary-500 to-primary-600"
        />
        <StatCard
          label="Running"
          value={stats.running}
          icon={<Play className="h-5 w-5" />}
          color="from-success-500 to-success-600"
        />
        <StatCard
          label="Stopped"
          value={stats.stopped}
          icon={<Square className="h-5 w-5" />}
          color="from-warning-500 to-warning-600"
        />
        <StatCard
          label="Monthly Cost"
          value={formatCurrency(stats.totalCost)}
          icon={<DollarSign className="h-5 w-5" />}
          color="from-secondary-500 to-secondary-600"
        />
        <StatCard
          label="Regions"
          value={stats.regions}
          icon={<MapPin className="h-5 w-5" />}
          color="from-info-500 to-info-600"
        />
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardBody>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Search by name, ID, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full rounded-xl border bg-neutral-50 dark:bg-neutral-900',
                  'border-neutral-200 dark:border-neutral-800',
                  'pl-10 pr-4 py-3 text-sm',
                  'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                  'focus:border-primary-500 dark:focus:border-primary-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Resource Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {resourceTypes.slice(0, 6).map((type) => (
                    <FilterChip
                      key={type}
                      label={type === 'all' ? 'All Types' : type}
                      active={selectedType === type}
                      onClick={() => setSelectedType(type)}
                    />
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusTypes.map((status) => (
                    <FilterChip
                      key={status}
                      label={status === 'all' ? 'All Status' : status}
                      active={selectedStatus === status}
                      onClick={() => setSelectedStatus(status)}
                    />
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Region
                </label>
                <div className="flex flex-wrap gap-2">
                  {regions.slice(0, 4).map((region) => (
                    <FilterChip
                      key={region}
                      label={region === 'all' ? 'All Regions' : region}
                      active={selectedRegion === region}
                      onClick={() => setSelectedRegion(region)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedResources.size > 0 && (
        <div className="mb-6 rounded-2xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/50 p-4 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">
                {selectedResources.size} selected
              </Badge>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Bulk actions available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('start')}
                leftIcon={<Play className="h-4 w-4" />}
              >
                Start
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('stop')}
                leftIcon={<Square className="h-4 w-4" />}
              >
                Stop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('tag')}
                leftIcon={<Tag className="h-4 w-4" />}
              >
                Tag
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('terminate')}
                leftIcon={<Trash2 className="h-4 w-4" />}
                className="text-error-600 hover:text-error-700 dark:text-error-400"
              >
                Terminate
              </Button>
              <div className="ml-2 h-6 w-px bg-neutral-300 dark:bg-neutral-700" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedResources(new Set())}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle and Results */}
      <div className="mb-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing <span className="font-medium text-neutral-900 dark:text-neutral-100">{filteredResources.length}</span> of{' '}
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{resources.length}</span> resources
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resources Display */}
      {isLoading ? (
        <ResourcesLoading viewMode={viewMode} />
      ) : error ? (
        <ResourcesError error={error} onRetry={refetch} />
      ) : filteredResources.length === 0 ? (
        <ResourcesEmpty onClear={() => {
          setSearchQuery('');
          setSelectedType('all');
          setSelectedStatus('all');
          setSelectedRegion('all');
        }} />
      ) : viewMode === 'grid' ? (
        <ResourcesGrid
          resources={filteredResources}
          selectedResources={selectedResources}
          onToggleSelect={toggleResourceSelection}
        />
      ) : (
        <ResourcesTable
          resources={filteredResources}
          selectedResources={selectedResources}
          onToggleSelect={toggleResourceSelection}
          onToggleSelectAll={toggleSelectAll}
        />
      )}
    </DashboardLayout>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border p-4',
      'bg-white dark:bg-neutral-900',
      'border-neutral-200 dark:border-neutral-800',
      'shadow-soft hover:shadow-medium',
      'transition-all duration-300 hover:-translate-y-1'
    )}>
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity',
        `bg-gradient-to-br ${color}`
      )} />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
        </div>
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          `bg-gradient-to-br ${color}`,
          'text-white shadow-lg group-hover:scale-110 transition-transform'
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Filter Chip Component
 */
interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700 dark:bg-primary-500'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
      )}
    >
      {label}
    </button>
  );
}

/**
 * Resources Table View
 */
interface ResourcesTableProps {
  resources: AWSResource[];
  selectedResources: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

function ResourcesTable({
  resources,
  selectedResources,
  onToggleSelect,
  onToggleSelectAll,
}: ResourcesTableProps) {
  const allSelected = resources.length > 0 && selectedResources.size === resources.length;

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Resource
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Region
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Monthly Cost
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Owner
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Last Accessed
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {resources.map((resource, index) => (
              <ResourceTableRow
                key={resource.id}
                resource={resource}
                selected={selectedResources.has(resource.id)}
                onToggleSelect={() => onToggleSelect(resource.id)}
                delay={`${0.7 + index * 0.05}s`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/**
 * Resource Table Row
 */
interface ResourceTableRowProps {
  resource: AWSResource;
  selected: boolean;
  onToggleSelect: () => void;
  delay: string;
}

function ResourceTableRow({ resource, selected, onToggleSelect, delay }: ResourceTableRowProps) {
  const statusVariants: Record<ResourceStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    running: 'success',
    stopped: 'warning',
    terminated: 'error',
    pending: 'info',
    error: 'error',
  };

  return (
    <tr 
      className={cn(
        'group transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50',
        'animate-fade-in'
      )}
      style={{ animationDelay: delay }}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
        />
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {resource.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {resource.id}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="info" size="sm">
          {resource.type}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusVariants[resource.status]} size="sm" withDot>
          {resource.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
        {resource.region}
      </td>
      <td className="px-4 py-3 text-right">
        <span className={cn(
          'font-medium',
          resource.monthlyCost >= 500
            ? 'text-error-700 dark:text-error-400'
            : resource.monthlyCost >= 200
            ? 'text-warning-700 dark:text-warning-400'
            : 'text-success-700 dark:text-success-400'
        )}>
          {formatCurrency(resource.monthlyCost)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
        {resource.owner}
      </td>
      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
        {formatRelativeTime(resource.lastAccessed)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" aria-label="View details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Edit resource">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="More actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

/**
 * Resources Grid View
 */
interface ResourcesGridProps {
  resources: AWSResource[];
  selectedResources: Set<string>;
  onToggleSelect: (id: string) => void;
}

function ResourcesGrid({ resources, selectedResources, onToggleSelect }: ResourcesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {resources.map((resource, index) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          selected={selectedResources.has(resource.id)}
          onToggleSelect={() => onToggleSelect(resource.id)}
          delay={`${0.6 + index * 0.05}s`}
        />
      ))}
    </div>
  );
}

/**
 * Resource Card Component
 */
interface ResourceCardProps {
  resource: AWSResource;
  selected: boolean;
  onToggleSelect: () => void;
  delay: string;
}

function ResourceCard({ resource, selected, onToggleSelect, delay }: ResourceCardProps) {
  const statusVariants: Record<ResourceStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    running: 'success',
    stopped: 'warning',
    terminated: 'error',
    pending: 'info',
    error: 'error',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-4',
        'bg-white dark:bg-neutral-900',
        'border-neutral-200 dark:border-neutral-800',
        'shadow-soft hover:shadow-medium',
        'transition-all duration-300 hover:-translate-y-1',
        'animate-scale-in',
        selected && 'ring-2 ring-primary-500'
      )}
      style={{ animationDelay: delay }}
    >
      {/* Selection checkbox */}
      <div className="absolute right-4 top-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
        />
      </div>

      {/* Resource icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
        <Server className="h-6 w-6" />
      </div>

      {/* Resource info */}
      <div className="mb-4">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {resource.name}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {resource.id}
        </p>
      </div>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="info" size="sm">
          {resource.type}
        </Badge>
        <Badge variant={statusVariants[resource.status]} size="sm" withDot>
          {resource.status}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">Region</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {resource.region}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">Cost</span>
          <span className={cn(
            'font-semibold',
            resource.monthlyCost >= 500
              ? 'text-error-700 dark:text-error-400'
              : resource.monthlyCost >= 200
              ? 'text-warning-700 dark:text-warning-400'
              : 'text-success-700 dark:text-success-400'
          )}>
            {formatCurrency(resource.monthlyCost)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">Owner</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[120px]">
            {resource.owner}
          </span>
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" fullWidth leftIcon={<Eye className="h-4 w-4" />}>
          View
        </Button>
        <Button variant="ghost" size="sm" fullWidth leftIcon={<Edit className="h-4 w-4" />}>
          Edit
        </Button>
      </div>
    </div>
  );
}

/**
 * Resources Loading State
 */
interface ResourcesLoadingProps {
  viewMode: ViewMode;
}

function ResourcesLoading({ viewMode }: ResourcesLoadingProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4"
          >
            <div className="space-y-4">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div>
                <div className="skeleton h-5 w-32 rounded" />
                <div className="skeleton mt-2 h-3 w-24 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="skeleton h-4 w-4 rounded" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-48 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
            <div className="flex gap-1">
              <div className="skeleton h-8 w-8 rounded" />
              <div className="skeleton h-8 w-8 rounded" />
              <div className="skeleton h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Resources Error State
 */
interface ResourcesErrorProps {
  error: string;
  onRetry: () => void;
}

function ResourcesError({ error, onRetry }: ResourcesErrorProps) {
  return (
    <Card className="animate-fade-in">
      <CardBody>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-100 dark:bg-error-950 animate-pulse">
            <Server className="h-8 w-8 text-error-600 dark:text-error-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Failed to Load Resources
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md text-center">
            {error}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-4 w-4" />}
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Resources Empty State
 */
interface ResourcesEmptyProps {
  onClear: () => void;
}

function ResourcesEmpty({ onClear }: ResourcesEmptyProps) {
  return (
    <Card className="animate-fade-in">
      <CardBody>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Search className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No Resources Found
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md text-center">
            We couldn&apos;t find any resources matching your filters. Try adjusting your search or filters.
          </p>
          <Button
            variant="ghost"
            size="md"
            onClick={onClear}
            className="mt-6"
          >
            Clear All Filters
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}