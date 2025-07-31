'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className = '',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkTurnstileLoaded = () => {
      if (window.turnstile) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Check if Turnstile is already loaded
    if (checkTurnstileLoaded()) {
      return;
    }

    // Poll for Turnstile to be loaded
    const pollInterval = setInterval(() => {
      if (checkTurnstileLoaded()) {
        clearInterval(pollInterval);
      }
    }, 100);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) {
      return;
    }

    // Render the Turnstile widget
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'error-callback': onError,
      'expired-callback': onExpire,
      theme,
      size,
    });

    widgetIdRef.current = widgetId;

    return () => {
      // Cleanup on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [isLoaded, siteKey, onVerify, onError, onExpire, theme, size]);

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const getResponse = () => {
    if (widgetIdRef.current && window.turnstile) {
      return window.turnstile.getResponse(widgetIdRef.current);
    }
    return '';
  };

  // Expose methods via ref if needed
  useEffect(() => {
    if (containerRef.current) {
      (containerRef.current as any).reset = reset;
      (containerRef.current as any).getResponse = getResponse;
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`cf-turnstile ${className}`}
      data-sitekey={siteKey}
    />
  );
}