import { SignInForm } from '@/components/auth/SignInForm';
import { GradientBackground } from '@/components/theme/GradientBackground';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';

export default function SignInPage() {
  return (
    <GradientBackground variant="hero" className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">0Nap</span>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <SignInForm />
        </div>
      </div>
      
      <Toaster />
    </GradientBackground>
  );
} 