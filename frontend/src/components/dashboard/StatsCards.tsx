'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, Shield, AlertCircle } from 'lucide-react';
import { useJobStore } from '@/store/jobStore';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCards() {
  const { getJobStats } = useJobStore();
  const stats = getJobStats();

  const cards = [
    {
      title: 'Total Monitors',
      value: stats.total,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Active',
      value: stats.active,
      icon: Shield,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Paused',
      value: stats.paused,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: AlertCircle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                    {card.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 