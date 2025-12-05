import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMinistries } from '@/components/admin/AdminMinistries';
import { AdminEvents } from '@/components/admin/AdminEvents';
import { AdminServiceTimes } from '@/components/admin/AdminServiceTimes';
import { AdminChurchInfo } from '@/components/admin/AdminChurchInfo';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('ministries');

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isAdmin) return <Navigate to="/auth" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
          {activeTab === 'ministries' && <AdminMinistries />}
          {activeTab === 'events' && <AdminEvents />}
          {activeTab === 'services' && <AdminServiceTimes />}
          {activeTab === 'church-info' && <AdminChurchInfo />}
        </main>
      </div>
    </SidebarProvider>
  );
}
