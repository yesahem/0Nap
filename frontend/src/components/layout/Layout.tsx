'use client';

import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';
import { GradientBackground } from '@/components/theme/GradientBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <GradientBackground variant="primary" className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster />
    </GradientBackground>
  );
} 