'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Clock, 
  Globe, 
  BarChart3, 
  Bell, 
  Lock, 
  Smartphone,
  Code2,
  Users,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GradientBackground } from '@/components/theme/GradientBackground';

const features = [
  {
    icon: Shield,
    title: 'Cold Start Prevention',
    description: 'Automatically ping your serverless functions to keep them warm and responsive.',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    gradient: 'from-green-400 to-green-600'
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description: 'Flexible intervals from 15 minutes to 6 hours based on your application needs.',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    icon: BarChart3,
    title: 'Real-time Monitoring',
    description: 'Track uptime, response times, and monitor health across all your services.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Works with Render, Vercel, Railway, Heroku, and any HTTP endpoint.',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    gradient: 'from-orange-400 to-orange-600'
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Get notified immediately when your services go down or recover.',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
    gradient: 'from-red-400 to-red-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Manage your monitors on the go with our fully responsive interface.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
    gradient: 'from-indigo-400 to-indigo-600'
  }
];

const stats = [
  { label: 'Uptime Guarantee', value: '99.9%', icon: TrendingUp },
  { label: 'Response Time', value: '<500ms', icon: Zap },
  { label: 'Active Monitors', value: '10K+', icon: Users },
  { label: 'Platform Support', value: '15+', icon: Code2 }
];

export function Features() {
  return (
    <GradientBackground variant="primary" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stay Online
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive monitoring and alerting for modern serverless applications. 
            Built by developers, for developers.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Ready to use</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800/50">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-800 dark:text-blue-300 font-medium">Enterprise-grade security included</span>
          </div>
        </motion.div>
      </div>
    </GradientBackground>
  );
} 