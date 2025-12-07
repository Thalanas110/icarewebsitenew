import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, Building, LogOut, Home, BarChart3, BookOpen, Heart, Image as ImageIcon } from 'lucide-react';

const menuItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ministries', label: 'Ministries', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'sermons', label: 'Sermons', icon: BookOpen },
  { id: 'services', label: 'Service Times', icon: Clock },
  { id: 'church-info', label: 'Church Info', icon: Building },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'giving', label: 'Giving', icon: Heart },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r">
      <SidebarContent className="p-4">
        <div className="mb-6">
          <span className="font-display font-bold text-lg">I Care Center | Admin Panel</span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => setActiveTab(item.id)} className={activeTab === item.id ? 'bg-sidebar-accent' : ''}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto pt-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" /> Back to Site
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
