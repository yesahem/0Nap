import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';

export default function WebsitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 