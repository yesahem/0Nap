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
  clearJobs: () => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const backendUrls = await urlsApi.getUrls();
      
      // Debug logging to check backend data format
      if (backendUrls.length > 0) {
        console.log('🔍 Backend URL sample:', {
          createdAt: backendUrls[0].createdAt,
          interval: backendUrls[0].interval,
          type_createdAt: typeof backendUrls[0].createdAt,
          type_interval: typeof backendUrls[0].interval,
          isNaN_interval: isNaN(Number(backendUrls[0].interval)),
          converted_interval: minutesToInterval(backendUrls[0].interval),
        });
      }
      
      // Transform backend URLs to frontend Job format
      const jobs: Job[] = backendUrls.map((backendUrl: BackendUrl) => {
        // Safely parse dates with validation
        const parseDate = (dateString: string | undefined): Date => {
          if (!dateString) return new Date();
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? new Date() : date;
        };

        return {
          id: backendUrl.id,
          url: backendUrl.url,
          interval: minutesToInterval(backendUrl.interval),
          status: (backendUrl.isActive !== false) ? 'active' : 'paused', // Default to active
          createdAt: parseDate(backendUrl.createdAt),
          updatedAt: parseDate(backendUrl.updatedAt),
          // Backend doesn't provide lastPingedAt timestamp, so we use updatedAt as approximation
          // if pingCount > 0 (meaning it has been pinged), otherwise undefined
          lastPing: backendUrl.pingCount > 0 ? parseDate(backendUrl.updatedAt) : undefined,
          nextPing: undefined, // Backend doesn't provide this yet
          pingCount: backendUrl.pingCount,
        };
      });
      
      set({ jobs, isLoading: false });
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch jobs';
      if (error && typeof error === 'object') {
        const err = error as { response?: { data?: { error?: string } }; message?: string };
        errorMessage = err.response?.data?.error || err.message || 'Failed to fetch jobs';
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addJob: async (url: string, interval: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const intervalMinutes = intervalToMinutes(interval);
      const backendUrl = await urlsApi.addUrl({
        url,
        interval: intervalMinutes,
      });
      
      // Transform and add to frontend jobs
      const parseDate = (dateString: string | undefined): Date => {
        if (!dateString) return new Date();
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
      };

      const newJob: Job = {
        id: backendUrl.id,
        url: backendUrl.url,
        interval: minutesToInterval(backendUrl.interval),
        status: (backendUrl.isActive !== false) ? 'active' : 'paused',
        createdAt: parseDate(backendUrl.createdAt),
        updatedAt: parseDate(backendUrl.updatedAt),
        lastPing: backendUrl.lastPingedAt ? parseDate(backendUrl.lastPingedAt) : undefined,
        nextPing: undefined,
        pingCount: backendUrl.pingCount,
      };
      
      set(state => ({
        jobs: [...state.jobs, newJob],
        isLoading: false,
      }));
    } catch (error: unknown) {
      let errorMessage = 'Failed to add job';
      if (error && typeof error === 'object') {
        const err = error as { response?: { data?: { error?: string } }; message?: string };
        errorMessage = err.response?.data?.error || err.message || 'Failed to add job';
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteJob: async (jobId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await urlsApi.deleteUrl(jobId);
      
      // Remove job from state
      set(state => ({
        jobs: state.jobs.filter(j => j.id !== jobId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      let errorMessage = 'Failed to delete job';
      if (error && typeof error === 'object') {
        const err = error as { response?: { data?: { error?: string } }; message?: string };
        errorMessage = err.response?.data?.error || err.message || 'Failed to delete job';
      }
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

  clearJobs: () => {
    set({ jobs: [], error: null });
  },
})); 