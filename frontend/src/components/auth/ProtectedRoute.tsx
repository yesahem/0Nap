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

  useEffect(() => {
    const performAuthCheck = async () => {
      // Initialize auth from sessionStorage and validate with backend
      await initializeAuth();
      setIsChecking(false);
    };

    performAuthCheck();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      // Redirect to sign in page if not authenticated
      router.push('/signin');
    }
  }, [isAuthenticated, isChecking, router]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <GradientBackground variant="primary" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // Show loading if not authenticated (user will be redirected)
  if (!isAuthenticated) {
    return (
      <GradientBackground variant="primary" className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Redirecting to sign in...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
} 