import { GET } from '@/app/api/resources/route';
import { NextRequest } from 'next/server';

describe('GET /api/resources', () => {
  it('should return resources', async () => {
    const request = new NextRequest('http://localhost/api/resources');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should filter by type', async () => {
    const request = new NextRequest('http://localhost/api/resources?type=EC2');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.every((r: any) => r.type === 'EC2')).toBe(true);
  });

  it('should validate query parameters', async () => {
    const request = new NextRequest('http://localhost/api/resources?type=INVALID');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should support pagination', async () => {
    const request = new NextRequest('http://localhost/api/resources?limit=5');
    const response = await GET(request);
    const data = await response.json();

    expect(data.data.length).toBeLessThanOrEqual(5);
    expect(data.metadata.limit).toBe(5);
  });
});