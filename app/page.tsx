/**
 * Dashboard Page
 * 
 * Main dashboard view displaying key metrics, cost trends,
 * and recent resources. Entry point for the application.
 * 
 * Features:
 * - Key metrics overview (costs, resources, alerts)
 * - Cost trend visualization
 * - Recent resources table
 * - AI recommendations preview
 * - Real-time data updates (mocked for now)
 * 
 * Business Value:
 * - At-a-glance view of cloud infrastructure health
 * - Quick identification of cost and security issues
 * - Immediate access to critical information
 * 
 * LLNL Job Requirements Demonstrated:
 * ✓ Modern programming (TypeScript, React)
 * ✓ Frontend development (Next.js, Tailwind)
 * ✓ Data visualization (Recharts)
 * ✓ Responsive design (mobile-first)
 * ✓ Accessibility (WCAG 2.1 AA)
 * 
 * @route /
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Server,
  DollarSign,
  Shield,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  MetricsCard,
  MetricsGrid,
  MetricsCardSkeleton,
} from '@/components/dashboard/MetricsCard';
import { CostChart } from '@/components/dashboard/CostChart';
import { ResourceTable } from '@/components/dashboard/ResourceTable';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import type { AWSResource, CostDataPoint } from '@/lib/types';

/**
 * Mock data for demonstration
 * In production, this would come from API endpoints
 */

// Generate mock cost data for the last 30 days
const generateMockCostData = (): CostDataPoint[] => {
  const data: CostDataPoint[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cost: Math.floor(Math.random() * 5000) + 8000, // Random between 8k-13k
    });
  }

  return data;
};

