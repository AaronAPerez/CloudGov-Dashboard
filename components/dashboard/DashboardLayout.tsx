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
 * 
 * Business Value:
 * - Consistent user experience across all pages
 * - Mobile-responsive for on-the-go monitoring
 * - Professional enterprise appearance
 * 
 * @example
 * <DashboardLayout>
 *   <YourPageContent />
 * </DashboardLayout>
 */

import { useState, ReactNode } from 'react';
import { Header } from '../ui/layout/Header';
import { Sidebar } from '../ui/layout/Sidebar';

/**
 * DashboardLayout component props
 */
export interface DashboardLayoutProps {
  /** Page content to display */
  children: ReactNode;
  /** Current active route */
  activeRoute?: string;
}

/**
 * DashboardLayout Component
 * 
 * Complete dashboard layout with header, sidebar, and content area
 */
export function DashboardLayout({
  children,
  activeRoute = '/',
}: DashboardLayoutProps) {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-neutral-50">
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
    </div>
  );
}