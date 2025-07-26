'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { GradientBackground } from '@/components/theme/GradientBackground';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      try {
        // Initialize auth from sessionStorage and validate with backend
        const isValidAuth = await initializeAuth();
        
        if (isValidAuth === false) {
          setAuthFailed(true);
          // Immediately redirect to sign in if authentication failed
          router.push('/signin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthFailed(true);
        router.push('/signin');
      } finally {
        setIsChecking(false);
      }
    };

    performAuthCheck();
  }, [initializeAuth, router]);

  useEffect(() => {
    // Additional safety check - if user becomes unauthenticated at any time, redirect
    if (!isChecking && !isAuthenticated && !authFailed) {
      router.push('/signin');
    }
  }, [isAuthenticated, isChecking, authFailed, router]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <GradientBackground variant="primary" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Loading......</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // Show loading if not authenticated or auth check failed (user will be redirected)
  if (!isAuthenticated || authFailed) {
    return (
      <GradientBackground variant="primary" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">
              {authFailed ? 'Session expired. Redirecting to sign in...' : 'Redirecting to sign in...'}
            </p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
} 