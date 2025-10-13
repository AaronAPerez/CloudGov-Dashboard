/**
 * Security Page - CloudGov Dashboard
 * 
 * Comprehensive security and compliance monitoring interface with:
 * - Security findings dashboard
 * - Compliance score tracking
 * - Real-time threat detection
 * - Vulnerability management
 * - Compliance framework support
 * - Remediation workflows
 * - Dark mode support
 * - Export functionality
 * 
 * @route /security
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CheckSquare,
  XSquare,
  AlertCircle,
  Server,
  FileText,
  Zap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import { useSecurity } from '@/hooks';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { SecurityFinding } from '@/lib/types';

/**
 * Severity filter type
 */
type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

/**
 * Status filter type
 */
type StatusFilter = 'all' | 'open' | 'in-progress' | 'resolved' | 'dismissed';

/**
 * Security Page Component
 */
export default function SecurityPage() {
  // State management
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedFindings, setSelectedFindings] = useState<Set<string>>(new Set());

  // Fetch security data
  const {
    findings,
    compliance,
    priorityFindings,
    isLoading,
    error,
    refetch,
    resolveFinding,
    dismissFinding,
  } = useSecurity();

  // Filter findings
  const filteredFindings = useMemo(() => {
    let filtered = findings;

    if (severityFilter !== 'all') {
      filtered = filtered.filter((f) => f.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((f) => f.status === statusFilter);
    }

    return filtered;
  }, [findings, severityFilter, statusFilter]);

  // Group findings by severity
  const findingsBySeverity = useMemo(() => {
    return {
      critical: findings.filter((f) => f.severity === 'critical' && f.status === 'open').length,
      high: findings.filter((f) => f.severity === 'high' && f.status === 'open').length,
      medium: findings.filter((f) => f.severity === 'medium' && f.status === 'open').length,
      low: findings.filter((f) => f.severity === 'low' && f.status === 'open').length,
    };
  }, [findings]);

  // Compliance frameworks
  const frameworks = [
    { name: 'CIS AWS Foundations', score: 87, passing: 42, total: 48 },
    { name: 'NIST 800-53', score: 92, passing: 156, total: 169 },
    { name: 'PCI-DSS v3.2', score: 78, passing: 234, total: 300 },
    { name: 'SOC 2 Type II', score: 95, passing: 68, total: 71 },
  ];

  // Security trends
  const trends = {
    newFindings: 12,
    resolvedFindings: 8,
    avgResolutionTime: '2.5 days',
    securityScore: compliance?.score || 0,
    scoreChange: 5,
  };

  return (
    <DashboardLayout activeRoute="/security">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-error-500 to-error-600 text-white shadow-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-error-500 to-error-600 opacity-20 blur" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  Security & Compliance
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Monitor security posture and compliance status
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
              variant="secondary"
              size="md"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Security Score and Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <SecurityMetricCard
          title="Security Score"
          value={`${compliance?.score || 0}%`}
          grade={compliance?.grade || 'N/A'}
          change={trends.scoreChange}
          icon={<Shield className="h-6 w-6" />}
          color="from-primary-500 to-primary-600"
        />
        <SecurityMetricCard
          title="Critical Issues"
          value={findingsBySeverity.critical}
          icon={<XCircle className="h-6 w-6" />}
          color="from-error-500 to-error-600"
          badge={<Badge variant="error" size="sm">Urgent</Badge>}
        />
        <SecurityMetricCard
          title="High Priority"
          value={findingsBySeverity.high}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="from-warning-500 to-warning-600"
        />
        <SecurityMetricCard
          title="Resolved This Week"
          value={trends.resolvedFindings}
          icon={<CheckCircle className="h-6 w-6" />}
          color="from-success-500 to-success-600"
        />
        <SecurityMetricCard
          title="Avg Resolution"
          value={trends.avgResolutionTime}
          icon={<Clock className="h-6 w-6" />}
          color="from-info-500 to-info-600"
        />
      </div>

      {/* Compliance Frameworks */}
      <Card className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Compliance Frameworks
            </h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {frameworks.map((framework, index) => (
              <ComplianceFrameworkCard
                key={framework.name}
                framework={framework}
                delay={`${0.3 + index * 0.1}s`}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Filters:
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Severity:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as SeverityFilter[]).map((severity) => (
            <Button
              key={severity}
              variant={severityFilter === severity ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSeverityFilter(severity)}
            >
              {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Status:</span>
          {(['all', 'open', 'in-progress', 'resolved'] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Findings Count */}
      <div className="mb-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing <span className="font-medium text-neutral-900 dark:text-neutral-100">{filteredFindings.length}</span> of{' '}
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{findings.length}</span> findings
        </p>

        {selectedFindings.size > 0 && (
          <Badge variant="info" size="md">
            {selectedFindings.size} selected
          </Badge>
        )}
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {isLoading ? (
          <FindingsLoading />
        ) : error ? (
          <FindingsError error={error} onRetry={refetch} />
        ) : filteredFindings.length === 0 ? (
          <FindingsEmpty onClear={() => {
            setSeverityFilter('all');
            setStatusFilter('all');
          }} />
        ) : (
          filteredFindings.map((finding, index) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              selected={selectedFindings.has(finding.id)}
              onToggleSelect={() => {
                const newSelection = new Set(selectedFindings);
                if (newSelection.has(finding.id)) {
                  newSelection.delete(finding.id);
                } else {
                  newSelection.add(finding.id);
                }
                setSelectedFindings(newSelection);
              }}
              onResolve={() => resolveFinding(finding.id)}
              onDismiss={() => dismissFinding(finding.id)}
              delay={`${0.6 + index * 0.05}s`}
            />
          ))
        )}
      </div>

      {/* Security Best Practices */}
      <Card className="mt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Security Best Practices
            </h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <BestPracticeItem
              title="Enable MFA on All Accounts"
              description="Multi-factor authentication adds an extra layer of security"
              status="warning"
              completion={78}
            />
            <BestPracticeItem
              title="Rotate Access Keys Regularly"
              description="Access keys should be rotated every 90 days"
              status="success"
              completion={92}
            />
            <BestPracticeItem
              title="Enable CloudTrail Logging"
              description="Monitor and audit all API calls across your infrastructure"
              status="success"
              completion={100}
            />
            <BestPracticeItem
              title="Encrypt Data at Rest"
              description="Enable encryption for all storage services"
              status="error"
              completion={65}
            />
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}

/**
 * Security Metric Card Component
 */
interface SecurityMetricCardProps {
  title: string;
  value: string | number;
  grade?: string;
  change?: number;
  icon: React.ReactNode;
  color: string;
  badge?: React.ReactNode;
}

function SecurityMetricCard({
  title,
  value,
  grade,
  change,
  icon,
  color,
  badge,
}: SecurityMetricCardProps) {
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
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {value}
            </p>
            {grade && (
              <span className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">
                {grade}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {change !== undefined && (
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                change > 0
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-error-600 dark:text-error-400'
              )}>
                {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(change)}%
              </div>
            )}
            {badge && badge}
          </div>
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

/**
 * Compliance Framework Card
 */
interface ComplianceFrameworkCardProps {
  framework: {
    name: string;
    score: number;
    passing: number;
    total: number;
  };
  delay: string;
}

function ComplianceFrameworkCard({ framework, delay }: ComplianceFrameworkCardProps) {
  const percentage = (framework.passing / framework.total) * 100;
  const scoreColor = framework.score >= 90 ? 'success' : framework.score >= 75 ? 'warning' : 'error';

  return (
    <div 
      className={cn(
        'rounded-lg border p-4',
        'bg-neutral-50 dark:bg-neutral-800/50',
        'border-neutral-200 dark:border-neutral-700',
        'hover:shadow-md transition-all duration-200',
        'animate-scale-in'
      )}
      style={{ animationDelay: delay }}
    >
      <div className="mb-3">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
          {framework.name}
        </h4>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant={scoreColor} size="sm">
            {framework.score}% compliant
          </Badge>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {framework.passing}/{framework.total}
          </span>
        </div>
      </div>
      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            scoreColor === 'success' && 'bg-gradient-to-r from-success-500 to-success-600',
            scoreColor === 'warning' && 'bg-gradient-to-r from-warning-500 to-warning-600',
            scoreColor === 'error' && 'bg-gradient-to-r from-error-500 to-error-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Finding Card Component
 */
interface FindingCardProps {
  finding: SecurityFinding;
  selected: boolean;
  onToggleSelect: () => void;
  onResolve: () => void;
  onDismiss: () => void;
  delay: string;
}

function FindingCard({
  finding,
  selected,
  onToggleSelect,
  onResolve,
  onDismiss,
  delay,
}: FindingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const severityConfig = {
    critical: {
      variant: 'error' as const,
      icon: XCircle,
      color: 'text-error-600 dark:text-error-400',
      bg: 'bg-error-100 dark:bg-error-950',
    },
    high: {
      variant: 'warning' as const,
      icon: AlertTriangle,
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-100 dark:bg-warning-950',
    },
    medium: {
      variant: 'warning' as const,
      icon: AlertCircle,
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-100 dark:bg-warning-950',
    },
    low: {
      variant: 'info' as const,
      icon: AlertCircle,
      color: 'text-info-600 dark:text-info-400',
      bg: 'bg-info-100 dark:bg-info-950',
    },
  };

  const statusConfig = {
    open: { variant: 'error' as const, label: 'Open' },
    'in-progress': { variant: 'warning' as const, label: 'In Progress' },
    resolved: { variant: 'success' as const, label: 'Resolved' },
    dismissed: { variant: 'neutral' as const, label: 'Dismissed' },
  };

  const config = severityConfig[finding.severity];
  const status = statusConfig[finding.status];
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
      {/* Header */}
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="mt-1 h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
        />

        <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg', config.bg)}>
          <Icon className={cn('h-5 w-5', config.color)} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {finding.title}
                </h4>
                <Badge variant={config.variant} size="sm">
                  {finding.severity}
                </Badge>
                <Badge variant={status.variant} size="sm">
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {finding.description}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Server className="h-3 w-3" />
                  {finding.resourceType}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(finding.detectedAt)}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              leftIcon={<Eye className="h-4 w-4" />}
            >
              {expanded ? 'Hide' : 'Details'}
            </Button>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 space-y-3 animate-slide-down">
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4">
                <h5 className="mb-2 font-medium text-neutral-900 dark:text-neutral-100">
                  Remediation Steps
                </h5>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {finding.remediation}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {finding.status === 'open' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onResolve}
                      leftIcon={<CheckSquare className="h-4 w-4" />}
                    >
                      Mark as Resolved
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDismiss}
                      leftIcon={<XSquare className="h-4 w-4" />}
                    >
                      Dismiss
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Best Practice Item
 */
interface BestPracticeItemProps {
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  completion: number;
}

function BestPracticeItem({ title, description, status, completion }: BestPracticeItemProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-success-600 dark:text-success-400',
      barColor: 'from-success-500 to-success-600',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-warning-600 dark:text-warning-400',
      barColor: 'from-warning-500 to-warning-600',
    },
    error: {
      icon: XCircle,
      color: 'text-error-600 dark:text-error-400',
      barColor: 'from-error-500 to-error-600',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-start gap-3 mb-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.color)} />
        <div className="flex-1">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            {title}
          </h4>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', `bg-gradient-to-r ${config.barColor}`)}
            style={{ width: `${completion}%` }}
          />
        </div>
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {completion}%
        </span>
      </div>
    </div>
  );
}

/**
 * Findings Loading State
 */
function FindingsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="skeleton h-4 w-4 rounded" />
            <div className="skeleton h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-5 w-3/4 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="flex gap-2">
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Findings Error State
 */
interface FindingsErrorProps {
  error: string;
  onRetry: () => void;
}

function FindingsError({ error, onRetry }: FindingsErrorProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-100 dark:bg-error-950">
            <Shield className="h-8 w-8 text-error-600 dark:text-error-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Failed to Load Security Findings
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
 * Findings Empty State
 */
interface FindingsEmptyProps {
  onClear: () => void;
}

function FindingsEmpty({ onClear }: FindingsEmptyProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100 dark:bg-success-950">
            <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No Security Findings
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md text-center">
            No security findings match your current filters. Your infrastructure appears secure!
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={onClear}
            className="mt-6"
          >
            Clear Filters
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}