/**
 * CostChart Component
 * 
 * Displays cost trends over time using interactive line charts.
 * Uses Recharts library for data visualization.
 * 
 * Features:
 * - Interactive line chart
 * - Responsive design
 * - Tooltip on hover
 * - Customizable time range
 * - Multiple data series support
 * - Loading state
 * - Empty state
 * 
 * Business Value:
 * - Visualize spending trends over time
 * - Identify cost spikes and anomalies
 * - Compare current vs previous period
 * - Support budget planning and forecasting
 * 
 * Real-world Use Cases:
 * - Monthly cost trends for last 12 months
 * - Daily spending in current month
 * - Service-level cost breakdown
 * - Budget vs actual spending comparison
 * 
 * @example
 * <CostChart
 *   data={costData}
 *   title="Monthly Spending Trend"
 *   isLoading={false}
 * />
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { CostDataPoint } from '@/lib/types';

/**
 * CostChart component props
 */
export interface CostChartProps {
  /** Chart data points */
  data: CostDataPoint[];
  /** Chart title */
  title?: string;
  /** Chart description */
  description?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Height in pixels */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Time range selector */
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '12m') => void;
}

/**
 * Time range options
 */
const timeRanges = [
  { value: '7d' as const, label: '7 Days' },
  { value: '30d' as const, label: '30 Days' },
  { value: '90d' as const, label: '90 Days' },
  { value: '12m' as const, label: '12 Months' },
];

/**
 * CostChart Component
 * 
 * Interactive line chart for cost visualization
 */
export function CostChart({
  data,
  title = 'Cost Trend',
  description = 'Daily spending over time',
  isLoading = false,
  height = 300,
  showLegend = false,
  onTimeRangeChange,
}: CostChartProps) {
  // Loading state
  if (isLoading) {
    return <CostChartSkeleton height={height} />;
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-300">{title}</h3>
          <p className="text-sm text-neutral-200">{description}</p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-neutral-300">No data available</p>
            <p className="mt-2 text-sm text-neutral-800 dark:text-neutral-400">
              Cost data will appear here once resources are monitored
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Title and description */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">{title}</h3>
            <p className="text-sm text-neutral-800 dark:text-neutral-400">{description}</p>
          </div>

          {/* Time range selector */}
          {onTimeRangeChange && (
            <div className="flex gap-1">
              {timeRanges.map(range => (
                <Button
                  key={range.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTimeRangeChange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {/* Chart container */}
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />

            {/* X Axis - Date */}
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis - Cost */}
            <YAxis
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `$${(value / 1000).toFixed(0)}k`}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Legend */}
            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
            )}

            {/* Line - Main cost data */}
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
              name="Cost"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary stats below chart */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-4">
          <StatItem
            label="Average"
            value={formatCurrency(
              data.reduce((sum, d) => sum + d.cost, 0) / data.length
            )}
          />
          <StatItem
            label="Highest"
            value={formatCurrency(Math.max(...data.map(d => d.cost)))}
          />
          <StatItem
            label="Lowest"
            value={formatCurrency(Math.min(...data.map(d => d.cost)))}
          />
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * CustomTooltip Component
 *
 * Custom tooltip for the chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CostDataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-600 p-3 shadow-lg">
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-300">{data.date}</p>
      <p className="mt-1 text-lg font-bold text-primary-400">
        {formatCurrency(data.cost)}
      </p>
      {data.service && (
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-400">Service: {data.service}</p>
      )}
    </div>
  );
}

/**
 * StatItem Component
 * 
 * Individual stat display below chart
 */
interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-md md:text-lg font-bold text-neutral-800 dark:text-neutral-300 ">{value}</p>
    </div>
  );
}

/**
 * CostChartSkeleton Component
 * 
 * Loading skeleton for CostChart
 */
export function CostChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-neutral-200" />
      </CardHeader>
      <CardBody>
        <div
          className="animate-pulse rounded bg-neutral-200"
          style={{ height: `${height}px` }}
        />
      </CardBody>
    </Card>
  );
}

/**
 * MultiLineChart Component
 * 
 * Extended version that supports multiple data series
 * Useful for comparing different services or time periods
 * 
 * @example
 * <MultiLineChart
 *   data={costData}
 *   lines={[
 *     { dataKey: 'ec2', color: '#2563eb', name: 'EC2' },
 *     { dataKey: 's3', color: '#16a34a', name: 'S3' },
 *   ]}
 * />
 */
export interface MultiLineChartProps {
  data: Record<string, string | number>[];
  lines: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  title?: string;
  description?: string;
  height?: number;
}

export function MultiLineChart({
  data,
  lines,
  title = 'Cost Breakdown',
  description = 'Service-level spending',
  height = 300,
}: MultiLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">{title}</h3>
        <p className="text-sm text-neutral-800 dark:text-neutral-400">{description}</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
            {lines.map(line => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={{ fill: line.color, r: 3 }}
                activeDot={{ r: 5 }}
                name={line.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}