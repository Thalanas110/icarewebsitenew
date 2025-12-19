import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, BookOpen, Home, Image as ImageIcon, UserCog, LogOut, BarChart3 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'sermons', label: 'Sermons', icon: BookOpen },
    { id: 'ministries', label: 'Ministries', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
];

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function ModeratorSidebar({ activeTab, setActiveTab }: Props) {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <Sidebar className="border-r">
            <SidebarContent className="p-4">
                <div className="mb-6 md:mb-10 md:mt-4">
                    <span className="font-display font-bold text-lg md:text-2xl">I Care Center | Moderator</span>
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start text-destructive h-auto py-3 md:py-4 px-4 text-base md:text-xl">
                                <LogOut className="h-4 w-4 md:h-7 md:w-7 mr-3 md:mr-4" /> Sign Out
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will be returned to the login screen.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={signOut}>Sign Out</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
