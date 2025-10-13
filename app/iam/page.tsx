/**
 * IAM Dashboard Page
 *
 * Comprehensive IAM role and user management with least-privilege patterns.
 * Demonstrates security best practices and risk assessment.
 *
 * Features:
 * - IAM roles with risk scoring
 * - User access levels
 * - Least-privilege recommendations
 * - MFA status tracking
 * - Permission analysis
 *
 * @route /iam
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge, Button, Card } from '@/components/ui';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { IAMRole, IAMUser } from '@/lib/types';

export default function IAMPage() {
  const [roles, setRoles] = useState<IAMRole[]>([]);
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'recommendations'>('roles');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [riskFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolesRes, usersRes] = await Promise.all([
        fetch(`/api/iam/roles?riskLevel=${riskFilter !== 'all' ? riskFilter : ''}`),
        fetch(`/api/iam/users?riskLevel=${riskFilter !== 'all' ? riskFilter : ''}`),
      ]);

      if (!rolesRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch IAM data');
      }

      const rolesData = await rolesRes.json();
      const usersData = await usersRes.json();

      setRoles(rolesData.data.roles || []);
      setUsers(usersData.data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filteredRoles = roles.filter((role) =>
    searchQuery
      ? role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const filteredUsers = users.filter((user) =>
    searchQuery
      ? user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Calculate statistics
  const stats = {
    totalRoles: roles.length,
    highRiskRoles: roles.filter((r) => r.riskScore >= 60).length,
    totalUsers: users.length,
    usersWithoutMFA: users.filter((u) => !u.mfaEnabled).length,
    adminUsers: users.filter((u) => u.accessLevel === 'admin').length,
    averageRiskScore: roles.length > 0 ? roles.reduce((sum, r) => sum + r.riskScore, 0) / roles.length : 0,
  };

  return (
    <DashboardLayout activeRoute="/iam">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">IAM Security</h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              Manage roles, users, and least-privilege access patterns
            </p>
          </div>

          <Button variant="ghost" size="md" onClick={fetchData} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <StatCard
          label="Total Roles"
          value={stats.totalRoles}
          icon={<Key className="h-5 w-5" />}
          color="from-primary-500 to-primary-600"
        />
        <StatCard
          label="High Risk Roles"
          value={stats.highRiskRoles}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="from-error-500 to-error-600"
          badge={
            stats.highRiskRoles > 0 ? (
              <Badge variant="error" size="sm">
                Needs Review
              </Badge>
            ) : undefined
          }
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />}
          color="from-success-500 to-success-600"
        />
        <StatCard
          label="Users Without MFA"
          value={stats.usersWithoutMFA}
          icon={<Shield className="h-5 w-5" />}
          color="from-warning-500 to-warning-600"
          badge={
            stats.usersWithoutMFA > 0 ? (
              <Badge variant="warning" size="sm">
                Action Required
              </Badge>
            ) : undefined
          }
        />
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search roles or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full rounded-lg border py-2 pl-10 pr-4',
              'bg-white dark:bg-neutral-900',
              'border-neutral-200 dark:border-neutral-800',
              'text-neutral-900 dark:text-neutral-100',
              'placeholder:text-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
          />
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  riskFilter === level
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                )}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)} Risk
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200 dark:border-neutral-800 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex gap-4">
          {[
            { id: 'roles', label: 'IAM Roles', count: filteredRoles.length },
            { id: 'users', label: 'IAM Users', count: filteredUsers.length },
            { id: 'recommendations', label: 'Recommendations', count: stats.highRiskRoles + stats.usersWithoutMFA },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
              )}
            >
              {tab.label}{' '}
              <span className="ml-1 rounded-full bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-950/30 p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-error-600 dark:text-error-400" />
          <h3 className="mb-2 text-lg font-semibold text-error-900 dark:text-error-100">Failed to Load Data</h3>
          <p className="mb-4 text-sm text-error-700 dark:text-error-300">{error}</p>
          <Button variant="primary" onClick={fetchData}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          {activeTab === 'roles' && <RolesTab roles={filteredRoles} />}
          {activeTab === 'users' && <UsersTab users={filteredUsers} />}
          {activeTab === 'recommendations' && <RecommendationsTab roles={roles} users={users} />}
        </>
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
  badge?: React.ReactNode;
}

function StatCard({ label, value, icon, color, badge }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow', color)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

/**
 * Roles Tab
 */
function RolesTab({ roles }: { roles: IAMRole[] }) {
  if (roles.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-12 text-center">
        <Key className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No Roles Found</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 animate-fade-in">
      {roles.map((role, index) => (
        <RoleCard key={role.arn} role={role} delay={`${0.4 + index * 0.05}s`} />
      ))}
    </div>
  );
}

/**
 * Role Card Component
 */
