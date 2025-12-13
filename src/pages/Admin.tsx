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
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminProfile } from '@/components/admin/AdminProfile';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';

export default function Admin() {
  const { isAdmin, isModerator, loading, role } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    // Redirect moderators to a safe tab if they land on 'analytics' (default) or restricted tabs
    if (role === 'moderator' && activeTab !== 'profile') {
      const allowedTabs = ['events', 'sermons', 'ministries', 'gallery', 'profile'];
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab('events');
      }
    }
  }, [role, activeTab]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // Use a more permissive check here, filtering is done per-tab
  if (!isAdmin && !isModerator) return <Navigate to="/auth" replace />;

  const isTabAllowed = (tab: string) => {
    if (tab === 'profile') return true; // Allowed for everyone
    if (isAdmin) return true;
    if (isModerator) {
      return ['events', 'sermons', 'ministries', 'gallery'].includes(tab);
    }
    return false;
  };

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

            {activeTab === 'analytics' && isTabAllowed('analytics') && <AdminAnalytics />}
            {activeTab === 'ministries' && isTabAllowed('ministries') && <AdminMinistries />}
            {activeTab === 'events' && isTabAllowed('events') && <AdminEvents />}
            {activeTab === 'sermons' && isTabAllowed('sermons') && <AdminSermons />}
            {activeTab === 'services' && isTabAllowed('services') && <AdminServiceTimes />}
            {activeTab === 'church-info' && isTabAllowed('church-info') && <AdminChurchInfo />}
            {activeTab === 'gallery' && isTabAllowed('gallery') && <AdminGallery />}
            {activeTab === 'giving' && isTabAllowed('giving') && <AdminGiving />}
            {activeTab === 'users' && isTabAllowed('users') && <AdminUsers />}
            {activeTab === 'profile' && <AdminProfile />}

            {!isTabAllowed(activeTab) && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Access Denied or Invalid Tab
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
