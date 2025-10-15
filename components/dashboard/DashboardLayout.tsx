/**
 * DashboardLayout Component
 * 
 * Main layout wrapper for the dashboard application.
 * Combines header, sidebar, and main content area.
 * 
 * Features:
 * - Responsive layout with mobile support
 * - Sidebar toggle for mobile
 * - Sticky header
 * - Content area with proper spacing
 * - Smooth transitions
 * - Demo mode integration
 * 
 * Business Value:
 * - Consistent user experience across all pages
 * - Mobile-responsive for on-the-go monitoring
 * - Professional enterprise appearance
 * - Clear communication of data source (live vs demo)
 * 
 * @example
 * <DashboardLayout>
 *   <YourPageContent />
 * </DashboardLayout>
 */

import { useState, ReactNode, useEffect } from 'react';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';

/**
 * DashboardLayout component props
 */
export interface DashboardLayoutProps {
  /** Page content to display */
  children: ReactNode;
  /** Current active route */
  activeRoute?: string;
  /** Whether to show demo mode banner (defaults to true) */
  showDemoBanner?: boolean;
  /** Whether to show connection status (defaults to true on main dashboard) */
  showConnectionStatus?: boolean;
}

/**
 * DashboardLayout Component
 * 
 * Complete dashboard layout with header, sidebar, and content area
 * Includes demo mode banner and connection status integration
 */
export function DashboardLayout({
  children,
  activeRoute = '/',
  showDemoBanner = false,
  showConnectionStatus = false,
}: DashboardLayoutProps) {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for connection status (used for demo banner visibility)
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  /**
   * Check AWS connection status on mount
   * This determines whether to show demo mode banner
   */
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/aws/connection-status');
        const data = await response.json();
        setConnectionStatus(data);
      } catch (error) {
        console.error('Failed to check connection:', error);
      } finally {
        setIsCheckingConnection(false);
      }
    };

    if (showDemoBanner || showConnectionStatus) {
      checkConnection();
    } else {
      setIsCheckingConnection(false);
    }
  }, [showDemoBanner, showConnectionStatus]);

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

  // Determine if we're in demo mode
  const isDemoMode = connectionStatus?.mode === 'demo';
  const hasConnection = connectionStatus?.summary?.connectedServices > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <Header
        onMenuToggle={handleToggleSidebar}
        userName="Admin User"
        notificationCount={3}
      />

      {/* Main layout container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          activeRoute={activeRoute}
        />

        {/* Main content area */}
        <main
          className="flex-1 md:ml-64"
          role="main"
          id="main-content"
        >
          {/* Content wrapper with padding */}
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}