function RoleCard({ role, delay }: { role: IAMRole; delay: string }) {
  const getRiskColor = (score: number) => {
    if (score >= 60) return 'from-error-500 to-error-600';
    if (score >= 30) return 'from-warning-500 to-warning-600';
    return 'from-success-500 to-success-600';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 60) return { label: 'High Risk', variant: 'error' as const };
    if (score >= 30) return { label: 'Medium Risk', variant: 'warning' as const };
    return { label: 'Low Risk', variant: 'success' as const };
  };

  const risk = getRiskLevel(role.riskScore);

  return (
    <Card
      className={cn('p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 animate-scale-in')}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white', getRiskColor(role.riskScore))}>
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{role.name}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{role.arn}</p>
          </div>
        </div>
        <Badge variant={risk.variant} size="sm">
          {risk.label}
        </Badge>
      </div>

      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{role.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Risk Score</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{role.riskScore}/100</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Policies</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{role.policies.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Trusted Entities</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{role.trustedEntities.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Last Used</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {role.lastUsed ? formatRelativeTime(role.lastUsed) : 'Never'}
          </span>
        </div>
      </div>

      {role.isOverlyPermissive && (
        <div className="flex items-center gap-2 rounded-lg bg-warning-50 dark:bg-warning-950/30 p-2 text-xs text-warning-700 dark:text-warning-300">
          <AlertTriangle className="h-4 w-4" />
          <span>Overly permissive - review needed</span>
        </div>
      )}

      {role.permissionsBoundary && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-success-50 dark:bg-success-950/30 p-2 text-xs text-success-700 dark:text-success-300">
          <Shield className="h-4 w-4" />
          <span>Permissions boundary applied</span>
        </div>
      )}
    </Card>
  );
}

/**
 * Users Tab
 */
function UsersTab({ users }: { users: IAMUser[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-12 text-center">
        <Users className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No Users Found</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 animate-fade-in">
      {users.map((user, index) => (
        <UserCard key={user.id} user={user} delay={`${0.4 + index * 0.05}s`} />
      ))}
    </div>
  );
}

/**
 * User Card Component
 */
function UserCard({ user, delay }: { user: IAMUser; delay: string }) {
  const accessLevelColors = {
    admin: 'from-error-500 to-error-600',
    'power-user': 'from-warning-500 to-warning-600',
    'read-only': 'from-success-500 to-success-600',
  };

  return (
    <Card
      className={cn('p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 animate-scale-in')}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white', accessLevelColors[user.accessLevel])}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{user.username}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
          </div>
        </div>
        <Badge variant={user.mfaEnabled ? 'success' : 'error'} size="sm">
          {user.mfaEnabled ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          MFA
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Access Level</span>
          <Badge variant="info" size="sm">
            {user.accessLevel}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Risk Score</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{user.riskScore}/100</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Roles</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{user.roles.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Last Activity</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {formatRelativeTime(user.lastActivity)}
          </span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Recommendations Tab
 */
function RecommendationsTab({ roles, users }: { roles: IAMRole[]; users: IAMUser[] }) {
  const recommendations = [];

  // High risk roles
  const highRiskRoles = roles.filter((r) => r.riskScore >= 60);
  if (highRiskRoles.length > 0) {
    recommendations.push({
      type: 'roles',
      severity: 'high',
      title: 'Review high-risk IAM roles',
      description: `${highRiskRoles.length} role(s) have elevated risk scores`,
      count: highRiskRoles.length,
      icon: <AlertTriangle className="h-5 w-5" />,
    });
  }

  // Users without MFA
  const noMfaUsers = users.filter((u) => !u.mfaEnabled);
  if (noMfaUsers.length > 0) {
    recommendations.push({
      type: 'security',
      severity: 'high',
      title: 'Enable MFA for all users',
      description: `${noMfaUsers.length} user(s) do not have MFA enabled`,
      count: noMfaUsers.length,
      icon: <Shield className="h-5 w-5" />,
    });
  }

  // Overly permissive roles
  const permissiveRoles = roles.filter((r) => r.isOverlyPermissive);
  if (permissiveRoles.length > 0) {
    recommendations.push({
      type: 'permissions',
      severity: 'medium',
      title: 'Apply least-privilege principle',
      description: `${permissiveRoles.length} role(s) have overly broad permissions`,
      count: permissiveRoles.length,
      icon: <Unlock className="h-5 w-5" />,
    });
  }

  // Roles without permissions boundary
  const noBoundaryRoles = roles.filter((r) => !r.permissionsBoundary);
  if (noBoundaryRoles.length > 0) {
    recommendations.push({
      type: 'boundary',
      severity: 'low',
      title: 'Add permissions boundaries',
      description: `${noBoundaryRoles.length} role(s) lack permission boundaries`,
      count: noBoundaryRoles.length,
      icon: <Lock className="h-5 w-5" />,
    });
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-12 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success-600 dark:text-success-400" />
        <h3 className="mb-2 text-lg font-semibold text-success-900 dark:text-success-100">All Clear!</h3>
        <p className="text-sm text-success-700 dark:text-success-300">
          No security recommendations at this time
        </p>
      </div>
    );
  }

  const severityColors = {
    high: 'from-error-500 to-error-600',
    medium: 'from-warning-500 to-warning-600',
    low: 'from-info-500 to-info-600',
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {recommendations.map((rec, index) => (
        <Card
          key={rec.title}
          className={cn('p-6 transition-all duration-300 hover:shadow-medium animate-slide-up')}
          style={{ animationDelay: `${0.4 + index * 0.1}s` }}
        >
          <div className="flex items-start gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white flex-shrink-0', severityColors[rec.severity as keyof typeof severityColors])}>
              {rec.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{rec.title}</h3>
                <Badge variant={rec.severity === 'high' ? 'error' : rec.severity === 'medium' ? 'warning' : 'info'} size="sm">
                  {rec.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Affects {rec.count} {rec.type}
                </span>
                <Button variant="ghost" size="sm">
                  View Details →
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
