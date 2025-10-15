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

  const allConnected = services.every(s => s.connected);
  const hasAnyData = services.some(s => s.hasData);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
          <span className="text-sm">Checking AWS connections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Main Status Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {allConnected ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h3 className="font-semibold text-gray-900">
                AWS SDK Connection Status
              </h3>
            </div>
            
            {allConnected && !hasAnyData && (
              <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-900 font-medium mb-1">
                    Demo Mode Active
                  </p>
                  <p className="text-amber-800">
                    AWS credentials are valid, but no resources found in account. 
                    <span className="font-semibold"> Displaying enterprise-scale sample data</span> to 
                    demonstrate full application capabilities.
                  </p>
                </div>
              </div>
            )}

            {allConnected && hasAnyData && (
              <p className="text-sm text-green-700 mt-1">
                All AWS services connected successfully. Displaying live data.
              </p>
            )}

            {!allConnected && (
              <p className="text-sm text-red-700 mt-1">
                Some AWS services could not be reached. Check credentials and permissions.
              </p>
            )}
          </div>

          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-4 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
            >
              {isExpanded ? 'Hide' : 'Show'} Details
            </button>
          )}
        </div>
      </div>

      {/* Detailed Service Status */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Service Connection Details
            </h4>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getStatusText(service)}
                        {service.latency && ` • ${service.latency}ms`}
                      </p>
                    </div>
                  </div>
                  
                  {service.hasData && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      Live Data
                    </span>
                  )}
                  
                  {service.connected && !service.hasData && (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                      Demo Mode
                    </span>
                  )}
                  
                  {!service.connected && service.error && (
                    <span className="text-xs text-red-600">
                      {service.error}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Technical Info for Recruiters */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>For Technical Review:</strong> The AWS SDK is properly configured 
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