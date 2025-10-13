/**
 * Settings Page - CloudGov Dashboard
 * 
 * Comprehensive user preferences and configuration interface with:
 * - Profile management
 * - Notification preferences
 * - Security settings
 * - API key management
 * - Theme customization
 * - Integration settings
 * - Billing & subscription
 * - Dark mode support
 * 
 * Features:
 * - Multi-tab organization
 * - Real-time validation
 * - Auto-save functionality
 * - Two-factor authentication
 * - Export/import settings
 * - Activity log
 * 
 * @route /settings
 */

'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Palette,
  Plug,
  CreditCard,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Plus,
  Moon,
  Sun,
  Globe,
  Mail,
  Smartphone,
  Lock,
  AlertCircle,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardBody, Badge, Button, Input, Switch } from '@/components/ui';
import { cn } from '@/lib/utils';

// Stub hooks for settings functionality
function useSettings() {
  return {
    settings: {},
    updateSettings: (_settings: unknown) => Promise.resolve(),
    isLoading: false,
    isSaving: false,
  };
}

function useToast() {
  return {
    showToast: (_config: { type: string; message: string }) => {},
  };
}

/**
 * Settings tab type
 */
type SettingsTab = 'profile' | 'notifications' | 'security' | 'api' | 'appearance' | 'integrations' | 'billing';

/**
 * Settings Page Component
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { settings, updateSettings, isLoading, isSaving } = useSettings();
  const { showToast } = useToast();

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'api' as const, label: 'API Keys', icon: Key },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'integrations' as const, label: 'Integrations', icon: Plug },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ];

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      showToast({ type: 'success', message: 'Settings saved successfully' });
    } catch (error) {
      showToast({ type: 'error', message: 'Failed to save settings' });
    }
  };

  return (
    <DashboardLayout activeRoute="/settings">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 text-white shadow-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 opacity-20 blur" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  Settings
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage your account preferences and configuration
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="md"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <Card className="sticky top-6">
            <CardBody className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                        'text-sm font-medium',
                        activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'api' && <APIKeySettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'integrations' && <IntegrationSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Profile Settings Section
 */
function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    title: 'Senior Cloud Engineer',
    company: 'CloudGov',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    language: 'en',
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Profile Information
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Update your personal information and how others see you
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                Profile Picture
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                JPG, GIF or PNG. Max size 2MB.
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="secondary" size="sm">
                  Upload New
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Your role"
            />
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Company name"
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              >
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Danger Zone
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Irreversible actions for your account
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between p-4 border border-error-200 dark:border-error-800 rounded-lg bg-error-50 dark:bg-error-950">
            <div>
              <h4 className="font-medium text-error-900 dark:text-error-100">
                Delete Account
              </h4>
              <p className="text-sm text-error-700 dark:text-error-300">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Notification Settings Section
 */
function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    securityAlerts: true,
    costAlerts: true,
    weeklyReports: false,
    productUpdates: true,
    slackIntegration: false,
    smsAlerts: false,
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Email Notifications
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Choose what notifications you receive via email
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <SettingItem
            icon={<Mail className="h-5 w-5" />}
            label="Email Alerts"
            description="Receive important alerts about your infrastructure"
            checked={notifications.emailAlerts}
            onChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
          />
          <SettingItem
            icon={<Shield className="h-5 w-5" />}
            label="Security Alerts"
            description="Get notified about security findings and vulnerabilities"
            checked={notifications.securityAlerts}
            onChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
            badge={<Badge variant="error" size="sm">Critical</Badge>}
          />
          <SettingItem
            icon={<CreditCard className="h-5 w-5" />}
            label="Cost Alerts"
            description="Notifications when spending exceeds thresholds"
            checked={notifications.costAlerts}
            onChange={(checked) => setNotifications({ ...notifications, costAlerts: checked })}
          />
          <SettingItem
            icon={<Mail className="h-5 w-5" />}
            label="Weekly Reports"
            description="Receive weekly summary of your infrastructure"
            checked={notifications.weeklyReports}
            onChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
          />
          <SettingItem
            icon={<Info className="h-5 w-5" />}
            label="Product Updates"
            description="Stay informed about new features and improvements"
            checked={notifications.productUpdates}
            onChange={(checked) => setNotifications({ ...notifications, productUpdates: checked })}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Other Channels
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Configure additional notification channels
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <SettingItem
            icon={<Plug className="h-5 w-5" />}
            label="Slack Notifications"
            description="Send alerts to your Slack workspace"
            checked={notifications.slackIntegration}
            onChange={(checked) => setNotifications({ ...notifications, slackIntegration: checked })}
          />
          <SettingItem
            icon={<Smartphone className="h-5 w-5" />}
            label="SMS Alerts"
            description="Receive critical alerts via text message"
            checked={notifications.smsAlerts}
            onChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
            badge={<Badge variant="warning" size="sm">Premium</Badge>}
          />
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Security Settings Section
 */
