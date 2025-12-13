import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, Building, LogOut, Home, BarChart3, BookOpen, Heart, Image as ImageIcon, UserCog } from 'lucide-react';

const menuItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
  { id: 'ministries', label: 'Ministries', icon: Users, roles: ['admin', 'moderator'] },
  { id: 'events', label: 'Events', icon: Calendar, roles: ['admin', 'moderator'] },
  { id: 'sermons', label: 'Sermons', icon: BookOpen, roles: ['admin', 'moderator'] },
  { id: 'services', label: 'Service Times', icon: Clock, roles: ['admin'] },
  { id: 'church-info', label: 'Church Info', icon: Building, roles: ['admin'] },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon, roles: ['admin', 'moderator'] },
  { id: 'giving', label: 'Giving', icon: Heart, roles: ['admin'] },
  { id: 'users', label: 'Users', icon: UserCog, roles: ['admin'] },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const { signOut, role } = useAuth();
  const navigate = useNavigate();

  const filteredMenuItems = menuItems.filter(item =>
    role && item.roles.includes(role)
  );

  return (
    <Sidebar className="border-r">
      <SidebarContent className="p-4">
        <div className="mb-6 md:mb-10 md:mt-4">
          <span className="font-display font-bold text-lg md:text-2xl">I Care Center | Admin Panel</span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => setActiveTab(item.id)} className={`h-auto py-3 md:py-4 px-4 text-base md:text-xl ${activeTab === item.id ? 'bg-sidebar-accent' : ''}`}>
                    <item.icon className="h-4 w-4 md:h-7 md:w-7 mr-3 md:mr-4" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto pt-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start h-auto py-3 md:py-4 px-4 text-base md:text-xl" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 md:h-7 md:w-7 mr-3 md:mr-4" /> Back to Site
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start h-auto py-3 md:py-4 px-4 text-base md:text-xl ${activeTab === 'profile' ? 'bg-sidebar-accent' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCog className="h-4 w-4 md:h-7 md:w-7 mr-3 md:mr-4" /> My Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive h-auto py-3 md:py-4 px-4 text-base md:text-xl" onClick={signOut}>
            <LogOut className="h-4 w-4 md:h-7 md:w-7 mr-3 md:mr-4" /> Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
