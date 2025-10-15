import React from 'react'
import { Badge } from '../ui/Badge';


/**
 * SecurityFindingItem Component
 * Individual security finding display
 */
interface SecurityFindingItemProps {
  finding: {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  };
}

function SecurityFindingItem({ finding }: SecurityFindingItemProps) {
  const severityVariant = finding.severity === 'critical' || finding.severity === 'high' ? 'error' : 'warning';

  return (
    <div className="rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-900">{finding.title}</h4>
          <p className="mt-1 text-xs text-neutral-600">{finding.description}</p>
        </div>
        <Badge variant={severityVariant} size="sm">
          {finding.severity}
        </Badge>
      </div>
    </div>
  );
}

export default SecurityFindingItem