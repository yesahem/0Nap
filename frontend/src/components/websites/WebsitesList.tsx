'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useJobStore } from '@/store/jobStore';
import { useAuthStore } from '@/store/authStore';
import { WebsiteCard } from './WebsiteCard';
import { Loader2, Globe, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Polling constants removed since auto-polling is disabled

// Removed intervalToMinutes helper since polling is disabled

export function WebsitesList() {
  const { jobs, isLoading, error, fetchJobs, clearJobs } = useJobStore();
  const { isAuthenticated } = useAuthStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Tab visibility state (used for throttled refresh on tab focus)
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  // All polling-related code removed since auto-polling is disabled

    // Polling functions removed since auto-polling is disabled

  // Removed updateActivity as polling is disabled

  const refreshData = useCallback(async (showRefreshState = false) => {
    if (!isAuthenticated) {
      clearJobs();
      return;
    }
    
    if (showRefreshState) setIsRefreshing(true);
    try {
      await fetchJobs();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      if (showRefreshState) setIsRefreshing(false);
    }
  }, [fetchJobs, isAuthenticated, clearJobs]);

  // Initial data load - only run once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadJobs = async () => {
      if (!isAuthenticated) {
        clearJobs();
        if (isMounted) setIsInitialLoad(false);
        return;
      }
      
      try {
        await fetchJobs();
        if (isMounted) setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        if (isMounted) setIsInitialLoad(false);
      }
    };

    // Only load on initial mount, not on every auth/function change
    if (isInitialLoad) {
      loadJobs();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]); // Removed fetchJobs and clearJobs dependencies

  // Tab visibility detection - with throttling to prevent excessive calls
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;
    
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (isVisible && isAuthenticated) {
        // Throttle API calls - only refresh if more than 30 seconds since last update
        const now = new Date();
        const timeSinceUpdate = lastUpdated ? now.getTime() - lastUpdated.getTime() : Infinity;
        
        if (timeSinceUpdate > 30000) { // 30 seconds throttle
          // Clear any existing throttle
          if (throttleTimeout) {
            clearTimeout(throttleTimeout);
          }
          
          // Throttle the refresh to avoid rapid-fire calls
          throttleTimeout = setTimeout(() => {
            refreshData(false);
          }, 1000); // 1 second delay
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [isAuthenticated, lastUpdated]); // Removed refreshData dependency

  // Removed user activity detection as polling is disabled

  // Manual refresh - directly call fetchJobs to avoid dependencies
  const handleManualRefresh = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsRefreshing(true);
    try {
      await fetchJobs();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchJobs, isAuthenticated]);

  // All auto-polling removed to prevent excessive API calls

  // Polling re-evaluation disabled since auto-polling is turned off
  // Data refreshes only on manual refresh or tab visibility change

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 10) {
      return 'Just updated';
    } else if (diffInSeconds < 60) {
      return `Updated ${diffInSeconds}s ago`;
    } else {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Updated ${minutes}m ago`;
    }
  };

  // Polling mode display removed since auto-polling is disabled

  if (isInitialLoad || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading websites...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load websites</p>
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            <Button 
              onClick={handleManualRefresh}
              variant="outline" 
              className="mt-4 cursor-pointer"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center max-w-md">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No websites monitored yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start monitoring your websites to prevent cold starts and ensure optimal performance.
          </p>
          <Link href="/dashboard">
            <Button className="inline-flex items-center cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Website
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

      return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {jobs.length} website{jobs.length === 1 ? '' : 's'} being monitored
            </p>
            <div className="flex items-center gap-3 text-xs">
              {lastUpdated && (
                <span className="text-gray-500 dark:text-gray-400">
                  {formatLastUpdated(lastUpdated)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Website
              </Button>
            </Link>
          </div>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <WebsiteCard job={job} />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 