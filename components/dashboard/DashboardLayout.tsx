/**
 * DashboardLayout Component
 * 
 * Main layout wrapper with responsive sidebar and header.
 * Includes proper Next.js App Router navigation.
 * 
 * Features:
 * ✅ Responsive layout (mobile, tablet, desktop)
 * ✅ Sidebar with App Router links
 * ✅ Mobile menu toggle
 * ✅ Sticky header
 * ✅ Active route highlighting
 * ✅ Smooth transitions
 * ✅ Dark mode support
 * 
 * @example
 * <DashboardLayout activeRoute="/dashboard">
 *   <YourPageContent />
 * </DashboardLayout>
 */

'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Shield,
  DollarSign,
  Settings,
  Users,
  Database,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Bell,
  Search,
  User,
  Cloud,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';

/**
 * Navigation item type
 */
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  disabled?: boolean;
}

/**
 * Navigation configuration
 */
const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Resources', 
    href: '/resources', 
    icon: Server 
  },
  { 
    name: 'IAM Security', 
    href: '/iam', 
    icon: Shield,
    badge: 12 
  },
  { 
    name: 'Cost Analytics', 
    href: '/costs', 
    icon: DollarSign 
  },
  { 
    name: 'AI Usage', 
    href: '/ai-usage', 
    icon: Database 
  },
  { 
    name: 'WorkSpaces', 
    href: '/workspaces', 
    icon: Users 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings 
  },
];

/**
 * DashboardLayout component props
 */
export interface DashboardLayoutProps {
  /** Page content to display */
  children: ReactNode;
  /** Current active route (optional, will auto-detect from pathname) */
  activeRoute?: string;
}

/**
 * DashboardLayout Component
 * 
 * Complete dashboard layout with header, sidebar, and content area
 */
export function DashboardLayout({
  children,
  activeRoute,
}: DashboardLayoutProps) {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Get current pathname for active link highlighting
  const pathname = usePathname();
  const currentPath = activeRoute || pathname;

  /**
   * Toggle sidebar (mobile only)
   */
  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  /**
   * Close sidebar (mobile only)
   */
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header
        onMenuToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main layout container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          currentPath={currentPath}
        />

        {/* Main content area */}
        <main
          className="flex-1 w-full md:ml-64 transition-all duration-300"
          role="main"
          id="main-content"
        >
          {/* Content wrapper with responsive padding */}
          <div className="p-4 sm:p-5 md:p-6 max-w-[1920px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-45 bg-black/50 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Header Component
 */
interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const [notificationCount] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:gap-4 md:px-6 lg:px-8">
        {/* Left section - Mobile menu button, logo, and IN DEVELOPMENT badge */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            ) : (
              <Menu className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            )}
          </button>

          {/* Logo and title (always visible) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <Cloud className="h-10 w-10" />
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg whitespace-nowrap">
              CloudGov
            </span>
          </div>

          {/* IN DEVELOPMENT Badge (desktop only) */}
          <div className="hidden md:flex items-center">
            <Badge
              variant="error"
              size="sm"
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-extrabold border-2 border-yellow-400 shadow-lg animate-pulse px-3 py-1 text-xs uppercase tracking-wider"
            >
              🚧 IN DEVELOPMENT 🚧
            </Badge>
          </div>
        </div>

        {/* Center section - Search bar */}
        <div className="hidden md:flex flex-1 justify-start max-w-md lg:max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-primary-500 dark:focus:border-primary-400 rounded-lg outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right section - Notifications and user menu */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex-shrink-0 shadow-md">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                  Admin User
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  admin@cloudgov.dev
                </p>
              </div>
              <ChevronDown className="hidden md:block h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg animate-slide-down z-50">
                <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Admin User
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    admin@cloudgov.dev
                  </p>
                </div>
                <div className="p-2">
                  <button
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 p-2">
                  <button
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
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
 * Sidebar Component
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

function Sidebar({ isOpen, onClose, currentPath }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-transform duration-300 ease-in-out",
          "hidden md:block md:translate-x-0"
        )}
      >
        <SidebarContent currentPath={currentPath} onLinkClick={onClose} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-transform duration-300 ease-in-out",
          "md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent currentPath={currentPath} onLinkClick={onClose} />
      </aside>
    </>
  );
}

/**
 * Sidebar Content Component
 */
interface SidebarContentProps {
  currentPath: string;
  onLinkClick: () => void;
}

function SidebarContent({ currentPath, onLinkClick }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
          <Cloud className="h-16 w-16" />
        </div>
        <div>
          <h1 className="font-bold text-neutral-900 dark:text-neutral-100">
            CloudGov
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            AWS Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath === item.href || 
                           (item.href !== '/' && currentPath.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={item.disabled}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                  )}
                />
                <span className="flex-1 truncate">{item.name}</span>
                
                {/* Badge */}
                {item.badge && (
                  <Badge
                    variant="error"
                    size="sm"
                    className="min-w-[1.25rem] h-5 flex items-center justify-center px-1.5"
                  >
                    {item.badge}
                  </Badge>
                )}

                {/* Active indicator */}
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />

        {/* Additional Links */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Quick Links
            </p>
          </div>
          <Link
            href="/documentation"
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
              📚
            </span>
            <span>Documentation</span>
          </Link>
          <Link
            href="/support"
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
              💬
            </span>
            <span>Support</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
        {/* IN DEVELOPMENT Banner */}
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-orange-600 p-3 border-2 border-yellow-400 shadow-xl animate-pulse">
          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 items-center justify-center flex-shrink-0">
              <span className="text-lg">🚧</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-white uppercase tracking-wide">
                IN DEVELOPMENT
              </p>
              <p className="mt-0.5 text-xs text-white/90 font-semibold">
                Features actively being built
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Project Info */}
        <div className="rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/30 dark:to-secondary-950/30 p-3 border border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
              <span className="text-sm">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary-900 dark:text-primary-100">
                Portfolio Project
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-300 mt-0.5">
                Demo mode active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}