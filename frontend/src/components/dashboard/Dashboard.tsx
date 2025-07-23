'use client';

import { motion } from 'framer-motion';
import { AddJobForm } from './AddJobForm';
import { JobList } from './JobList';
import { StatsCards } from './StatsCards';

export function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 lg:space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          Keep Your Services{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Alive
          </span>
        </h1>
        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Prevent cold starts on your serverless deployments. Monitor your backend services 
          and keep them running smoothly with automated health checks.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatsCards />
      </motion.div>

      {/* Add Job Form */}
      <div className="max-w-2xl mx-auto px-4">
        <AddJobForm />
      </div>

      {/* Job List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-4"
      >
        <JobList />
      </motion.div>
    </div>
  );
} 