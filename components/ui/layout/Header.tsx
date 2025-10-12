/**
 * Header Component
 * 
 * Main navigation header for the dashboard application.
 * Features responsive design, user menu, and notifications.
 * 
 * Features:
 * - Logo and branding
 * - Search functionality
 * - Notification bell
 * - User profile dropdown
 * - Mobile menu toggle
 * - Sticky positioning
 * - WCAG 2.1 AA compliant
 * 
 * Business Value:
 * - Quick access to search across AWS resources
 * - Real-time notifications for alerts and warnings
 * - User account management
 * 
 * @example
 * <Header onMenuToggle={handleMenuToggle} />
 */

import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  Settings, 
  LogOut,
  Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';

/**
 * Header component props
 */
export interface HeaderProps {
  /** Callback when mobile menu is toggled */
  onMenuToggle?: () => void;
  /** Current user name */
  userName?: string;
  /** Number of unread notifications */
  notificationCount?: number;
}

/**
 * Header Component
 * 
 * Top navigation bar with search, notifications, and user menu
 */
export function Header({
  onMenuToggle,
  userName = 'Admin User',
  notificationCount = 3,
}: HeaderProps) {
  // State for dropdowns
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white shadow-sm"
      role="banner"
    >
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo and branding */}
        <div className="flex items-center gap-2">
          <Cloud className="h-8 w-8 text-primary-600" aria-hidden="true" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-neutral-900">
              CloudGov Dashboard
            </h1>
            <p className="text-xs text-neutral-600">
              AWS Resource Governance
            </p>
          </div>
        </div>

        {/* Search bar (desktop) */}
        <div className="hidden flex-1 md:flex md:justify-center">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search resources..."
              className={cn(
                'w-full rounded-lg border border-neutral-300 bg-white',
                'py-2 pl-10 pr-4 text-sm',
                'placeholder:text-neutral-400',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
              aria-label="Search AWS resources"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search button (mobile) */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label={`Notifications, ${notificationCount} unread`}
              aria-expanded={isNotificationsOpen}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-600 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div
                className={cn(
                  'absolute right-0 mt-2 w-80 rounded-lg border border-neutral-200',
                  'bg-gray-100 shadow-lg animate-slide-down'
                )}
                role="menu"
              >
                <div className="border-b border-neutral-200 px-4 py-3">
                  <h3 className="font-semibold text-neutral-900">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Sample notifications */}
                  <NotificationItem
                    title="High Cost Alert"
                    message="EC2 spending exceeded threshold"
                    time="5 min ago"
                    variant="warning"
                  />
                  <NotificationItem
                    title="Security Finding"
                    message="IAM role with excessive permissions detected"
                    time="1 hour ago"
                    variant="error"
                  />
                  <NotificationItem
                    title="Resource Created"
                    message="New S3 bucket created in us-west-2"
                    time="2 hours ago"
                    variant="info"
                  />
                </div>
                <div className="border-t border-neutral-200 p-2">
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="gap-2"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <User className="h-5 w-5 text-primary-700" />
              </div>
              <span className="hidden text-sm font-medium md:block">
                {userName}
              </span>
            </Button>

            {/* User dropdown menu */}
            {isUserMenuOpen && (
              <div
                className={cn(
                  'absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200',
                  'bg-white shadow-lg animate-slide-down'
                )}
                role="menu"
              >
                <div className="border-b border-neutral-200 px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {userName}
                  </p>
                  <p className="text-xs text-neutral-600">
                    admin@cloudgov.local
                  </p>
                </div>
                <div className="p-2">
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2',
                      'text-sm text-neutral-700 hover:bg-neutral-100',
                      'transition-colors'
                    )}
                    role="menuitem"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </button>
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2',
                      'text-sm text-neutral-700 hover:bg-neutral-100',
                      'transition-colors'
                    )}
                    role="menuitem"
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-neutral-200 p-2">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2',
                      'text-sm text-error-700 hover:bg-error-50',
                      'transition-colors'
                    )}
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * NotificationItem Component
 * Individual notification in the dropdown
 */
interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  variant: 'info' | 'warning' | 'error';
}

function NotificationItem({
  title,
  message,
  time,
  variant,
}: NotificationItemProps) {
  return (
    <button
      className={cn(
        'flex w-full gap-3 border-b border-neutral-100 px-4 py-3',
        'text-left hover:bg-neutral-50 transition-colors'
      )}
      role="menuitem"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-600 mt-0.5">{message}</p>
        <p className="text-xs text-neutral-500 mt-1">{time}</p>
      </div>
      <Badge variant={variant} size="sm" withDot />
    </button>
  );
}