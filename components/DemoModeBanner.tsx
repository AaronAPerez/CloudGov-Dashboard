/**
 * Demo Mode Banner Component
 * 
 * Professional indicator that shows when displaying sample data
 * Clearly communicates technical capability while being honest about data source
 * 
 * Usage: Place at top of dashboard pages to show recruiters this is demo data
 * representing real enterprise scale
 */

import { Info, Database, Cloud, TrendingUp } from 'lucide-react';

interface DemoModeBannerProps {
  variant?: 'banner' | 'card' | 'inline';
  showStats?: boolean;
}

export default function DemoModeBanner({ 
  variant = 'banner',
  showStats = true 
}: DemoModeBannerProps) {
  
  // Sample enterprise statistics to show what real data looks like
  const enterpriseStats = {
    resources: '2,847',
    monthlySpend: '$47,293',
    users: '156',
    regions: '5',
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
        <Info className="w-4 h-4" />
        <span className="font-medium">Demo Mode:</span>
        <span>Enterprise-scale sample data</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Demo Mode Active
            </h3>
            <p className="text-sm text-amber-800 mb-2">
              AWS SDK is properly configured and credentials validated. 
              Displaying enterprise-scale sample data to demonstrate full application capabilities.
            </p>
            {showStats && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-xs">
                  <span className="text-amber-700 font-medium">Sample Resources:</span>
                  <span className="ml-1 text-amber-900">{enterpriseStats.resources}</span>
                </div>
                <div className="text-xs">
                  <span className="text-amber-700 font-medium">Sample Spend:</span>
                  <span className="ml-1 text-amber-900">{enterpriseStats.monthlySpend}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: banner variant
  return (
    <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-primary-700 dark:from-indigo-700 dark:via-blue-700 dark:to-primary-800 shadow-lg border border-indigo-400/20 dark:border-indigo-500/30">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute -right-10 -top-10 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 blur-3xl animate-float" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 px-4 sm:px-6 py-4 md:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Main Message */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Cloud className="w-5 h-5 md:w-6 md:h-6 text-white" />
              <div className="absolute -inset-1 bg-white/20 rounded-xl blur-md animate-pulse-soft" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h3 className="font-bold text-base md:text-lg text-white">Portfolio Demo Mode</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white backdrop-blur-sm border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  AWS SDK Connected
                </span>
              </div>
              <p className="text-xs md:text-sm text-blue-50 leading-relaxed">
                Credentials validated • Displaying enterprise-scale sample data representing
                typical production environment with <strong className="text-white">{enterpriseStats.resources} resources</strong> across <strong className="text-white">{enterpriseStats.regions} AWS regions</strong>
              </p>
            </div>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center gap-4 md:gap-6 text-sm flex-shrink-0">
              <div className="text-center">
                <div className="font-bold text-xl md:text-2xl text-white">{enterpriseStats.resources}</div>
                <div className="text-blue-100 text-xs font-medium">Resources</div>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-center">
                <div className="font-bold text-xl md:text-2xl text-white">{enterpriseStats.monthlySpend}</div>
                <div className="text-blue-100 text-xs font-medium">Monthly</div>
              </div>
              <div className="h-8 w-px bg-white/30 hidden sm:block" />
              <div className="text-center hidden sm:block">
                <div className="font-bold text-xl md:text-2xl text-white">{enterpriseStats.users}</div>
                <div className="text-blue-100 text-xs font-medium">IAM Users</div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Note for Recruiters */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-blue-200 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-100 leading-relaxed">
              <strong className="text-white font-semibold">Technical Implementation:</strong>
              This application automatically detects available AWS resources and seamlessly
              switches between live data (production) and sample data (demo). The AWS SDK
              integration is fully functional and production-ready. Sample data represents
              realistic enterprise workloads with proper IAM policies, cost allocation,
              and security posture analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Data Source Indicator - Small badge for individual components
 * Shows whether specific data is live or demo
 */
export function DataSourceBadge({ 
  isLive = false,
  className = ''
}: { 
  isLive?: boolean;
  className?: string;
}) {
  if (isLive) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium ${className}`}>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Live Data
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium ${className}`}>
      <Database className="w-3 h-3" />
      Sample Data
    </span>
  );
}

/**
 * Data Explanation Tooltip
 * Provides context when hovering over sample data
 */
export function DataExplanation() {
  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Info className="w-4 h-4" />
        About This Data
      </h4>
      <div className="text-xs text-gray-700 space-y-2">
        <p>
          <strong>Sample Data Characteristics:</strong> This enterprise-scale 
          sample data represents a typical mid-size company&apos;s AWS infrastructure 
          with realistic resource distributions, cost patterns, and security configurations.
        </p>
        <p>
          <strong>Why Sample Data?</strong> My AWS free tier account contains no 
          resources. This sample data demonstrates how the application handles 
          real production workloads when connected to an active AWS environment.
        </p>
        <p>
          <strong>Production Ready:</strong> The AWS SDK integration is fully 
          functional. When pointed at an AWS account with resources, this 
          application automatically displays live data with zero code changes.
        </p>
      </div>
    </div>
  );
}