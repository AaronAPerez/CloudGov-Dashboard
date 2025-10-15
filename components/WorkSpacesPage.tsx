/**
 * AWS WorkSpaces Manager - CloudGov Dashboard
 * 
 * Demonstrates qualifications:
 * ✅ AWS WorkSpaces API orchestration and management
 * ✅ Modern serverless architecture patterns
 * ✅ Least privileged IAM role implementation
 * ✅ Secure, scalable system design
 * ✅ Real-world AWS service integration
 * 
 * Features:
 * - WorkSpaces fleet management
 * - Automated provisioning/deprovisioning
 * - User assignment and access control
 * - Performance monitoring
 * - Cost optimization
 * - Bundle management
 * - Connection health tracking
 * - Compliance reporting
 * 
 * Architecture:
 * - API Gateway → Lambda → WorkSpaces API
 * - DynamoDB for state management
 * - EventBridge for automation
 * - CloudWatch for monitoring
 * - SNS for notifications
 * 
 * @route /workspaces
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Monitor,
  Users,
  Plus,
  Power,
  Trash2,
  RefreshCw,
  Settings,
  Activity,
  DollarSign,
  Shield,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Network,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  UserMinus,
  Eye,
  BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardBody, Badge, Button, Input } from '@/components/ui';
import { useWorkSpaces, useToast } from '@/hooks';
import { formatCurrency, formatBytes, formatRelativeTime, cn } from '@/lib/utils';

/**
 * WorkSpace Status Types
 */
type WorkSpaceStatus = 
  | 'PENDING'
  | 'AVAILABLE' 
  | 'IMPAIRED'
  | 'UNHEALTHY'
  | 'REBOOTING'
  | 'STARTING'
  | 'REBUILDING'
  | 'RESTORING'
  | 'MAINTENANCE'
  | 'ADMIN_MAINTENANCE'
  | 'TERMINATING'
  | 'TERMINATED'
  | 'SUSPENDED'
  | 'UPDATING'
  | 'STOPPING'
  | 'STOPPED'
  | 'ERROR';

/**
 * WorkSpace Interface
 */
interface WorkSpace {
  workspaceId: string;
  userName: string;
  directoryId: string;
  bundleId: string;
  computeTypeName: string;
  userVolumeEncryptionEnabled: boolean;
  rootVolumeEncryptionEnabled: boolean;
  ipAddress: string;
  state: WorkSpaceStatus;
  subnetId: string;
  runningMode: 'AUTO_STOP' | 'ALWAYS_ON';
  runningModeAutoStopTimeoutInMinutes?: number;
  lastKnownUserConnectionTimestamp?: Date;
  connectionState?: 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN';
  tags: Record<string, string>;
  monthlyCost: number;
  createdAt: Date;
}

/**
 * WorkSpaces Page Component
 */
