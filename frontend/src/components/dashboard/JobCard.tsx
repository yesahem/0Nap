'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Trash2, 
  ExternalLink,
  MoreVertical,
  Activity
} from 'lucide-react';
import { Job, intervalOptions } from '@/types/job';
import { useJobStore } from '@/store/jobStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteJob, isLoading } = useJobStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleCardClick = () => {
    router.push('/websites');
  };

  const intervalLabel = intervalOptions.find(opt => opt.value === job.interval)?.label || job.interval;

  const handleDelete = async () => {
    if (!isAuthenticated) {
      toast.error('You must be authenticated to delete a monitor');
      return;
    }

    try {
      await deleteJob(job.id);
      toast.success('Monitor deleted successfully');
      setShowDeleteDialog(false);
    } catch {
      toast.error('Failed to delete monitor');
    }
  };

  const formatDate = (date: Date | undefined | null) => {
    if (!date) return 'Never';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  // Extract domain from URL for better display
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        exit={{ opacity: 0, y: -20 }}
        layout
      >
        <Card 
          className="group hover:shadow-md transition-all duration-200 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur cursor-pointer"
          onClick={handleCardClick}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className={`rounded-full p-2 mt-0.5 flex-shrink-0 ${
                  job.status === 'active' ? 'bg-green-100 dark:bg-green-950' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <Activity className={`h-4 w-4 ${
                    job.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={job.status === 'active' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        job.status === 'active' 
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {job.status === 'active' ? 'Active' : 'Monitoring'}
                    </Badge>
                    {job.pingCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {job.pingCount} pings
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={job.url}>
                      {getDisplayUrl(job.url)}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{intervalLabel}</span>
                      </div>
                      {job.lastPing && (
                        <div className="truncate">
                          Last ping: {formatDate(job.lastPing)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 flex-shrink-0 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem onClick={() => window.open(job.url, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4 cursor-pointer" />
                    Open URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4 cursor-pointer" />
                    Delete Monitor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-gray-600 dark:text-gray-300">
              <div>
                Created: {formatDate(job.createdAt)}
              </div>
              <div className="flex items-center gap-4">
                {job.lastPing && (
                  <div>
                    Last pinged: {formatDate(job.lastPing)}
                  </div>
                )}
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  {job.pingCount} total pings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Monitor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the monitor for{' '}
              <span className="font-medium break-all">{getDisplayUrl(job.url)}</span>? 
              This action cannot be undone and will stop all pings to this URL.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 