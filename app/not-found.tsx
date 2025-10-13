/**
 * 404 Not Found Page
 *
 * Custom 404 error page with branding and navigation.
 * Shown when users navigate to non-existent routes.
 *
 * @route Any invalid route
 */

'use client';

import Link from 'next/link';
import { Home, Search, Cloud } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Animated 404 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Cloud className="h-96 w-96 text-primary-600 animate-float" />
          </div>
          <div className="relative">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse">
              404
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Development Notice */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 border-2 border-yellow-400 shadow-lg animate-pulse"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            🚧 Site In Development
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Home className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/resources">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Search className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              Browse Resources
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Need help? Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
            >
              Dashboard
            </Link>
            <Link
              href="/resources"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
            >
              Resources
            </Link>
            <Link
              href="/iam"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
            >
              IAM Security
            </Link>
            <Link
              href="/costs"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
            >
              Cost Analytics
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-neutral-500 dark:text-neutral-500 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>CloudGov Dashboard - Portfolio Project</p>
          <p className="mt-1">LLNL Demonstration - Junior Software Developer</p>
        </div>
      </div>
    </div>
  );
}
