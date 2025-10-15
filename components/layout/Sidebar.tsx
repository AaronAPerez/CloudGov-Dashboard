/**
 * Sidebar Component
 * 
 * Navigation sidebar for the dashboard application.
 * Features collapsible menu, active states, and responsive behavior.
 * 
 * Features:
 * - Main navigation links
 * - Active route highlighting
 * - Icon support for visual clarity
 * - Collapsible on mobile
 * - Badge indicators for counts
 * - Smooth transitions
 * - Keyboard accessible
 * 
 * Business Value:
 * - Quick navigation between dashboard sections
 * - Visual indicators for data counts (resources, alerts, etc.)
 * - Intuitive information architecture
 * 
 * @example
 * <Sidebar isOpen={isSidebarOpen} onClose={handleClose} />
 */

import Link from 'next/link';
import {
  LayoutDashboard,
  Server,
  DollarSign,
  Shield,
  Sparkles,
  Settings,
  FileText,
  AlertCircle,
  Brain,
  Key,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';

/**
 * Sidebar component props
 */
export interface SidebarProps {
  /** Controls sidebar visibility (mobile) */
  isOpen?: boolean;
  /** Callback when sidebar should close (mobile) */
  onClose?: () => void;
  /** Current active route */
  activeRoute?: string;
}

/**
 * Navigation item interface
 */
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: {
    count: number;
    variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  };
  description?: string;
}

/**
 * Navigation menu items
 * Organized by dashboard sections
 */
const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    description: 'Overview and key metrics',
  },
  {
    id: 'workspaces',
    label: 'WorkSpaces',
    icon: Monitor,
    href: '/workspaces',
    description: 'Overview and key metrics',
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: Server,
    href: '/resources',
    badge: {
      count: 847,
      variant: 'info',
    },
    description: 'AWS resource inventory',
  },
  {
    id: 'iam',
    label: 'IAM Security',
    icon: Key,
    href: '/iam',
    badge: {
      count: 3,
      variant: 'warning',
    },
    description: 'Roles, users, and permissions',
  },
  // {
  //   id: 'ai-usage',
  //   label: 'AI Usage',
  //   icon: Brain,
  //   href: '/ai-usage',
  //   description: 'AI API tracking and analytics',
  // },
  {
    id: 'costs',
    label: 'Cost Analytics',
    icon: DollarSign,
    href: '/costs',
    description: 'Spending trends and forecasts',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    href: '/security',
    badge: {
      count: 12,
      variant: 'error',
    },
    description: 'Compliance and findings',
  },
  // {
  //   id: 'ai-assistant',
  //   label: 'AI Assistant',
  //   icon: Sparkles,
  //   href: '/ai-assistant',
  //   description: 'Intelligent recommendations',
  // },
];

/**
 * Bottom navigation items (settings, etc.)
 */
const bottomNavItems: NavItem[] = [
  // {
  //   id: 'docs',
  //   label: 'Documentation',
  //   icon: FileText,
  //   href: '/docs',
  //   description: 'Guides and API reference',
  // },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Application preferences',
  },
];

/**
 * Sidebar Component
 * 
 * Main navigation sidebar with collapsible behavior
 */
export function Sidebar({
  isOpen = true,
  onClose,
  activeRoute = '/',
}: SidebarProps) {
  /**
   * Handle navigation item click
   */
  const handleNavClick = () => {
    // Close mobile sidebar after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64',
          'border-r border-neutral-200 dark:text-gray-200',
          'transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Main navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeRoute === item.href}
                  onClick={handleNavClick}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-neutral-200" />

            {/* Bottom navigation */}
            <div className="space-y-1">
              {bottomNavItems.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeRoute === item.href}
                  onClick={handleNavClick}
                />
              ))}
            </div>
          </nav>

          {/* Footer info */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
            {/* In Development Banner */}
            <div className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 p-3 border-2 border-yellow-400 shadow-xl animate-pulse">
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 items-center justify-center">
                  <span className="text-lg">🚧</span>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white uppercase tracking-wide">
                    IN DEVELOPMENT
                  </p>
                  <p className="mt-1 text-xs text-white/90 font-semibold">
                    Features actively being built
                  </p>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="rounded-lg bg-primary-50 dark:bg-primary-950/30 p-3 border border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-700 dark:text-primary-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-medium text-primary-900 dark:text-primary-100">
                    Portfolio Project
                  </p>
                  <p className="mt-1 text-xs text-primary-700 dark:text-primary-300">
                    LLNL Demo - Junior Software Developer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * NavItem Component
 * Individual navigation item with icon, label, and badge
 */
interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}



function NavItem({ item, isActive, onClick }: NavItemComponentProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2',
        'text-sm font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        // Active state
        isActive
          ? 'bg-primary-100 text-primary-900 dark:bg-primary-950 dark:text-primary-100'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
      )}
      aria-current={isActive ? 'page' : undefined}
      title={item.description}
    >
      {/* Icon */}
      <Icon
        className={cn(
          'h-5 w-5 flex-shrink-0 transition-colors',
          isActive
            ? 'text-primary-700 dark:text-primary-400'
            : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200'
        )}
        aria-hidden="true"
      />

      {/* Label */}
      <span className="flex-1 text-left">{item.label}</span>

      {/* Badge (if present) */}
      {item.badge && (
        <Badge variant={item.badge.variant} size="sm">
          {item.badge.count}
        </Badge>
      )}
    </Link>
  );
}