import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Profile State
    const [fullName, setFullName] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatingPassword, setUpdatingPassword] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        getProfile();
    }, [user, navigate]);

    const getProfile = async () => {
        try {
            setLoadingProfile(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setFullName(data.full_name || '');
            }
        } catch (error: any) {
            console.error('Error loading profile:', error);
            toast.error('Error loading user profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdatingProfile(true);

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setUpdatingPassword(true);
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast.success('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Error updating password:', error);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (loadingProfile) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="section-padding min-h-[80vh] bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-display font-bold text-center mb-8">Account Settings</h1>

                    <div className="grid gap-8 max-w-2xl mx-auto">
                        {/* Profile Information Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <CardTitle>Profile Information</CardTitle>
                                </div>
                                <CardDescription>
                                    Update your personal information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <Button type="submit" disabled={updatingProfile}>
                                        {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Profile
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Password Update Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-primary" />
                                    <CardTitle>Security</CardTitle>
                                </div>
                                <CardDescription>
                                    Update your password to keep your account secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>
                                    <Button type="submit" disabled={updatingPassword} variant="outline">
                                        {updatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
