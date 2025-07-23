import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

export interface SmartPollingConfig {
  activeInterval?: number;    // Interval when user is active (default: 20s)
  backgroundInterval?: number; // Interval when tab is hidden (default: 1m)
  idleInterval?: number;      // Interval when user is idle (default: 2m)
  inactiveInterval?: number;  // Interval when completely inactive (default: 5m)
  activityTimeout?: number;   // How long until considered idle (default: 5m)
  inactiveTimeout?: number;   // How long until completely inactive (default: 15m)
}

const DEFAULT_CONFIG: Required<SmartPollingConfig> = {
  activeInterval: 20000,      // 20 seconds
  backgroundInterval: 60000,  // 1 minute
  idleInterval: 120000,       // 2 minutes
  inactiveInterval: 300000,   // 5 minutes
  activityTimeout: 5 * 60 * 1000,  // 5 minutes
  inactiveTimeout: 15 * 60 * 1000, // 15 minutes
};

export interface SmartPollingState {
  isTabVisible: boolean;
  lastActivity: Date;
  currentInterval: number;
  pollingMode: 'active' | 'background' | 'idle' | 'inactive';
}

export function useSmartPolling(
  callback: () => void | Promise<void>,
  config: SmartPollingConfig = {},
  enabled: boolean = true
): SmartPollingState {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [currentInterval, setCurrentInterval] = useState(finalConfig.activeInterval);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef(new Date());
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Determine optimal polling interval
  const getOptimalInterval = useCallback(() => {
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime();
    
    if (!isTabVisible) {
      return finalConfig.backgroundInterval;
    } else if (timeSinceActivity < finalConfig.activityTimeout) {
      return finalConfig.activeInterval;
    } else if (timeSinceActivity < finalConfig.inactiveTimeout) {
      return finalConfig.idleInterval;
    } else {
      return finalConfig.inactiveInterval;
    }
  }, [isTabVisible, finalConfig]);

  // Get current polling mode
  const getPollingMode = useCallback((): SmartPollingState['pollingMode'] => {
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime();
    
    if (!isTabVisible) {
      return 'background';
    } else if (timeSinceActivity < finalConfig.activityTimeout) {
      return 'active';
    } else if (timeSinceActivity < finalConfig.inactiveTimeout) {
      return 'idle';
    } else {
      return 'inactive';
    }
  }, [isTabVisible, finalConfig]);

  // Update activity
  const updateActivity = useCallback(() => {
    const now = new Date();
    lastActivityRef.current = now;
    setLastActivity(now);
  }, []);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (isVisible) {
        updateActivity();
        // Immediate poll when tab becomes visible
        if (enabled) {
          callbackRef.current();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateActivity, enabled]);

  // User activity detection
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Smart polling
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const startPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const optimalInterval = getOptimalInterval();
      setCurrentInterval(optimalInterval);

      intervalRef.current = setInterval(async () => {
        await callbackRef.current();
        
        // Re-evaluate interval
        const newInterval = getOptimalInterval();
        if (newInterval !== optimalInterval) {
          startPolling(); // Restart with new interval
        }
      }, optimalInterval);
    };

    startPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, getOptimalInterval]);

  return {
    isTabVisible,
    lastActivity,
    currentInterval,
    pollingMode: getPollingMode(),
  };
} 