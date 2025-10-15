/**
 * WorkSpaces Type Definitions
 */

export type WorkSpaceStatus = 
  | 'PENDING'
  | 'AVAILABLE' 
  | 'STOPPED'
  | 'UNHEALTHY'
  | 'ERROR';

export interface WorkSpace {
  workspaceId: string;
  userName: string;
  directoryId: string;
  bundleId: string;
  computeTypeName: string;
  userVolumeEncryptionEnabled: boolean;
  rootVolumeEncryptionEnabled: boolean;
  ipAddress: string;
  state: WorkSpaceStatus;
  subnetId: string;
  runningMode: 'AUTO_STOP' | 'ALWAYS_ON';
  runningModeAutoStopTimeoutInMinutes?: number;
  lastKnownUserConnectionTimestamp?: Date;
  connectionState?: 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN';
  tags: Record<string, string>;
  monthlyCost: number;
  createdAt: Date;
}

export interface WorkSpaceBundle {
  bundleId: string;
  name: string;
  description: string;
  computeType: string;
}

export interface WorkSpaceDirectory {
  directoryId: string;
  directoryName: string;
  directoryType: string;
}
