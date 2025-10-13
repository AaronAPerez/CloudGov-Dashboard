import { renderHook, waitFor } from '@testing-library/react';
import { useResources } from '@/hooks/useResources';
import { SWRConfig } from 'swr';

// Mock fetch
global.fetch = jest.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    {children}
  
);

describe('useResources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch resources successfully', async () => {
    const mockData = {
      success: true,
      data: [
        {
          id: 'test-1',
          name: 'Test Resource',
          type: 'EC2',
          status: 'running',
          region: 'us-east-1',
          monthlyCost: 100,
          createdAt: new Date(),
          lastAccessed: new Date(),
          owner: 'Test User',
          tags: {},
        },
      ],
      metadata: { total: 1, offset: 0, limit: 10, count: 1 },
      timestamp: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useResources(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.resources).toHaveLength(1);
    expect(result.current.resources[0].name).toBe('Test Resource');
  });

  it('should handle errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useResources(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('should filter by type', async () => {
    const { result } = renderHook(
      () => useResources({ type: 'EC2' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify API was called with correct params
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('type=EC2')
    );
  });
});