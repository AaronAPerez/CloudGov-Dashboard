/**
 * Root Layout
 * 
 * Root layout component for the entire application.
 * Wraps all pages with common HTML structure and metadata.
 * 
 * Features:
 * - SEO optimization with metadata
 * - Font loading (Inter)
 * - Global styles
 * - Viewport configuration
 * - OpenGraph tags for social sharing
 * 
 * SEO Strategy:
 * - Target keywords: cloud governance, AWS monitoring, cost optimization
 * - Optimized for: "AWS resource management", "cloud cost tracking"
 * - Meta description under 160 characters
 * - Structured data ready
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/**
 * Font Configuration
 * Using Inter for optimal readability and modern appearance
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Viewport Configuration
 * Mobile-first responsive design
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

/**
 * Metadata Configuration
 * SEO optimized for cloud governance and AWS monitoring
 */
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: 'CloudGov Dashboard - AWS Resource Governance & Cost Optimization',
    template: '%s | CloudGov Dashboard',
  },
  description:
    'Enterprise cloud governance platform for AWS. Monitor resources, optimize costs, ensure security compliance, and get AI-powered recommendations. Real-time AWS infrastructure management.',

  // Keywords for search engines
  keywords: [
    'AWS monitoring',
    'cloud governance',
    'cost optimization',
    'resource management',
    'cloud security',
    'AWS dashboard',
    'infrastructure monitoring',
    'FinOps',
    'cloud compliance',
    'AWS cost tracking',
  ],

  // Author and creator
  authors: [{ name: 'CloudGov Team' }],
  creator: 'CloudGov Dashboard',

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // OpenGraph metadata (social sharing)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cloudgov-dashboard.com',
    siteName: 'CloudGov Dashboard',
    title: 'CloudGov Dashboard - AWS Resource Governance',
    description:
      'Monitor AWS resources, optimize costs, and improve security with AI-powered insights.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CloudGov Dashboard Preview',
      },
    ],
  },

  // Twitter card
  twitter: {
    card: 'summary_large_image',
    title: 'CloudGov Dashboard - AWS Resource Governance',
    description: 'Monitor, optimize, and secure your AWS infrastructure.',
    images: ['/twitter-image.png'],
    creator: '@cloudgov',
  },

  // Icons and theme
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/site.webmanifest',

  // Other
  category: 'technology',
};

/**
 * RootLayout Component
 * 
 * Main layout wrapper for the entire application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Skip to main content
        </a>

        {/* Main application content */}
        {children}
      </body>
    </html>
  );
}