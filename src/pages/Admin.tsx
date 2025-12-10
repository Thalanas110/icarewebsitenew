import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminMinistries } from '@/components/admin/AdminMinistries';
import { AdminEvents } from '@/components/admin/AdminEvents';
import { AdminSermons } from '@/components/admin/AdminSermons';
import { AdminServiceTimes } from '@/components/admin/AdminServiceTimes';
import { AdminChurchInfo } from '@/components/admin/AdminChurchInfo';
import { AdminGallery } from '@/components/admin/AdminGallery';
import AdminGiving from '@/components/admin/AdminGiving';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useState } from 'react';

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isAdmin) return <Navigate to="/auth" replace />;

  return (
    <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden flex items-center p-4 border-b">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-display font-bold">Admin</h1>
          </div>
          <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
            <h1 className="hidden md:block text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'ministries' && <AdminMinistries />}
            {activeTab === 'events' && <AdminEvents />}
            {activeTab === 'sermons' && <AdminSermons />}
            {activeTab === 'services' && <AdminServiceTimes />}
            {activeTab === 'church-info' && <AdminChurchInfo />}
            {activeTab === 'gallery' && <AdminGallery />}
            {activeTab === 'giving' && <AdminGiving />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
