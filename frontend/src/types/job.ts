export interface Job {
  id: string;
  url: string;
  interval: string; // Frontend format like "15min", "1hour"
  status: 'active' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  lastPing?: Date;
  nextPing?: Date;
  pingCount: number;
}

export interface JobStats {
  total: number;
  active: number;
  paused: number;
}

// Interval options for the dropdown (frontend display)
export const intervalOptions = [
  { value: '12min', label: 'Every 12 minutes' },
  { value: '15min', label: 'Every 15 minutes' },
  { value: '30min', label: 'Every 30 minutes' },
  { value: '1hour', label: 'Every hour' },
  { value: '2hour', label: 'Every 2 hours' },
  { value: '6hour', label: 'Every 6 hours' },
  { value: '12hour', label: 'Every 12 hours' },
  { value: '24hour', label: 'Every 1 day' },
  { value: '48hour', label: 'Every 2 days' },
  { value: '72hour', label: 'Every 3 days' },
  { value: '96hour', label: 'Every 4 days' },
  { value: '120hour', label: 'Every 5 days' },
  { value: '144hour', label: 'Every 6 days' },
  { value: '168hour', label: 'Every 7 days' },
  { value: '192hour', label: 'Every 8 days' },
];

// Helper function to convert frontend interval to backend minutes
export const intervalToMinutes = (interval: string): number => {
  switch (interval) {
  
    case '12min': return 12;
    case '15min': return 15;
    case '30min': return 30;
    case '1hour': return 60;
    case '2hour': return 120;
    case '6hour': return 360;
    case '12hour': return 720;
    case '24hour': return 1440;
    case '48hour': return 2880;
    case '72hour': return 4320;
    case '96hour': return 5760;
    case '120hour': return 7200;
    case '144hour': return 8640;
    case '168hour': return 10080;
    case '192hour': return 11520;
    default: return 5;
  }
};

// Helper function to convert backend minutes to frontend interval
export const minutesToInterval = (minutes: number): string => {
  switch (minutes) {
    case 12: return '12min';
    case 15: return '15min';
    case 30: return '30min';
    case 60: return '1hour';
    case 120: return '2hour';
    case 360: return '6hour';
    case 720: return '12hour';
    case 1440: return '24hour';
    case 2880: return '48hour';
    case 4320: return '72hour';
    case 5760: return '96hour';
    case 7200: return '120hour';
    case 8640: return '144hour';
    case 10080: return '168hour';
    case 11520: return '192hour';
    default: return '5min';
  }
}; 