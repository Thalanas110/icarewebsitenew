import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ModeratorSidebar } from '@/components/moderator/ModeratorSidebar';
import { ModeratorAnalytics } from '@/components/moderator/ModeratorAnalytics';
import { AdminMinistries } from '@/components/admin/AdminMinistries';
import { AdminEvents } from '@/components/admin/AdminEvents';
import { AdminSermons } from '@/components/admin/AdminSermons';
import { AdminGallery } from '@/components/admin/AdminGallery';
import { AdminProfile } from '@/components/admin/AdminProfile';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useState } from 'react';

export default function Moderator() {
    const { isModerator, isAdmin, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics');

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    // Only allow moderators (admins can technically access if they want, but usually they use /admin)
    // If strict separation is desired: if (!isModerator) ...
    // But usually Admins should be able to see everything.
    // However, the user asked for a SEPARATE dashboard.
    // So if not a moderator (and not an admin who might want to see it?), redirect.
    // Let's assume only moderators and admins can see this, but it's designed for moderators.
    if (!isModerator && !isAdmin) return <Navigate to="/auth" replace />;

    return (
        <SidebarProvider style={{ "--sidebar-width": "24rem" } as React.CSSProperties}>
            <div className="min-h-screen flex w-full overflow-x-hidden">
                <ModeratorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 flex flex-col min-w-0">
                    <div className="md:hidden flex items-center p-4 border-b">
                        <SidebarTrigger className="mr-4" />
                        <h1 className="text-xl font-display font-bold">Moderator</h1>
                    </div>
                    <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                        <h1 className="hidden md:block text-3xl font-display font-bold mb-8">Moderator Dashboard</h1>

                        {activeTab === 'analytics' && <ModeratorAnalytics />}
                        {activeTab === 'events' && <AdminEvents />}
                        {activeTab === 'sermons' && <AdminSermons />}
                        {activeTab === 'ministries' && <AdminMinistries />}
                        {activeTab === 'gallery' && <AdminGallery />}
                        {activeTab === 'profile' && <AdminProfile />}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
