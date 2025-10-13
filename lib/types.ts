/**
 * TypeScript Type Definitions
 * 
 * Centralized type definitions for the entire application.
 * Ensures type safety and provides clear contracts for components.
 */

import { ReactNode } from 'react';

/**
 * Base component props that all components should extend
 */
export interface BaseProps {
  /** Additional CSS classes */
  className?: string;
  /** Unique identifier for the component */
  id?: string;
  /** Child elements */
  children?: ReactNode;
}

/**
 * Button component variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Button component sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Badge component variants for status indication
 */
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Input field types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

/**
 * AWS Resource Types
 */
export type AWSResourceType =
  | 'EC2'
  | 'S3'
  | 'Lambda'
  | 'DynamoDB'
  | 'RDS'
  | 'ECS'
  | 'EKS'
  | 'CloudFront'
  | 'API Gateway'
  | 'WorkSpaces';

/**
 * AWS Resource Status
 */
export type ResourceStatus =
  | 'running'
  | 'stopped'
  | 'terminated'
  | 'pending'
  | 'error';

/**
 * AWS Resource Interface
 */
export interface AWSResource {
  /** Unique resource identifier */
  id: string;
  /** Resource name/tag */
  name: string;
  /** Type of AWS resource */
  type: AWSResourceType;
  /** Current status */
  status: ResourceStatus;
  /** AWS region */
  region: string;
  /** Monthly cost in USD */
  monthlyCost: number;
  /** Creation timestamp */
  createdAt: Date;
  /** Last accessed timestamp */
  lastAccessed: Date;
  /** Resource owner/creator */
  owner: string;
  /** Associated tags */
  tags: Record<string, string>;
}

/**
 * Cost Analytics Data Point
 */
export interface CostDataPoint {
  /** Date of the data point */
  date: string;
  /** Cost amount in USD */
  cost: number;
  /** Optional service breakdown */
  service?: string;
}

/**
 * Cost Analytics Summary
 */
export interface CostSummary {
  /** Current month total */
  currentMonth: number;
  /** Previous month total */
  previousMonth: number;
  /** Percentage change */
  percentageChange: number;
  /** Projected end of month */
  projected: number;
  /** Historical data points */
  history: CostDataPoint[];
}

/**
 * Security Compliance Finding
 */
export interface SecurityFinding {
  /** Unique finding ID */
  id: string;
  /** Finding title */
  title: string;
  /** Detailed description */
  description: string;
  /** Severity level */
  severity: 'critical' | 'high' | 'medium' | 'low';
  /** Affected resource ID */
  resourceId: string;
  /** Resource type */
  resourceType: AWSResourceType;
  /** When the finding was detected */
  detectedAt: Date;
  /** Current status */
  status: 'open' | 'in-progress' | 'resolved' | 'dismissed';
  /** Recommended remediation */
  remediation: string;
}

/**
 * IAM Role Information
 */
export interface IAMRole {
  /** Role ARN */
  arn: string;
  /** Role name */
  name: string;
  /** Role description */
  description: string;
  /** Creation date */
  createdAt: Date;
  /** Last used date */
  lastUsed?: Date;
  /** Attached policies */
  policies: IAMPolicy[];
  /** Inline policies */
  inlinePolicies: IAMPolicy[];
  /** Is overly permissive */
  isOverlyPermissive: boolean;
  /** Trust relationships */
  trustedEntities: string[];
  /** Permissions boundary */
  permissionsBoundary?: string;
  /** Tags */
  tags: Record<string, string>;
  /** Risk score (0-100) */
  riskScore: number;
}

/**
 * IAM Policy Information
 */
export interface IAMPolicy {
  /** Policy ARN or name */
  id: string;
  /** Policy name */
  name: string;
  /** Policy type */
  type: 'AWS Managed' | 'Customer Managed' | 'Inline';
  /** Policy document */
  document: IAMPolicyDocument;
  /** Attached roles count */
  attachedRolesCount: number;
  /** Is high risk */
  isHighRisk: boolean;
}

/**
 * IAM Policy Document
 */
export interface IAMPolicyDocument {
  Version: string;
  Statement: IAMPolicyStatement[];
}

/**
 * IAM Policy Statement
 */
export interface IAMPolicyStatement {
  Effect: 'Allow' | 'Deny';
  Action: string | string[];
  Resource: string | string[];
  Condition?: Record<string, unknown>;
}

/**
 * IAM User with Role Assignments
 */
export interface IAMUser {
  /** User ID */
  id: string;
  /** Username */
  username: string;
  /** User ARN */
  arn: string;
  /** Email */
  email: string;
  /** Assigned roles */
  roles: string[];
  /** Direct permissions */
  permissions: string[];
  /** MFA enabled */
  mfaEnabled: boolean;
  /** Last activity */
  lastActivity: Date;
  /** Access level */
  accessLevel: 'read-only' | 'power-user' | 'admin';
  /** Risk score */
  riskScore: number;
}

