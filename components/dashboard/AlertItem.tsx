import React from 'react'
import { Badge } from '../ui/Badge';

/**
 * AlertItem Component
 * Individual alert display
 */
interface AlertItemProps {
  title: string;
  description: string;
  variant: 'error' | 'warning' | 'info';
}

function AlertItem({ title, description, variant }: AlertItemProps) {
  return (
    <div className="flex items-start gap-3">
      <Badge variant={variant} size="sm" withDot />
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-600">{description}</p>
      </div>
    </div>
  );
}


export default AlertItem