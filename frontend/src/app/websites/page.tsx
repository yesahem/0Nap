import { WebsitesList } from '@/components/websites/WebsitesList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

export default function WebsitesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Monitored Websites
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all your monitored websites and their ping status
            </p>
          </div>
          
          <WebsitesList />
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 