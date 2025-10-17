/**
 * AWS Connection Status Component
 *
 * Displays AWS connection health and demo mode status
 * Shows recruiters that AWS SDK is properly configured
 *
 * Features:
 * - Real-time AWS credential validation
 * - Service-by-service connection status
 * - Professional demo mode indicator
 * - Expandable details for technical demonstration
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface ServiceStatus {
  name: string;
  connected: boolean;
  hasData: boolean;
  error?: string;
  latency?: number;
}

interface ConnectionStatusProps {
  showDetails?: boolean;
}

export default function AWSConnectionStatus({ showDetails = true }: ConnectionStatusProps) {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkAWSConnections();
  }, []);

  const checkAWSConnections = async () => {
    setLoading(true);

    try {
      // Check connection to our API which validates AWS credentials
      const response = await fetch('/api/aws/connection-status');
      const data = await response.json();

      setServices(data.services || []);
    } catch (error) {
      console.error('Connection check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (service: ServiceStatus) => {
    if (!service.connected) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    if (!service.hasData) {
      return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  };

  const getStatusText = (service: ServiceStatus) => {
    if (!service.connected) return 'Connection Failed';
    if (!service.hasData) return 'Connected (No Data)';
    return 'Connected';
  };

  const connectedCount = services.filter(s => s.connected).length;
  const totalServices = services.length;
  const hasAnyData = services.some(s => s.hasData);

  // Determine connection health status
  const getHealthStatus = () => {
    if (connectedCount === 0) return 'critical';
    if (connectedCount === totalServices) return 'healthy';
    return 'partial';
  };

  const healthStatus = getHealthStatus();

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-neutral-300 dark:border-neutral-700 border-t-primary-600 dark:border-t-primary-400" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Checking AWS connections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
      healthStatus === 'healthy'
        ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-green-300 dark:border-green-700'
        : healthStatus === 'partial'
        ? 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950/30 dark:via-sky-950/30 dark:to-cyan-950/30 border-blue-300 dark:border-blue-700'
        : 'bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border-red-300 dark:border-red-800'
    }`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>

      {/* Floating gradient orbs */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 md:h-40 md:w-40 rounded-full blur-3xl animate-float ${
        healthStatus === 'healthy'
          ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20'
          : healthStatus === 'partial'
          ? 'bg-gradient-to-br from-blue-400/20 to-sky-400/20'
          : 'bg-gradient-to-br from-red-400/20 to-orange-400/20'
      }`} />
      <div className={`absolute -bottom-10 -left-10 h-32 w-32 md:h-40 md:w-40 rounded-full blur-3xl animate-float ${
        healthStatus === 'healthy'
          ? 'bg-gradient-to-br from-emerald-400/20 to-teal-400/20'
          : healthStatus === 'partial'
          ? 'bg-gradient-to-br from-sky-400/20 to-cyan-400/20'
          : 'bg-gradient-to-br from-amber-400/20 to-yellow-400/20'
      }`} style={{ animationDelay: '1s' }} />

      {/* Main Status Header */}
      <div className="relative p-4 md:p-5">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                healthStatus === 'healthy'
                  ? 'bg-green-600 dark:bg-green-700'
                  : healthStatus === 'partial'
                  ? 'bg-blue-600 dark:bg-blue-700'
                  : 'bg-red-600 dark:bg-red-700'
              }`}>
                {healthStatus === 'healthy' ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : healthStatus === 'partial' ? (
                  <Info className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
                <div className={`absolute -inset-1 rounded-xl blur-md animate-pulse-soft ${
                  healthStatus === 'healthy'
                    ? 'bg-green-500/40 dark:bg-green-400/40'
                    : healthStatus === 'partial'
                    ? 'bg-blue-500/40 dark:bg-blue-400/40'
                    : 'bg-red-500/40 dark:bg-red-400/40'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base md:text-lg font-bold ${
                  healthStatus === 'healthy'
                    ? 'text-green-900 dark:text-green-100'
                    : healthStatus === 'partial'
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  AWS SDK Connection Status ({connectedCount}/{totalServices})
                </h3>
                <p className={`text-xs mt-0.5 font-semibold ${
                  healthStatus === 'healthy'
                    ? 'text-green-700 dark:text-green-300'
                    : healthStatus === 'partial'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {healthStatus === 'healthy'
                    ? 'All services connected successfully'
                    : healthStatus === 'partial'
                    ? `${connectedCount} of ${totalServices} services connected`
                    : 'No services connected'}
                </p>
              </div>
            </div>

            {!isExpanded && connectedCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {services.slice(0, 5).map((service) => (
                  <div
                    key={service.name}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium border ${
                      service.connected && service.hasData
                        ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
                        : service.connected
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}
                  >
                    {service.connected && service.hasData ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : service.connected ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {service.name}
                  </div>
                ))}
              </div>
            )}

            {connectedCount > 0 && !hasAnyData && isExpanded && (
              <div className="flex items-start gap-2.5 p-3 md:p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200 dark:border-amber-800 rounded-lg mt-3">
                <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm flex-1 min-w-0">
                  <p className="text-amber-900 dark:text-amber-100 font-semibold mb-1">
                    Demo Mode Active
                  </p>
                  <p className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                    AWS credentials are valid, but no resources found in account.
                    <span className="font-semibold"> Displaying enterprise-scale sample data</span> to
                    demonstrate full application capabilities.
                  </p>
                </div>
              </div>
            )}

            {connectedCount > 0 && hasAnyData && (
              <div className="flex items-center gap-2 p-3 md:p-4 bg-gradient-to-br from-green-300 to-green-50/50 dark:from-green-800 dark:to-green-950/10 border border-success-200 dark:border-success-800 rounded-lg mt-3">
                <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
                <p className="text-sm text-success-700 dark:text-success-300 font-medium">
                  All AWS services connected successfully. Displaying live data.
                </p>
              </div>
            )}

            {connectedCount === 0 && (
              <div className="flex items-center gap-2 p-3 md:p-4 bg-gradient-to-br from-error-50 to-red-50/50 dark:from-error-950/20 dark:to-red-950/10 border border-error-200 dark:border-error-800 rounded-lg mt-3">
                <XCircle className="w-4 h-4 text-error-600 dark:text-error-400 flex-shrink-0" />
                <p className="text-sm text-error-700 dark:text-error-300 font-medium">
                  Some AWS services could not be reached. Check credentials and permissions.
                </p>
              </div>
            )}
          </div>

          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 px-4 py-2 text-xs font-semibold text-primary-700 dark:text-primary-400 bg-gray-300 dark:bg-gray-600 hover:bg-primary-200 dark:hover:bg-primary-900 rounded-lg transition-all duration-200 border border-primary-200 dark:border-primary-800 shadow-sm hover:shadow"
            >
              {isExpanded ? 'Hide' : 'Show'} Details
            </button>
          )}
        </div>
      </div>

      {/* Detailed Service Status */}
      {isExpanded && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20">
          <div className="p-4 md:p-5">
            <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary-500 rounded-full" />
              Service Connection Details
            </h4>
            <div className="space-y-2.5">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  className="relative flex items-center justify-between p-3 md:p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all duration-200 animate-scale-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Colored glow background based on status */}
                  <div className={`absolute inset-0 opacity-10 blur-xl ${
                    service.connected && service.hasData
                      ? 'bg-green-500 animate-pulse'
                      : service.connected
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`} />

                  <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(service)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {service.name}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        {getStatusText(service)}
                        {service.latency && ` • ${service.latency}ms`}
                      </p>
                    </div>
                  </div>

                  {service.hasData && (
                    <span className="relative z-10 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-success-100 dark:bg-success-950 text-success-800 dark:text-success-300 rounded-lg font-semibold border border-success-200 dark:border-success-800 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                      Live Data
                    </span>
                  )}

                  {service.connected && !service.hasData && (
                    <span className="relative z-10 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-lg font-semibold border border-amber-200 dark:border-amber-800 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Demo Mode
                    </span>
                  )}

                  {!service.connected && service.error && (
                    <span className="relative z-10 text-xs text-error-600 dark:text-error-400 font-medium text-right break-words">
                      {service.error}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Technical Info for Recruiters */}
            <div className="mt-4 p-3 md:p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/20 dark:to-blue-950/10 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-xs text-primary-900 dark:text-primary-100 leading-relaxed">
                <strong className="font-bold">For Technical Review:</strong> The AWS SDK is properly configured
                with IAM credentials. This application can seamlessly switch between demo
                data (for portfolio demonstration) and live AWS resources (in production).
                The connection layer validates credentials on load and implements automatic
                fallback strategies.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
