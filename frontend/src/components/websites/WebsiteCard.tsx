'use client';

import { useState } from 'react';

import { 
  Globe, 
  ExternalLink, 
  Trash2, 
  Clock, 
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar
} from 'lucide-react';
import { Job } from '@/types/job';
import { useJobStore } from '@/store/jobStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface WebsiteCardProps {
  job: Job;
}

export function WebsiteCard({ job }: WebsiteCardProps) {
  const { deleteJob } = useJobStore();
  const { isAuthenticated } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!isAuthenticated) {
      toast.error('You must be authenticated to delete a website');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteJob(job.id);
      toast.success('Website removed from monitoring');
    } catch {
      toast.error('Failed to delete website');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = () => {
    switch (job.status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (job.status) {
      case 'active':
        return (
          <Badge className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
            Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
            Paused
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (date: Date | undefined, pingCount: number) => {
    if (!date) {
      // If there's no date but pingCount > 0, backend is pinging but not tracking timestamps
      return pingCount > 0 ? 'Recently (exact time unavailable)' : 'Never';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 ">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                {getDomainFromUrl(job.url)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {job.url}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Ping Count</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {job.pingCount || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Interval</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {job.interval}
            </p>
          </div>
        </div>

        {/* Last Ping */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Last Pinged</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(job.lastPing, job.pingCount || 0)}
          </p>
        </div>

        {/* Created Date */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Added On</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {(() => {
              try {
                if (!job.createdAt || isNaN(job.createdAt.getTime())) {
                  return 'Unknown date';
                }
                return job.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
              } catch {
                return 'Unknown date';
              }
            })()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer"
            onClick={() => {
              const url = job.url.startsWith('http') ? job.url : `https://${job.url}`;
              window.open(url, '_blank');
            }}
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            Visit Site
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3 " />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Website</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove &ldquo;{getDomainFromUrl(job.url)}&rdquo; from monitoring? 
                  This action cannot be undone and all ping history will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove Website'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
} 