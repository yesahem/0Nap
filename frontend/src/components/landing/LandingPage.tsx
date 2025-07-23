'use client';

import { LandingHeader } from './LandingHeader';
import { Hero } from './Hero';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { CallToAction } from './CallToAction';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LandingHeader />
      
      <main>
        <Hero />
        
        <section id="features">
          <Features />
        </section>
        
        <section id="testimonials">
          <Testimonials />
        </section>
        
        <CallToAction />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">

                <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">0Nap</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Cold Start Prevention</p>
            </div>
          </motion.div>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Preventing cold starts and keeping your serverless applications always ready.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
            <p>&copy; 2024 0Nap. All rights reserved. Built with ❤️ for developers worldwide.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
} 