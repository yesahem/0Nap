'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useJobStore } from '@/store/jobStore';
import { useAuthStore } from '@/store/authStore';
import { intervalOptions } from '@/types/job';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function AddJobForm() {
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  
  const { addJob, isLoading } = useJobStore();
  const { isAuthenticated } = useAuthStore();

  const validateUrl = (value: string) => {
    if (!value) {
      setIsValidUrl(true);
      return;
    }
    
    try {
      const urlObj = new URL(value);
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      setIsValidUrl(isValid);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !interval || !isValidUrl) {
      toast.error('Please fill all fields with valid data');
      return;
    }

    if (!isAuthenticated) {
      toast.error('You must be authenticated to add a monitoring job');
      return;
    }

    try {
      await addJob(url, interval);
      toast.success('Monitoring job added successfully!');
      setUrl('');
      setInterval('');
    } catch {
      toast.error('Failed to add monitoring job');
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-2">
              <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Add New Monitor</CardTitle>
              <CardDescription>
                Keep your backend services alive by monitoring them regularly
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Backend URL
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://your-backend.render.com"
                  value={url}
                  onChange={handleUrlChange}
                  className={`pl-10 ${!isValidUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  required
                />
              </div>
              {!isValidUrl && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-red-500"
                >
                  Please enter a valid HTTP or HTTPS URL
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval" className="text-sm font-medium">
                Ping Interval
              </Label>
              <Select value={interval} onValueChange={setInterval} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select ping frequency" />
                </SelectTrigger>
                <SelectContent>
                  {intervalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                disabled={isLoading || !url || !interval || !isValidUrl}
              >
                {isLoading ? (
                  <div className="flex">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Monitor...
                  </div>
                ) : (
                  <div className="flex items-center justify-center cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Monitoring
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
} 