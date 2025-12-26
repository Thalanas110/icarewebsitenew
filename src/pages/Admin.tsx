import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminChurchInfo } from "@/components/admin/AdminChurchInfo";
import { AdminEvents } from "@/components/admin/AdminEvents";
import { AdminGallery } from "@/components/admin/AdminGallery";
import AdminGiving from "@/components/admin/AdminGiving";
import { AdminMinistries } from "@/components/admin/AdminMinistries";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { AdminSermons } from "@/components/admin/AdminSermons";
import { AdminServiceTimes } from "@/components/admin/AdminServiceTimes";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export default function Admin() {
  const { isAdmin, isModerator, loading, role } = useAuth();
  const [activeTab, setActiveTab] = useState("analytics");

  // Enable real-time updates for all admin data
  useRealtimeSubscription();

  useEffect(() => {
    // Redirect moderators to a safe tab if they land on 'analytics' (default) or restricted tabs
    if (role === "moderator" && activeTab !== "profile") {
      const allowedTabs = [
        "events",
        "sermons",
        "ministries",
        "gallery",
        "profile",
      ];
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab("events");
      }
    }
  }, [role, activeTab]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  // Redirect moderators to the specific moderator dashboard
  if (role === "moderator") return <Navigate replace to="/moderator" />;

  if (!isAdmin) return <Navigate replace to="/auth" />;

  const isTabAllowed = (tab: string) => {
    if (tab === "profile") return true;
    if (isAdmin) return true;
    return false;
  };

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
    >
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center border-b p-4 md:hidden">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-bold font-display text-xl">Admin</h1>
          </div>
          <div className="flex-1 overflow-x-hidden p-4 md:p-8">
            <h1 className="mb-8 hidden font-bold font-display text-3xl md:block">
              Admin Dashboard
            </h1>

            {activeTab === "analytics" && isTabAllowed("analytics") && (
              <AdminAnalytics />
            )}
            {activeTab === "ministries" && isTabAllowed("ministries") && (
              <AdminMinistries />
            )}
            {activeTab === "events" && isTabAllowed("events") && (
              <AdminEvents />
            )}
            {activeTab === "sermons" && isTabAllowed("sermons") && (
              <AdminSermons />
            )}
            {activeTab === "services" && isTabAllowed("services") && (
              <AdminServiceTimes />
            )}
            {activeTab === "church-info" && isTabAllowed("church-info") && (
              <AdminChurchInfo />
            )}
            {activeTab === "gallery" && isTabAllowed("gallery") && (
              <AdminGallery />
            )}
            {activeTab === "giving" && isTabAllowed("giving") && (
              <AdminGiving />
            )}
            {activeTab === "users" && isTabAllowed("users") && <AdminUsers />}
            {activeTab === "profile" && <AdminProfile />}

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
