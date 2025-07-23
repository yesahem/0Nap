'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useJobStore } from '@/store/jobStore';
import { WebsiteCard } from './WebsiteCard';
import { Loader2, Globe, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Base Smart Polling Configuration (will be scaled based on user's shortest ping interval)
const BASE_POLLING_INTERVALS = {
  ACTIVE: 5 * 60 * 1000,        // 5 minutes when user is actively using the app
  BACKGROUND: 7 * 60 * 1000,    // 7 minutes when tab is in background
  IDLE: 10 * 60 * 1000,         // 10 minutes when user is idle (no activity for 5+ minutes)
  INACTIVE: 20 * 60 * 1000,     // 20 minutes when completely inactive (no activity for 15+ minutes)
} as const;

const USER_ACTIVITY_TIMEOUT = 2 * 60 * 1000;  // 2 minutes
const INACTIVE_TIMEOUT = 5 * 60 * 1000;      // 5 minutes

// Helper function to convert interval string to minutes
const intervalToMinutes = (interval: string): number => {
  const value = parseInt(interval);
  if (interval.includes('minute') || interval.includes('min')) return value;
  if (interval.includes('hour') || interval.includes('hr')) return value * 60;
  if (interval.includes('day')) return value * 24 * 60;
  return value; // fallback
};

export function WebsitesList() {
  const { jobs, isLoading, error, fetchJobs } = useJobStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Smart polling state
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [currentInterval, setCurrentInterval] = useState<number>(BASE_POLLING_INTERVALS.ACTIVE);
  const [adaptiveIntervals, setAdaptiveIntervals] = useState<{
    ACTIVE: number;
    BACKGROUND: number;
    IDLE: number;
    INACTIVE: number;
  }>({
    ACTIVE: BASE_POLLING_INTERVALS.ACTIVE,
    BACKGROUND: BASE_POLLING_INTERVALS.BACKGROUND,
    IDLE: BASE_POLLING_INTERVALS.IDLE,
    INACTIVE: BASE_POLLING_INTERVALS.INACTIVE,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<Date>(new Date());

  // Calculate adaptive polling intervals based on user's shortest ping interval
  const calculateAdaptiveIntervals = useCallback(() => {
    if (jobs.length === 0) return {
      ACTIVE: BASE_POLLING_INTERVALS.ACTIVE,
      BACKGROUND: BASE_POLLING_INTERVALS.BACKGROUND,
      IDLE: BASE_POLLING_INTERVALS.IDLE,
      INACTIVE: BASE_POLLING_INTERVALS.INACTIVE,
    };

    // Find the shortest ping interval among all user's sites
    const shortestIntervalMinutes = Math.min(
      ...jobs.map(job => intervalToMinutes(job.interval))
    );

    console.log(`📊 Shortest user ping interval: ${shortestIntervalMinutes} minutes`);

    // Calculate scaling factor based on shortest interval
    let scaleFactor = 1;
    
    if (shortestIntervalMinutes >= 1440) { // 1 day or more
      scaleFactor = 120; // Very slow polling (40m, 2h, 4h, 10h)
    } else if (shortestIntervalMinutes >= 720) { // 12 hours
      scaleFactor = 60;  // Slow polling (20m, 1h, 2h, 5h)
    } else if (shortestIntervalMinutes >= 360) { // 6 hours
      scaleFactor = 30;  // Moderate polling (10m, 30m, 1h, 2.5h)
    } else if (shortestIntervalMinutes >= 60) { // 1 hour
      scaleFactor = 10;  // Slightly slower (3.3m, 10m, 20m, 50m)
    } else if (shortestIntervalMinutes >= 30) { // 30 minutes
      scaleFactor = 5;   // Moderately slower (1.7m, 5m, 10m, 25m)
    } else if (shortestIntervalMinutes >= 10) { // 10 minutes
      scaleFactor = 2;   // Slightly slower (40s, 2m, 4m, 10m)
    } else {
      scaleFactor = 1;   // Keep base intervals (20s, 1m, 2m, 5m)
    }

    const adaptiveIntervals = {
      ACTIVE: Math.max(BASE_POLLING_INTERVALS.ACTIVE * scaleFactor, 10000), // Min 10s
      BACKGROUND: Math.max(BASE_POLLING_INTERVALS.BACKGROUND * scaleFactor, 30000), // Min 30s
      IDLE: Math.max(BASE_POLLING_INTERVALS.IDLE * scaleFactor, 60000), // Min 1m
      INACTIVE: Math.max(BASE_POLLING_INTERVALS.INACTIVE * scaleFactor, 120000), // Min 2m
    };

    console.log(`⚡ Adaptive intervals (scale: ${scaleFactor}x):`, {
      ACTIVE: `${adaptiveIntervals.ACTIVE / 1000}s`,
      BACKGROUND: `${adaptiveIntervals.BACKGROUND / 1000}s`,
      IDLE: `${adaptiveIntervals.IDLE / 1000}s`,
      INACTIVE: `${adaptiveIntervals.INACTIVE / 1000}s`,
    });

    return adaptiveIntervals;
  }, [jobs]);

  // Update adaptive intervals when jobs change
  useEffect(() => {
    const newIntervals = calculateAdaptiveIntervals();
    setAdaptiveIntervals(newIntervals);
  }, [calculateAdaptiveIntervals]);

  // Determine optimal polling interval based on current conditions
  const getOptimalPollingInterval = useCallback(() => {
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime();
    
    // If tab is hidden, use background interval
    if (!isTabVisible) {
      return adaptiveIntervals.BACKGROUND;
    }
    
    // Based on user activity recency
    if (timeSinceActivity < USER_ACTIVITY_TIMEOUT) {
      return adaptiveIntervals.ACTIVE;
    } else if (timeSinceActivity < INACTIVE_TIMEOUT) {
      return adaptiveIntervals.IDLE;
    } else {
      return adaptiveIntervals.INACTIVE;
    }
      }, [isTabVisible, adaptiveIntervals]);

  // Update user activity timestamp
  const updateActivity = useCallback(() => {
    const now = new Date();
    lastActivityRef.current = now;
    setLastActivity(now);
  }, []);

  const refreshData = useCallback(async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    try {
      await fetchJobs();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      if (showRefreshState) setIsRefreshing(false);
    }
  }, [fetchJobs]);

  // Initial data load
  useEffect(() => {
    const loadJobs = async () => {
      try {
        await fetchJobs();
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadJobs();
  }, [fetchJobs]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (isVisible) {
        // Tab became visible - update activity and refresh immediately
        updateActivity();
        refreshData(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateActivity, refreshData]);

  // User activity detection
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Add listeners to detect user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Memoize handleManualRefresh to avoid recreating on every render
  const handleManualRefresh = useCallback(() => {
    refreshData(true);
  }, [refreshData]);

  // Smart polling with dynamic intervals
  useEffect(() => {
    if (isInitialLoad) return;

    const startSmartPolling = () => {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const optimalInterval = getOptimalPollingInterval();
      setCurrentInterval(optimalInterval);

      console.log(`🔄 Smart Polling: Setting interval to ${optimalInterval / 1000}s (${
        optimalInterval === adaptiveIntervals.ACTIVE ? 'ACTIVE' :
        optimalInterval === adaptiveIntervals.BACKGROUND ? 'BACKGROUND' :
        optimalInterval === adaptiveIntervals.IDLE ? 'IDLE' : 'INACTIVE'
      })`);

      intervalRef.current = setInterval(() => {
        refreshData(false);
        
        // Re-evaluate interval after each refresh
        const newInterval = getOptimalPollingInterval();
        if (newInterval !== optimalInterval) {
          startSmartPolling(); // Restart with new interval
        }
      }, optimalInterval);
    };

    startSmartPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInitialLoad, getOptimalPollingInterval, adaptiveIntervals]);

  // Re-evaluate polling when tab visibility or activity changes
  useEffect(() => {
    if (!isInitialLoad) {
      const newInterval = getOptimalPollingInterval();
      if (newInterval !== currentInterval) {
        // Force restart polling with new interval
        const event = new Event('restart-polling');
        window.dispatchEvent(event);
      }
    }
  }, [isTabVisible, lastActivity, currentInterval, getOptimalPollingInterval, isInitialLoad, adaptiveIntervals, refreshData]);

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

  // Get current polling mode for display
  const getPollingModeDisplay = () => {
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime();
    
    const formatInterval = (ms: number) => {
      const seconds = ms / 1000;
      if (seconds < 60) return `${seconds}s`;
      const minutes = seconds / 60;
      if (minutes < 60) return `${Math.round(minutes)}m`;
      const hours = minutes / 60;
      return `${Math.round(hours)}h`;
    };
    
    if (!isTabVisible) {
      return { 
        mode: 'Background', 
        color: 'text-yellow-600 dark:text-yellow-400', 
        interval: formatInterval(adaptiveIntervals.BACKGROUND) 
      };
    } else if (timeSinceActivity < USER_ACTIVITY_TIMEOUT) {
      return { 
        mode: 'Active', 
        color: 'text-green-600 dark:text-green-400', 
        interval: formatInterval(adaptiveIntervals.ACTIVE) 
      };
    } else if (timeSinceActivity < INACTIVE_TIMEOUT) {
      return { 
        mode: 'Idle', 
        color: 'text-blue-600 dark:text-blue-400', 
        interval: formatInterval(adaptiveIntervals.IDLE) 
      };
    } else {
      return { 
        mode: 'Inactive', 
        color: 'text-gray-600 dark:text-gray-400', 
        interval: formatInterval(adaptiveIntervals.INACTIVE) 
      };
    }
  };

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
              {!isInitialLoad && (
                <span className={`flex items-center gap-1 ${getPollingModeDisplay().color}`}>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                  {getPollingModeDisplay().mode} polling ({getPollingModeDisplay().interval})
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