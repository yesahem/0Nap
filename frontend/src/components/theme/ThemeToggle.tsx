'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 px-0 bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur transition-all duration-300"
      >
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-9 px-0 relative overflow-hidden bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur transition-all duration-300 cursor-pointer"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {theme === 'light' && <Sun className="h-4 w-4 text-gray-600" />}
            {theme === 'dark' && <Moon className="h-4 w-4 text-gray-300" />}
            {theme === 'system' && <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[120px] bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 