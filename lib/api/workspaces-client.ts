/**
 * WorkSpaces API Client
 */

import { WorkSpace } from '@/lib/types/workspaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class WorkSpacesClient {
  async listWorkSpaces(params?: Record<string, string>): Promise<WorkSpace[]> {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/workspaces?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch WorkSpaces');
    const data = await response.json();
    return data.data.workspaces;
  }

  async createWorkSpace(params: any): Promise<WorkSpace> {
    const response = await fetch(`${API_BASE_URL}/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Failed to create WorkSpace');
    const data = await response.json();
    return data.data;
  }

  async startWorkSpaces(workspaceIds: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workspaces/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', workspaceIds }),
    });
    if (!response.ok) throw new Error('Failed to start WorkSpaces');
  }

  async stopWorkSpaces(workspaceIds: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workspaces/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stop', workspaceIds }),
    });
    if (!response.ok) throw new Error('Failed to stop WorkSpaces');
  }

  async rebootWorkSpace(workspaceId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/reboot`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reboot WorkSpace');
  }

  async deleteWorkSpace(workspaceId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete WorkSpace');
  }
}

export const workspacesClient = new WorkSpacesClient();
