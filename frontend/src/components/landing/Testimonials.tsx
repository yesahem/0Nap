'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GradientBackground } from '@/components/theme/GradientBackground';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Developer',
    company: 'TechFlow Inc.',
    avatar: '/api/placeholder/40/40',
    rating: 5,
    quote: "0Nap saved us thousands in potential lost revenue. Our serverless functions never sleep anymore, and our users experience lightning-fast load times. It's a game-changer for any serious web application.",
    initials: 'SC'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'DevOps Engineer',
    company: 'StartupVenture',
    avatar: '/api/placeholder/40/40', 
    rating: 5,
    quote: "Before 0Nap, we had to manually warm up our Render deployments. Now it's completely automated. The smart scheduling feature is brilliant - it knows exactly when to ping our services.",
    initials: 'MR'
  },
  {
    name: 'Emily Watson',
    role: 'Full Stack Developer',
    company: 'InnovateCode',
    avatar: '/api/placeholder/40/40',
    rating: 5,
    quote: "The dashboard is incredibly intuitive. I can monitor all our services at a glance, and the mobile app means I can check our uptime even when I'm away from my desk. Absolutely essential tool.",
    initials: 'EW'
  },
  {
    name: 'David Kim',
    role: 'CTO',
    company: 'ScaleUp Solutions',
    avatar: '/api/placeholder/40/40',
    rating: 5,
    quote: "We reduced our cold start issues by 99.8% after implementing 0Nap. The ROI was immediate - faster user experiences mean higher conversion rates. This tool pays for itself.",
    initials: 'DK'
  },
  {
    name: 'Alexandra Singh',
    role: 'Product Manager',
    company: 'CloudFirst',
    avatar: '/api/placeholder/40/40',
    rating: 5,
    quote: "0Nap integrates seamlessly with our CI/CD pipeline. Set it up once, and it just works. The reliability metrics help us make better architectural decisions for our microservices.",
    initials: 'AS'
  },
  {
    name: 'Tom Mitchell',
    role: 'Lead Developer',
    company: 'AgileWeb',
    avatar: '/api/placeholder/40/40',
    rating: 5,
    quote: "Customer support is phenomenal. They helped us optimize our ping intervals for maximum efficiency. Our AWS costs went down while performance went up. Win-win situation.",
    initials: 'TM'
  }
];

const impactQuotes = [
  {
    metric: "99.8%",
    description: "reduction in cold start incidents",
    quote: "0Nap eliminated almost all of our cold start problems overnight."
  },
  {
    metric: "3.2s",
    description: "average response time improvement",
    quote: "Our API responses are now consistently fast, improving user satisfaction."
  },
  {
    metric: "45%",
    description: "increase in user engagement",
    quote: "Faster load times directly translated to higher user engagement rates."
  }
];

export function Testimonials() {
  return (
    <GradientBackground variant="secondary" className="py-20">
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
            Loved by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Developers Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of developers who&apos;ve eliminated cold starts and improved their application performance with 0Nap.
          </p>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {impactQuotes.map((impact, index) => (
            <motion.div
              key={impact.metric}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{impact.metric}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{impact.description}</div>
              <p className="text-gray-600 dark:text-gray-300 italic">&ldquo;{impact.quote}&rdquo;</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-blue-600/30 dark:text-blue-400/30" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Trusted by teams at leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Mock company logos - in a real app, these would be actual company logos */}
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">TechFlow</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">StartupVenture</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">InnovateCode</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">ScaleUp</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">CloudFirst</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">AgileWeb</div>
          </div>
        </motion.div>
      </div>
    </GradientBackground>
  );
} 