/**
 * AI API Usage Log Entry
 */
export interface AIUsageLog {
  /** Log entry ID */
  id: string;
  /** Timestamp */
  timestamp: Date;
  /** User who made the request */
  userId: string;
  /** Username */
  username: string;
  /** AI provider */
  provider: 'OpenAI' | 'AWS Bedrock' | 'Anthropic' | 'Google AI';
  /** Model used */
  model: string;
  /** API endpoint */
  endpoint: string;
  /** Request type */
  requestType: 'completion' | 'embedding' | 'image' | 'audio' | 'fine-tuning';
  /** Tokens used */
  tokensUsed: number;
  /** Cost in USD */
  cost: number;
  /** Response time in ms */
  responseTime: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Request metadata */
  metadata?: Record<string, unknown>;
}

/**
 * AI Usage Summary
 */
export interface AIUsageSummary {
  /** Total requests */
  totalRequests: number;
  /** Total tokens used */
  totalTokens: number;
  /** Total cost */
  totalCost: number;
  /** Average response time */
  avgResponseTime: number;
  /** Success rate */
  successRate: number;
  /** Usage by provider */
  byProvider: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
  /** Usage by user */
  byUser: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
  /** Daily usage trend */
  dailyTrend: {
    date: string;
    requests: number;
    tokens: number;
    cost: number;
  }[];
}

/**
 * WorkSpaces Instance
 */
export interface WorkSpace {
  /** WorkSpace ID */
  id: string;
  /** WorkSpace name */
  name: string;
  /** Directory ID */
  directoryId: string;
  /** Username */
  username: string;
  /** Bundle ID */
  bundleId: string;
  /** Bundle name */
  bundleName: string;
  /** State */
  state: 'PENDING' | 'AVAILABLE' | 'IMPAIRED' | 'UNHEALTHY' | 'REBOOTING' | 'STARTING' | 'REBUILDING' | 'RESTORING' | 'MAINTENANCE' | 'ADMIN_MAINTENANCE' | 'TERMINATING' | 'TERMINATED' | 'SUSPENDED' | 'UPDATING' | 'STOPPING' | 'STOPPED' | 'ERROR';
  /** Running mode */
  runningMode: 'AUTO_STOP' | 'ALWAYS_ON';
  /** IP address */
  ipAddress?: string;
  /** Subnet ID */
  subnetId: string;
  /** Monthly cost */
  monthlyCost: number;
  /** Last connected */
  lastConnection?: Date;
  /** Compute type */
  computeType: string;
  /** Root volume size GB */
  rootVolumeSize: number;
  /** User volume size GB */
  userVolumeSize: number;
}

/**
 * AI Recommendation
 */
export interface AIRecommendation {
  /** Unique recommendation ID */
  id: string;
  /** Recommendation type */
  type: 'cost' | 'security' | 'performance' | 'compliance';
  /** Title */
  title: string;
  /** Detailed description */
  description: string;
  /** Estimated monthly savings (for cost recommendations) */
  estimatedSavings?: number;
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Affected resources */
  affectedResources: string[];
  /** Implementation steps */
  steps: string[];
  /** Confidence score (0-1) */
  confidence: number;
}

/**
 * Dashboard Metrics Card Data
 */
export interface MetricCard {
  /** Metric title */
  title: string;
  /** Current value */
  value: string | number;
  /** Change from previous period */
  change?: number;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Icon name */
  icon?: string;
  /** Description or subtitle */
  description?: string;
}

/**
 * User Interface
 */
export interface User {
  /** User ID */
  id: string;
  /** Email address */
  email: string;
  /** Full name */
  name: string;
  /** User role */
  role: 'admin' | 'user' | 'viewer';
  /** Avatar URL */
  avatar?: string;
  /** Department */
  department?: string;
}

/**
 * API Response wrapper
 */
export interface APIResponse<T> {
  /** Response data */
  data: T;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Response timestamp */
  timestamp: Date;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Current page number (1-indexed) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Filter parameters for resource queries
 */
export interface FilterParams {
  /** Resource type filter */
  type?: AWSResourceType;
  /** Status filter */
  status?: ResourceStatus;
  /** Region filter */
  region?: string;
  /** Owner filter */
  owner?: string;
  /** Tag filters */
  tags?: Record<string, string>;
  /** Date range filter */
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Chart data point (generic)
 */
export interface ChartDataPoint {
  /** X-axis label */
  label: string;
  /** Y-axis value */
  value: number;
  /** Optional additional data */
  [key: string]: string | number;
}

/**
 * Form validation error
 */
export interface ValidationError {
  /** Field name */
  field: string;
  /** Error message */
  message: string;
}

/**
 * Loading state
 */
export interface LoadingState {
  /** Is currently loading */
  isLoading: boolean;
  /** Error if failed */
  error?: string;
}