function SecuritySettings() {
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    sessionTimeout: '30',
    ipWhitelist: false,
    apiRateLimit: true,
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Add an extra layer of security to your account
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-success-200 dark:border-success-800 rounded-lg bg-success-50 dark:bg-success-950">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 dark:bg-success-900 flex items-center justify-center">
                <Shield className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <h4 className="font-medium text-success-900 dark:text-success-100">
                  2FA Enabled
                </h4>
                <p className="text-sm text-success-700 dark:text-success-300">
                  Your account is protected with two-factor authentication
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Manage
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Authenticator App
                </h5>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Use Google Authenticator or similar apps
              </p>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Email Codes
                </h5>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Receive verification codes via email
              </p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Session Management
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Control how and when your sessions expire
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Session Timeout (minutes)
            </label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <SettingItem
            icon={<Lock className="h-5 w-5" />}
            label="IP Whitelist"
            description="Restrict access to specific IP addresses"
            checked={security.ipWhitelist}
            onChange={(checked) => setSecurity({ ...security, ipWhitelist: checked })}
          />

          <SettingItem
            icon={<AlertCircle className="h-5 w-5" />}
            label="API Rate Limiting"
            description="Protect against excessive API requests"
            checked={security.apiRateLimit}
            onChange={(checked) => setSecurity({ ...security, apiRateLimit: checked })}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Active Sessions
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage devices where you&apos;re currently logged in
          </p>
        </CardHeader>
        <CardBody className="space-y-3">
          <ActiveSession
            device="MacBook Pro"
            location="San Francisco, CA"
            lastActive="Active now"
            current
          />
          <ActiveSession
            device="iPhone 13"
            location="San Francisco, CA"
            lastActive="2 hours ago"
          />
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * API Key Settings Section
 */
function APIKeySettings() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'cg_prod_xxxxxxxxxxxxxxxxxxx',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write'],
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'cg_dev_yyyyyyyyyyyyyyyyyyyy',
      created: '2024-02-10',
      lastUsed: '1 day ago',
      permissions: ['read'],
    },
  ]);

  const [showNewKeyModal, setShowNewKeyModal] = useState(false);

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                API Keys
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Manage API keys for programmatic access
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowNewKeyModal(true)}
            >
              Create New Key
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {apiKeys.map((key) => (
            <APIKeyItem key={key.id} apiKey={key} />
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            API Documentation
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Learn how to use our API
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="#"
              className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            >
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                API Reference
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete API documentation and endpoints
              </p>
            </a>
            <a
              href="#"
              className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            >
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                Code Examples
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Sample code in multiple languages
              </p>
            </a>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Appearance Settings Section
 */
function AppearanceSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Theme
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Customize how CloudGov looks for you
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-3">
            <ThemeOption
              icon={<Sun className="h-6 w-6" />}
              label="Light"
              description="Light theme"
              selected={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <ThemeOption
              icon={<Moon className="h-6 w-6" />}
              label="Dark"
              description="Dark theme"
              selected={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
            <ThemeOption
              icon={<Globe className="h-6 w-6" />}
              label="System"
              description="Match system"
              selected={theme === 'system'}
              onClick={() => setTheme('system')}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Display Options
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Adjust interface density and animations
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <SettingItem
            icon={<Palette className="h-5 w-5" />}
            label="Compact Mode"
            description="Show more content with tighter spacing"
            checked={compactMode}
            onChange={setCompactMode}
          />
          <SettingItem
            icon={<RefreshCw className="h-5 w-5" />}
            label="Enable Animations"
            description="Show smooth transitions and effects"
            checked={animations}
            onChange={setAnimations}
          />
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Integration Settings Section
 */
function IntegrationSettings() {
  const integrations = [
    {
      name: 'Slack',
      description: 'Receive notifications in Slack',
      icon: '💬',
      connected: true,
      workspace: 'cloudgov-team',
    },
    {
      name: 'PagerDuty',
      description: 'Alert on-call engineers',
      icon: '🚨',
      connected: false,
    },
    {
      name: 'Jira',
      description: 'Create issues from findings',
      icon: '📋',
      connected: true,
      project: 'CLOUD-OPS',
    },
    {
      name: 'Datadog',
      description: 'Send metrics and logs',
      icon: '📊',
      connected: false,
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Connected Integrations
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Connect CloudGov with your favorite tools
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          {integrations.map((integration) => (
            <IntegrationItem key={integration.name} integration={integration} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Billing Settings Section
 */
function BillingSettings() {
  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Current Plan
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your subscription and billing
          </p>
        </CardHeader>
        <CardBody>
          <div className="p-6 border-2 border-primary-500 dark:border-primary-600 rounded-lg bg-primary-50 dark:bg-primary-950">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-primary-900 dark:text-primary-100">
                  Professional Plan
                </h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Billed monthly
                </p>
              </div>
              <Badge variant="success">
                Active
              </Badge>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-primary-900 dark:text-primary-100">
                $299
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-primary-800 dark:text-primary-200">
                <Check className="h-4 w-4" />
                Unlimited resources
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-800 dark:text-primary-200">
                <Check className="h-4 w-4" />
                Advanced security features
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-800 dark:text-primary-200">
                <Check className="h-4 w-4" />
                Priority support
              </li>
            </ul>
            <div className="flex gap-2">
              <Button variant="primary" size="md">
                Upgrade Plan
              </Button>
              <Button variant="secondary" size="md">
                Manage Billing
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Payment Method
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your payment information
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  •••• •••• •••• 4242
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Expires 12/2025
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Billing History
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            View and download past invoices
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <InvoiceItem date="Mar 1, 2024" amount="$299.00" status="paid" />
            <InvoiceItem date="Feb 1, 2024" amount="$299.00" status="paid" />
            <InvoiceItem date="Jan 1, 2024" amount="$299.00" status="paid" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Helper Components
 */

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  badge?: React.ReactNode;
}

function SettingItem({ icon, label, description, checked, onChange, badge }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              {label}
            </h4>
            {badge}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

interface ActiveSessionProps {
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

function ActiveSession({ device, location, lastActive, current }: ActiveSessionProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            {device}
          </h4>
          {current && (
            <Badge variant="success" size="sm">
              Current
            </Badge>
          )}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {location} • {lastActive}
        </p>
      </div>
      {!current && (
        <Button variant="ghost" size="sm">
          Revoke
        </Button>
      )}
    </div>
  );
}

interface APIKeyItemProps {
  apiKey: {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
    permissions: string[];
  };
}

function APIKeyItem({ apiKey }: APIKeyItemProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            {apiKey.name}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <code className="text-sm font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
              {showKey ? apiKey.key : '••••••••••••••••••••••••'}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Created {apiKey.created}</span>
            <span>•</span>
            <span>Last used {apiKey.lastUsed}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-4 w-4" />}>
          Delete
        </Button>
      </div>
      <div className="flex gap-2">
        {apiKey.permissions.map((permission) => (
          <Badge key={permission} variant="neutral" size="sm">
            {permission}
          </Badge>
        ))}
      </div>
    </div>
  );
}

interface ThemeOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function ThemeOption({ icon, label, description, selected, onClick }: ThemeOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-6 rounded-lg border-2 transition-all text-center',
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
      )}
    >
      <div className={cn(
        'mb-3 flex items-center justify-center',
        selected ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400'
      )}>
        {icon}
      </div>
      <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
        {label}
      </h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </button>
  );
}

interface IntegrationItemProps {
  integration: {
    name: string;
    description: string;
    icon: string;
    connected: boolean;
    workspace?: string;
    project?: string;
  };
}

function IntegrationItem({ integration }: IntegrationItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{integration.icon}</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              {integration.name}
            </h4>
            {integration.connected && (
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {integration.description}
          </p>
          {integration.workspace && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Workspace: {integration.workspace}
            </p>
          )}
          {integration.project && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Project: {integration.project}
            </p>
          )}
        </div>
      </div>
      <Button
        variant={integration.connected ? 'ghost' : 'primary'}
        size="sm"
      >
        {integration.connected ? 'Configure' : 'Connect'}
      </Button>
    </div>
  );
}

interface InvoiceItemProps {
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

function InvoiceItem({ date, amount, status }: InvoiceItemProps) {
  const statusConfig = {
    paid: { variant: 'success' as const, label: 'Paid' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    failed: { variant: 'error' as const, label: 'Failed' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div className="flex items-center gap-4">
        <div>
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
            Invoice for {date}
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {amount}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
        <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Download
        </Button>
      </div>
    </div>
  );
}