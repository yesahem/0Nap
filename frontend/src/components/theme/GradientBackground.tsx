'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'hero' | 'cta';
  className?: string;
}

export function GradientBackground({ 
  children, 
  variant = 'primary', 
  className = '' 
}: GradientBackgroundProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const getGradientClasses = () => {
    const isDark = currentTheme === 'dark';
    
    switch (variant) {
      case 'hero':
        return isDark
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800'
          : 'bg-gradient-to-br from-slate-50 via-white to-blue-50';
      
      case 'secondary':
        return isDark
          ? 'bg-gradient-to-br from-gray-900 to-slate-800'
          : 'bg-gradient-to-br from-gray-50 to-blue-50/30';
      
      case 'cta':
        return isDark
          ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800';
      
      default: // primary
        return isDark
          ? 'bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100';
    }
  };

  return (
    <div className={`${getGradientClasses()} ${className}`}>
      {children}
    </div>
  );
} 