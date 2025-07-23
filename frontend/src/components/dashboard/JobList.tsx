'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Loader2 } from 'lucide-react';
import { useJobStore } from '@/store/jobStore';
import { JobCard } from './JobCard';

export function JobList() {
  const { jobs, isLoading, fetchJobs } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-300" />
          <p className="text-gray-600 dark:text-gray-300">Loading your monitors...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Monitor className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No monitors yet</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md mx-auto">
          Start by adding your first backend URL to monitor. We&apos;ll keep it alive by pinging it regularly.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Your Monitors ({jobs.length})
        </h2>
      </div>
      
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {jobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 