// Generate mock resource data
const generateMockResources = (): AWSResource[] => {
  const types = ['EC2', 'S3', 'Lambda', 'RDS', 'DynamoDB'] as const;
  const statuses = ['running', 'stopped', 'pending'] as const;
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1'] as const;
  const owners = ['Alice Chen', 'Bob Smith', 'Carol Johnson', 'David Lee'];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `res-${Math.random().toString(36).substr(2, 9)}`,
    name: `${types[i % types.length]}-instance-${i + 1}`,
    type: types[i % types.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    monthlyCost: Math.floor(Math.random() * 1000) + 100,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    owner: owners[Math.floor(Math.random() * owners.length)],
    tags: {
      Environment: i % 2 === 0 ? 'Production' : 'Development',
      Project: `Project-${String.fromCharCode(65 + (i % 3))}`,
    },
  }));
};

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  // State for data
  const [isLoading, setIsLoading] = useState(true);
  const [costData, setCostData] = useState<CostDataPoint[]>([]);
  const [resources, setResources] = useState<AWSResource[]>([]);

  /**
   * Simulate data loading
   * In production, this would be actual API calls
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Load mock data
      setCostData(generateMockCostData());
      setResources(generateMockResources());

      setIsLoading(false);
    };

    loadData();
  }, []);

  /**
   * Handle resource click
   */
  const handleResourceClick = (resource: AWSResource) => {
    console.log('View resource details:', resource);
    // TODO: Navigate to resource details page
  };

  return (
    <DashboardLayout activeRoute="/">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Real-time monitoring of your AWS infrastructure
        </p>
      </div>

      {/* Key Metrics Grid */}
      <section className="mb-8" aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Key Metrics
        </h2>

        {isLoading ? (
          <MetricsGrid>
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
          </MetricsGrid>
        ) : (
          <MetricsGrid>
            {/* Monthly Cost */}
            <MetricsCard
              title="Monthly Cost"
              value="$12,450"
              change={8.5}
              trend="up"
              icon={<DollarSign className="h-6 w-6" />}
              iconVariant="primary"
              description="vs last month"
            />

            {/* Total Resources */}
            <MetricsCard
              title="Total Resources"
              value={847}
              change={3.2}
              trend="up"
              icon={<Server className="h-6 w-6" />}
              iconVariant="success"
              description="active resources"
            />

            {/* Security Findings */}
            <MetricsCard
              title="Security Findings"
              value={12}
              change={-15.3}
              trend="down"
              icon={<Shield className="h-6 w-6" />}
              iconVariant="error"
              description="open findings"
            />

            {/* AI Recommendations */}
            <MetricsCard
              title="AI Recommendations"
              value={23}
              change={12.5}
              trend="up"
              icon={<Sparkles className="h-6 w-6" />}
              iconVariant="warning"
              description="optimization tips"
            />
          </MetricsGrid>
        )}
      </section>

      {/* Cost Trend Chart */}
      <section className="mb-8" aria-labelledby="cost-trend-heading">
        <h2 id="cost-trend-heading" className="sr-only">
          Cost Trend
        </h2>

        <CostChart
          data={costData}
          title="30-Day Cost Trend"
          description="Daily spending for the last 30 days"
          isLoading={isLoading}
          height={320}
          onTimeRangeChange={range => {
            console.log('Time range changed:', range);
            // TODO: Fetch data for selected range
          }}
        />
      </section>

      {/* Two-column layout for tables and insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Resources - 2/3 width */}
        <section className="lg:col-span-2" aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="sr-only">
            Recent Resources
          </h2>

          <ResourceTable
            resources={resources}
            isLoading={isLoading}
            onResourceClick={handleResourceClick}
            showActions
          />
        </section>

        {/* AI Recommendations - 1/3 width */}
        <section aria-labelledby="recommendations-heading">
          <h2 id="recommendations-heading" className="sr-only">
            AI Recommendations
          </h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-warning-600" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  AI Insights
                </h3>
              </div>
              <p className="text-sm text-neutral-600">
                Smart optimization recommendations
              </p>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {/* Recommendation 1 */}
                <RecommendationItem
                  title="Stop Idle EC2 Instances"
                  description="7 EC2 instances have been idle for 72+ hours"
                  savings={1245}
                  priority="high"
                />

                {/* Recommendation 2 */}
                <RecommendationItem
                  title="Enable S3 Intelligent Tiering"
                  description="3 S3 buckets could benefit from automated tiering"
                  savings={890}
                  priority="medium"
                />

                {/* Recommendation 3 */}
                <RecommendationItem
                  title="Update IAM Policies"
                  description="5 roles have overly permissive access"
                  priority="high"
                  isSecurityIssue
                />

                {/* View all button */}
                <Button variant="ghost" fullWidth className="mt-4">
                  View All Recommendations →
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Cost Alerts Card */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-error-600" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Active Alerts
                </h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <AlertItem
                  title="Budget Threshold"
                  description="Monthly spending at 85% of budget"
                  variant="warning"
                />
                <AlertItem
                  title="Security Finding"
                  description="Critical IAM misconfiguration detected"
                  variant="error"
                />
                <AlertItem
                  title="Resource Limit"
                  description="Approaching EC2 instance limit in us-east-1"
                  variant="info"
                />
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}

/**
 * RecommendationItem Component
 * Individual AI recommendation display
 */
interface RecommendationItemProps {
  title: string;
  description: string;
  savings?: number;
  priority: 'high' | 'medium' | 'low';
  isSecurityIssue?: boolean;
}

function RecommendationItem({
  title,
  description,
  savings,
  priority,
  isSecurityIssue = false,
}: RecommendationItemProps) {
  const priorityVariant = priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'info';

  return (
    <div className="rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-900">{title}</h4>
          <p className="mt-1 text-xs text-neutral-600">{description}</p>
          {savings && (
            <p className="mt-2 text-sm font-semibold text-success-700">
              Save ${savings}/month
            </p>
          )}
        </div>
        <Badge variant={isSecurityIssue ? 'error' : priorityVariant} size="sm">
          {priority}
        </Badge>
      </div>
    </div>
  );
}

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