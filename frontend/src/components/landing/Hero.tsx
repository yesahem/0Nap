'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/theme/GradientBackground';
import Link from 'next/link';

export function Hero() {
  return (
    <GradientBackground variant="hero" className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-100 dark:bg-green-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Announcement Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 ring-1 ring-blue-700/10 dark:ring-blue-300/20">
              <Shield className="mr-2 h-4 w-4" />
              <span className="font-medium">99.9% Uptime Guaranteed</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Never Let Your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Servers Sleep
            </span>{' '}
            Again
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            0Nap automatically monitors your serverless deployments and prevents cold starts. 
            Keep your applications lightning-fast and your users happy with our intelligent health check system.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center cursor-pointer">
                  Start Monitoring Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 text-lg font-semibold rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition-all duration-300 cursor-pointer"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second response times' },
              { icon: Shield, title: 'Always Reliable', desc: '99.9% uptime guarantee' },
              { icon: Clock, title: 'Smart Scheduling', desc: 'Intelligent ping intervals' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400/30 dark:border-gray-600/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-500/60 dark:bg-gray-400/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </GradientBackground>
  );
} 