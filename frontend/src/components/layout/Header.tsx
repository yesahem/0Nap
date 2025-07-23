'use client';

import { motion } from 'framer-motion';
import { Activity, Shield, Zap, LogOut } from 'lucide-react';
import { useJobStore } from '@/store/jobStore';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { getJobStats } = useJobStore();
  const { user, isAuthenticated, checkAuth, signOut } = useAuthStore();
  const stats = getJobStats();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">0Nap</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cold Start Prevention</p>
              </div>
            </Link>
          </motion.div>

          {/* Stats and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="h-4 w-4 text-green-500" />
                <Badge variant="secondary" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  {stats.active} Active
                </Badge>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Zap className="h-4 w-4 text-blue-500" />
                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  {stats.total} Total
                </Badge>
              </motion.div>
            </div>

            {/* Mobile Stats */}
            <div className="flex md:hidden items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {stats.active}/{stats.total}
              </Badge>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name || user.email} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm cursor-pointer" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/websites" className="cursor-pointer">
                      <Activity className="mr-2 h-4 w-4" />
                      <span>All Websites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Show sign in button if not authenticated */
              <Link href="/signin">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
} 