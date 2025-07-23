'use client';

import { create } from 'zustand';
import { Job, JobStats, intervalToMinutes, minutesToInterval } from '@/types/job';
import { urlsApi, BackendUrl } from '@/services/api';

interface JobStore {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchJobs: () => Promise<void>;
  addJob: (url: string, interval: string) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  getJobStats: () => JobStats;
  clearError: () => void;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token');
};

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ error: 'No authentication token found' });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const backendUrls = await urlsApi.getUrls(token);
      
      // Transform backend URLs to frontend Job format
      const jobs: Job[] = backendUrls.map((backendUrl: BackendUrl) => ({
        id: backendUrl.id,
        url: backendUrl.url,
        interval: minutesToInterval(backendUrl.interval),
        status: (backendUrl.isActive !== false) ? 'active' : 'paused', // Default to active
        createdAt: new Date(backendUrl.createdAt),
        updatedAt: new Date(backendUrl.updatedAt),
        // Backend doesn't provide lastPingedAt timestamp, so we use updatedAt as approximation
        // if pingCount > 0 (meaning it has been pinged), otherwise undefined
        lastPing: backendUrl.pingCount > 0 ? new Date(backendUrl.updatedAt) : undefined,
        nextPing: undefined, // Backend doesn't provide this yet
        pingCount: backendUrl.pingCount,
      }));
      
      set({ jobs, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = (error && typeof error === 'object' && 'response' in error) 
        ? ((error as Record<string, any>).response?.data?.message || (error as Record<string, any>).message) 
        : 'Failed to fetch jobs';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addJob: async (url: string, interval: string) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: 'No authentication token found' });
      throw new Error('No authentication token found');
    }

    set({ isLoading: true, error: null });
    
    try {
      const intervalMinutes = intervalToMinutes(interval);
      const backendUrl = await urlsApi.addUrl(token, {
        url,
        interval: intervalMinutes,
      });
      
      // Transform and add to frontend jobs
      const newJob: Job = {
        id: backendUrl.id,
        url: backendUrl.url,
        interval: minutesToInterval(backendUrl.interval),
        status: (backendUrl.isActive !== false) ? 'active' : 'paused',
        createdAt: new Date(backendUrl.createdAt),
        updatedAt: new Date(backendUrl.updatedAt),
        lastPing: backendUrl.lastPingedAt ? new Date(backendUrl.lastPingedAt) : undefined,
        nextPing: undefined,
        pingCount: backendUrl.pingCount,
      };
      
      set(state => ({
        jobs: [...state.jobs, newJob],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = (error && typeof error === 'object' && 'response' in error) 
        ? ((error as Record<string, any>).response?.data?.message || (error as Record<string, any>).message) 
        : 'Failed to add job';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteJob: async (jobId: string) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: 'No authentication token found' });
      throw new Error('No authentication token found');
    }

    set({ isLoading: true, error: null });
    
    try {
      await urlsApi.deleteUrl(token, jobId);
      
      // Remove job from state
      set(state => ({
        jobs: state.jobs.filter(j => j.id !== jobId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = (error && typeof error === 'object' && 'response' in error) 
        ? ((error as Record<string, any>).response?.data?.message || (error as Record<string, any>).message) 
        : 'Failed to delete job';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getJobStats: (): JobStats => {
    const jobs = get().jobs;
    return {
      total: jobs.length,
      active: jobs.filter(job => job.status === 'active').length,
      paused: jobs.filter(job => job.status === 'paused').length,
    };
  },

  clearError: () => {
    set({ error: null });
  },
})); 