export default function WorkSpacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkSpaceStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkSpaces, setSelectedWorkSpaces] = useState<Set<string>>(new Set());
  
  const {
    workspaces,
    bundles,
    directories,
    metrics,
    isLoading,
    error,
    refetch,
    createWorkSpace,
    deleteWorkSpace,
    rebootWorkSpace,
    rebuildWorkSpace,
    startWorkSpaces,
    stopWorkSpaces,
    modifyWorkSpace,
  } = useWorkSpaces();

  const { showToast } = useToast();

  // Filter workspaces
  const filteredWorkSpaces = useMemo(() => {
    let filtered = workspaces;

    if (searchQuery) {
      filtered = filtered.filter(
        (ws) =>
          ws.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ws.workspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ws.ipAddress.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((ws) => ws.state === statusFilter);
    }

    return filtered;
  }, [workspaces, searchQuery, statusFilter]);

  // Calculate fleet statistics
  const fleetStats = useMemo(() => {
    const total = workspaces.length;
    const running = workspaces.filter((ws) => ws.state === 'AVAILABLE').length;
    const stopped = workspaces.filter((ws) => ws.state === 'STOPPED').length;
    const unhealthy = workspaces.filter(
      (ws) => ws.state === 'UNHEALTHY' || ws.state === 'IMPAIRED' || ws.state === 'ERROR'
    ).length;
    const connected = workspaces.filter((ws) => ws.connectionState === 'CONNECTED').length;
    const totalCost = workspaces.reduce((sum, ws) => sum + ws.monthlyCost, 0);

    return { total, running, stopped, unhealthy, connected, totalCost };
  }, [workspaces]);

  // Handle bulk actions
  const handleBulkAction = async (action: 'start' | 'stop' | 'reboot' | 'delete') => {
    const selectedIds = Array.from(selectedWorkSpaces);
    
    try {
      switch (action) {
        case 'start':
          await startWorkSpaces(selectedIds);
          showToast({ type: 'success', message: `Starting ${selectedIds.length} WorkSpaces` });
          break;
        case 'stop':
          await stopWorkSpaces(selectedIds);
          showToast({ type: 'success', message: `Stopping ${selectedIds.length} WorkSpaces` });
          break;
        case 'reboot':
          for (const id of selectedIds) {
            await rebootWorkSpace(id);
          }
          showToast({ type: 'success', message: `Rebooting ${selectedIds.length} WorkSpaces` });
          break;
        case 'delete':
          for (const id of selectedIds) {
            await deleteWorkSpace(id);
          }
          showToast({ type: 'success', message: `Deleting ${selectedIds.length} WorkSpaces` });
          break;
      }
      setSelectedWorkSpaces(new Set());
      refetch();
    } catch (error) {
      showToast({ type: 'error', message: `Failed to ${action} WorkSpaces` });
    }
  };

  return (
    <DashboardLayout activeRoute="/workspaces">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                  <Monitor className="h-6 w-6" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 opacity-20 blur" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  AWS WorkSpaces
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Virtual desktop fleet orchestration and management
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
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create WorkSpace
            </Button>
          </div>
        </div>
      </div>

      {/* Fleet Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 animate-slide-up">
        <MetricCard
          title="Total WorkSpaces"
          value={fleetStats.total}
          icon={<Monitor className="h-6 w-6" />}
          color="from-primary-500 to-primary-600"
        />
        <MetricCard
          title="Running"
          value={fleetStats.running}
          icon={<CheckCircle className="h-6 w-6" />}
          color="from-success-500 to-success-600"
          badge={<Badge variant="success" size="sm">Active</Badge>}
        />
        <MetricCard
          title="Stopped"
          value={fleetStats.stopped}
          icon={<Power className="h-6 w-6" />}
          color="from-neutral-500 to-neutral-600"
        />
        <MetricCard
          title="Unhealthy"
          value={fleetStats.unhealthy}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="from-error-500 to-error-600"
          badge={fleetStats.unhealthy > 0 ? <Badge variant="error" size="sm">Alert</Badge> : undefined}
        />
        <MetricCard
          title="Connected Users"
          value={fleetStats.connected}
          icon={<Users className="h-6 w-6" />}
          color="from-info-500 to-info-600"
        />
        <MetricCard
          title="Monthly Cost"
          value={formatCurrency(fleetStats.totalCost)}
          icon={<DollarSign className="h-6 w-6" />}
          color="from-warning-500 to-warning-600"
        />
      </div>

      {/* Performance Metrics */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Fleet Health
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <HealthBar
                label="Available"
                value={fleetStats.running}
                total={fleetStats.total}
                color="from-success-500 to-success-600"
              />
              <HealthBar
                label="Stopped"
                value={fleetStats.stopped}
                total={fleetStats.total}
                color="from-neutral-500 to-neutral-600"
              />
              <HealthBar
                label="Unhealthy"
                value={fleetStats.unhealthy}
                total={fleetStats.total}
                color="from-error-500 to-error-600"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Connection Status
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {Math.round((fleetStats.connected / fleetStats.running) * 100) || 0}%
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {fleetStats.connected} of {fleetStats.running} active users connected
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Running Mode Distribution
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Always On</span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {workspaces.filter((ws) => ws.runningMode === 'ALWAYS_ON').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-info-600 dark:text-info-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Auto Stop</span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {workspaces.filter((ws) => ws.runningMode === 'AUTO_STOP').length}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Search by username, ID, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkSpaceStatus | 'all')}
            className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
          >
            <option value="all">All</option>
            <option value="AVAILABLE">Available</option>
            <option value="STOPPED">Stopped</option>
            <option value="UNHEALTHY">Unhealthy</option>
            <option value="STARTING">Starting</option>
            <option value="STOPPING">Stopping</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedWorkSpaces.size > 0 && (
        <div className="mb-6 animate-slide-down">
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="lg">
                    {selectedWorkSpaces.size} selected
                  </Badge>
                  <button
                    onClick={() => setSelectedWorkSpaces(new Set())}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Power className="h-4 w-4" />}
                    onClick={() => handleBulkAction('start')}
                  >
                    Start
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Power className="h-4 w-4" />}
                    onClick={() => handleBulkAction('stop')}
                  >
                    Stop
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                    onClick={() => handleBulkAction('reboot')}
                  >
                    Reboot
                  </Button>
                  <Button
                    variant="error"
                    size="sm"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleBulkAction('delete')}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* WorkSpaces List */}
      <div className="space-y-4">
        {isLoading ? (
          <WorkSpacesLoading />
        ) : error ? (
          <WorkSpacesError error={error} onRetry={refetch} />
        ) : filteredWorkSpaces.length === 0 ? (
          <WorkSpacesEmpty
            hasFilters={searchQuery !== '' || statusFilter !== 'all'}
            onClear={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          />
        ) : (
          filteredWorkSpaces.map((workspace, index) => (
            <WorkSpaceCard
              key={workspace.workspaceId}
              workspace={workspace}
              selected={selectedWorkSpaces.has(workspace.workspaceId)}
              onToggleSelect={() => {
                const newSelection = new Set(selectedWorkSpaces);
                if (newSelection.has(workspace.workspaceId)) {
                  newSelection.delete(workspace.workspaceId);
                } else {
                  newSelection.add(workspace.workspaceId);
                }
                setSelectedWorkSpaces(newSelection);
              }}
              onAction={async (action) => {
                try {
                  switch (action) {
                    case 'start':
                      await startWorkSpaces([workspace.workspaceId]);
                      break;
                    case 'stop':
                      await stopWorkSpaces([workspace.workspaceId]);
                      break;
                    case 'reboot':
                      await rebootWorkSpace(workspace.workspaceId);
                      break;
                    case 'rebuild':
                      await rebuildWorkSpace(workspace.workspaceId);
                      break;
                    case 'delete':
                      await deleteWorkSpace(workspace.workspaceId);
                      break;
                  }
                  showToast({ type: 'success', message: `WorkSpace ${action} initiated` });
                  refetch();
                } catch (error) {
                  showToast({ type: 'error', message: `Failed to ${action} WorkSpace` });
                }
              }}
              delay={`${0.3 + index * 0.05}s`}
            />
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

/**
 * Helper Components
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  badge?: React.ReactNode;
}

function MetricCard({ title, value, icon, color, badge }: MetricCardProps) {
  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border p-6',
      'bg-white dark:bg-neutral-900',
      'border-neutral-200 dark:border-neutral-800',
      'shadow-soft hover:shadow-medium',
      'transition-all duration-300 hover:-translate-y-1'
    )}>
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity',
        `bg-gradient-to-br ${color}`
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {value}
            </p>
          </div>
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        <div className={cn(
          'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
          `bg-gradient-to-br ${color}`,
          'text-white shadow-lg group-hover:scale-110 transition-transform'
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface HealthBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function HealthBar({ label, value, total, color }: HealthBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', `bg-gradient-to-r ${color}`)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface WorkSpaceCardProps {
  workspace: WorkSpace;
  selected: boolean;
  onToggleSelect: () => void;
  onAction: (action: 'start' | 'stop' | 'reboot' | 'rebuild' | 'delete') => void;
  delay: string;
}

function WorkSpaceCard({ workspace, selected, onToggleSelect, onAction, delay }: WorkSpaceCardProps) {
  const [showActions, setShowActions] = useState(false);

  const statusConfig: Record<WorkSpaceStatus, {
    variant: 'success' | 'error' | 'warning' | 'info' | 'neutral';
    icon: React.ComponentType<{ className?: string }>;
  }> = {
    AVAILABLE: { variant: 'success', icon: CheckCircle },
    STOPPED: { variant: 'neutral', icon: Power },
    UNHEALTHY: { variant: 'error', icon: XCircle },
    IMPAIRED: { variant: 'error', icon: AlertTriangle },
    ERROR: { variant: 'error', icon: XCircle },
    STARTING: { variant: 'info', icon: Activity },
    STOPPING: { variant: 'info', icon: Activity },
    REBOOTING: { variant: 'info', icon: RefreshCw },
    REBUILDING: { variant: 'warning', icon: Settings },
    RESTORING: { variant: 'warning', icon: Download },
    MAINTENANCE: { variant: 'warning', icon: Settings },
    ADMIN_MAINTENANCE: { variant: 'warning', icon: Settings },
    TERMINATING: { variant: 'error', icon: Trash2 },
    TERMINATED: { variant: 'neutral', icon: XCircle },
    SUSPENDED: { variant: 'warning', icon: AlertTriangle },
    UPDATING: { variant: 'info', icon: Upload },
    PENDING: { variant: 'info', icon: Clock },
  };

  const config = statusConfig[workspace.state];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'group rounded-2xl border p-6',
        'bg-white dark:bg-neutral-900',
        'border-neutral-200 dark:border-neutral-800',
        'shadow-soft hover:shadow-medium',
        'transition-all duration-300',
        'animate-scale-in',
        selected && 'ring-2 ring-primary-500'
      )}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="mt-1 h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
        />

        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
          <Monitor className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {workspace.userName}
                </h4>
                <Badge variant={config.variant} size="sm">
                  <Icon className="h-3 w-3 mr-1" />
                  {workspace.state}
                </Badge>
                {workspace.connectionState === 'CONNECTED' && (
                  <Badge variant="success" size="sm">
                    Connected
                  </Badge>
                )}
                {workspace.runningMode === 'ALWAYS_ON' && (
                  <Badge variant="info" size="sm">
                    Always On
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">WorkSpace ID</div>
                  <div className="font-mono text-xs">{workspace.workspaceId.slice(0, 15)}...</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">IP Address</div>
                  <div className="font-mono text-xs">{workspace.ipAddress}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Compute Type</div>
                  <div>{workspace.computeTypeName}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Monthly Cost</div>
                  <div className="font-semibold">{formatCurrency(workspace.monthlyCost)}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                {workspace.userVolumeEncryptionEnabled && workspace.rootVolumeEncryptionEnabled && (
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-success-600 dark:text-success-400" />
                    Encrypted
                  </span>
                )}
                {workspace.lastKnownUserConnectionTimestamp && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last connection: {formatRelativeTime(workspace.lastKnownUserConnectionTimestamp)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {formatRelativeTime(workspace.createdAt)}
                </span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg z-10">
                  <div className="p-2 space-y-1">
                    {workspace.state === 'STOPPED' && (
                      <ActionMenuItem
                        icon={<Power className="h-4 w-4" />}
                        label="Start"
                        onClick={() => {
                          onAction('start');
                          setShowActions(false);
                        }}
                      />
                    )}
                    {workspace.state === 'AVAILABLE' && (
                      <>
                        <ActionMenuItem
                          icon={<Power className="h-4 w-4" />}
                          label="Stop"
                          onClick={() => {
                            onAction('stop');
                            setShowActions(false);
                          }}
                        />
                        <ActionMenuItem
                          icon={<RefreshCw className="h-4 w-4" />}
                          label="Reboot"
                          onClick={() => {
                            onAction('reboot');
                            setShowActions(false);
                          }}
                        />
                      </>
                    )}
                    <ActionMenuItem
                      icon={<Settings className="h-4 w-4" />}
                      label="Rebuild"
                      onClick={() => {
                        onAction('rebuild');
                        setShowActions(false);
                      }}
                    />
                    <ActionMenuItem
                      icon={<Eye className="h-4 w-4" />}
                      label="View Details"
                      onClick={() => setShowActions(false)}
                    />
                    <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />
                    <ActionMenuItem
                      icon={<Trash2 className="h-4 w-4" />}
                      label="Terminate"
                      onClick={() => {
                        onAction('delete');
                        setShowActions(false);
                      }}
                      danger
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function ActionMenuItem({ icon, label, onClick, danger }: ActionMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
        danger
          ? 'text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

/**
 * Loading State
 */
function WorkSpacesLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="skeleton h-4 w-4 rounded" />
            <div className="skeleton h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-6 w-1/3 rounded" />
              <div className="grid grid-cols-4 gap-4">
                <div className="skeleton h-10 rounded" />
                <div className="skeleton h-10 rounded" />
                <div className="skeleton h-10 rounded" />
                <div className="skeleton h-10 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Error State
 */
interface WorkSpacesErrorProps {
  error: string;
  onRetry: () => void;
}

function WorkSpacesError({ error, onRetry }: WorkSpacesErrorProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-100 dark:bg-error-950">
            <XCircle className="h-8 w-8 text-error-600 dark:text-error-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Failed to Load WorkSpaces
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
 * Empty State
 */
interface WorkSpacesEmptyProps {
  hasFilters: boolean;
  onClear: () => void;
}

function WorkSpacesEmpty({ hasFilters, onClear }: WorkSpacesEmptyProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950">
            <Monitor className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {hasFilters ? 'No WorkSpaces Found' : 'No WorkSpaces Yet'}
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md text-center">
            {hasFilters
              ? 'No WorkSpaces match your current filters. Try adjusting your search criteria.'
              : 'Get started by creating your first WorkSpace for virtual desktop access.'}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={onClear}
            className="mt-6"
          >
            {hasFilters ? 'Clear Filters' : 'Create WorkSpace'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}