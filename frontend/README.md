# 0Nap - Cold Start Prevention Service

A modern, responsive web application designed to prevent cold starts on serverless deployments by continuously monitoring and pinging your backend services.

![0Nap Dashboard](https://img.shields.io/badge/Built%20with-Next.js-000000?style=for-the-badge&logo=next.js)
![shadcn/ui](https://img.shields.io/badge/UI%20Library-shadcn%2Fui-000000?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-0055FF?style=for-the-badge&logo=framer)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

## 🌟 Features

### Core Functionality
- **URL Monitoring**: Add and monitor multiple backend URLs
- **Flexible Intervals**: Choose from 15 minutes, 30 minutes, 1 hour, 2 hours, or 6 hours
- **Real-time Status**: Track active and paused monitors
- **Easy Management**: Pause, resume, edit, or delete monitors with simple controls

### User Experience
- **Modern UI**: Clean, professional interface built with shadcn/ui components
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices  
- **Smooth Animations**: Subtle framer-motion animations for enhanced UX
- **Real-time Feedback**: Toast notifications for all user actions
- **Dark Mode Ready**: Built-in support for light and dark themes

### Technical Features
- **Type-Safe**: Built with TypeScript for better development experience
- **State Management**: Zustand for efficient state management
- **Local Storage**: Persist monitor data locally (ready for backend integration)
- **URL Validation**: Built-in validation for HTTP/HTTPS URLs
- **Optimistic Updates**: Immediate UI feedback with error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 0Nap-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── dashboard/         # Dashboard components
│   │   ├── AddJobForm.tsx # URL input form
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── JobCard.tsx    # Individual job card
│   │   ├── JobList.tsx    # Jobs listing
│   │   └── StatsCards.tsx # Statistics cards
│   ├── layout/            # Layout components
│   │   ├── Header.tsx     # Application header
│   │   └── Layout.tsx     # Main layout wrapper
│   └── ui/                # shadcn/ui components
├── store/
│   └── jobStore.ts        # Zustand store for job management
├── types/
│   └── job.ts             # TypeScript type definitions
└── lib/
    └── utils.ts           # Utility functions
```

## 💻 Components Overview

### Dashboard Components

#### `AddJobForm`
- URL input with real-time validation
- Interval selection dropdown
- Form submission with loading states
- Error handling and success notifications

#### `JobCard`
- Individual monitor display
- Status indicators (Active/Paused)
- Action dropdown menu (Pause/Resume/Edit/Delete)
- Delete confirmation dialog
- Responsive layout for all screen sizes

#### `JobList`
- Grid layout for job cards
- Animated list updates
- Empty state for new users
- Loading states

#### `StatsCards`
- Overview statistics (Total, Active, Paused, Uptime)
- Color-coded status indicators
- Responsive grid layout
- Smooth animations

### Layout Components

#### `Header`
- Brand logo and name
- Real-time statistics display
- Responsive design with mobile optimizations
- Animated elements

#### `Layout` 
- Main application wrapper
- Toast notification container
- Gradient background
- Consistent spacing and typography

## 🔧 State Management

The application uses Zustand for state management with the following features:

- **Jobs Array**: List of all monitoring jobs
- **Loading States**: Track API call states
- **Error Handling**: Centralized error management
- **Local Storage**: Persist data between sessions
- **Computed Stats**: Real-time statistics calculation

### Store Actions

```typescript
interface JobStore {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  
  // Core actions
  fetchJobs: () => Promise<void>;
  addJob: (url: string, interval: string) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  toggleJobStatus: (id: string) => Promise<void>;
  
  // Computed
  getJobStats: () => JobStats;
}
```

## 🎨 Styling & Design

### Design System
- **Colors**: Neutral palette with accent colors for status indicators
- **Typography**: Inter font family for optimal readability
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Shadows**: Subtle shadows for depth and hierarchy
- **Animations**: Smooth, purposeful animations that enhance UX

### Responsive Breakpoints
- **Mobile**: `< 768px` - Single column layout, simplified navigation
- **Tablet**: `768px - 1024px` - Two-column grids, adapted spacing
- **Desktop**: `> 1024px` - Full feature set, optimal spacing

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or  
yarn start
```

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```bash
# API Configuration (when backend is connected)
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Application Configuration  
NEXT_PUBLIC_APP_NAME=0Nap
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🔌 Backend Integration

The frontend is structured to easily integrate with a backend API. The expected endpoints are:

### API Endpoints

#### `GET /api/jobs`
Fetch all monitoring jobs for the user
```typescript
Response: Job[]
```

#### `POST /api/jobs`
Create a new monitoring job
```typescript
Request: { url: string, interval: string }
Response: Job
```

#### `PATCH /api/jobs/:id`
Update an existing job
```typescript
Request: Partial<Job>
Response: Job
```

#### `DELETE /api/jobs/:id`
Delete a monitoring job
```typescript
Response: { success: boolean }
```

### Integration Steps

1. Replace mock API functions in `src/store/jobStore.ts`
2. Add authentication if required
3. Handle API errors appropriately
4. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Advanced analytics and monitoring charts
- [ ] Email/SMS notifications for downtime
- [ ] Custom ping payloads and headers
- [ ] Webhook integration for status updates
- [ ] Export/import monitor configurations
- [ ] Advanced scheduling options
- [ ] Performance monitoring metrics

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@example.com](mailto:your-email@example.com)

---

Built with ❤️ using Next.js, shadcn/ui, and Framer Motion
