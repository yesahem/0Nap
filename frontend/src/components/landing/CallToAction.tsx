'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/theme/GradientBackground';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import Link from 'next/link';

export function CallToAction() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const benefits = [
    'No credit card required',
    'Free monitoring for up to 5 services',
    'Setup in under 2 minutes',
    '24/7 customer support'
  ];

  const primaryCTA = isAuthenticated ? '/dashboard' : '/signup';
  const primaryCTAText = isAuthenticated ? 'Go to Dashboard' : 'Start Free Monitoring';

  return (
    <GradientBackground variant="cta" className="relative py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute top-40 right-40 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full mb-8"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Ready to{' '}
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Eliminate Cold Starts?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-white/90 max-w-2xl mx-auto mb-12"
        >
          Join thousands of developers who trust 0Nap to keep their serverless applications running smoothly.
        </motion.p>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-white/90"
            >
              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-sm font-medium">{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href={primaryCTA}>
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[250px]"
            >
              <span className="relative z-10 flex items-center cursor-pointer">
                <Zap className="mr-2 h-5 w-5" />
                {primaryCTAText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          
          {!isAuthenticated && (
            <Link href="/signin">
              <Button 
                variant="ghost" 
                size="lg"
                className="group text-white hover:text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 px-10 py-4 text-lg font-semibold rounded-full backdrop-blur transition-all duration-300 cursor-pointer"
              >
                Already have an account?
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Trust Badge */}
        
        {/* Comment out the below code to add a trust badge */}

        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur rounded-full px-6 py-3"
        >
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              // <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full" />
              <Star className="h-4 w-4 text-yellow-400 fill-amber-200" />
            ))}
          </div>

         
          <span className="text-white/90 text-sm font-medium">
            Trusted by 10,000+ developers worldwide
          </span>
        </motion.div> */}
      </div>
    </GradientBackground>
  );
} 