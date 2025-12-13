import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, Shield, ShieldAlert, Loader2, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
    role: 'admin' | 'moderator' | 'user' | null;
}

export function AdminUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

    // Form state
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator' | 'user'>('user');

    // Edit Form state
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState<'admin' | 'moderator' | 'user'>('user');

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) throw profilesError;

            // Fetch user roles
            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('*');

            if (rolesError) throw rolesError;

            // Merge data
            const mergedUsers = profiles.map(profile => {
                const userRole = roles.find(r => r.user_id === profile.id);
                return {
                    ...profile,
                    role: userRole ? userRole.role : 'user',
                } as UserProfile;
            });

            // Sort by created_at desc
            mergedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setUsers(mergedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            // 1. Create Supabase client for creation (non-persisting to avoid logging out admin)
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

            const tempClient = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false, // Critical: don't overwrite admin session
                    autoRefreshToken: false,
                }
            });

            // 2. Sign up the user
            const { data: authData, error: authError } = await tempClient.auth.signUp({
                email: newUserEmail,
                password: newUserPassword,
                options: {
                    data: {
                        full_name: newUserName,
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('No user data returned');

            // 3. Assign Role (using main admin client)
            if (newUserRole !== 'user') {
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .insert({
                        user_id: authData.user.id,
                        role: newUserRole
                    });

                if (roleError) throw roleError;
            }

            toast.success('User created successfully');
            setIsCreateOpen(false);
            resetForm();
            fetchUsers(); // Refresh list

        } catch (error: any) {
            console.error('Error creating user:', error);
            toast.error(error.message || 'Failed to create user');
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditClick = (user: UserProfile) => {
        setEditingUser(user);
        setEditName(user.full_name || '');
        setEditRole(user.role || 'user');
        setIsEditOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsUpdating(true);
        try {
            // 1. Update Profile (Name)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: editName })
                .eq('id', editingUser.id);

            if (profileError) throw profileError;

            // 2. Update Role
            if (editRole !== editingUser.role) {
                if (editRole === 'user') {
                    // Remove role entry if downgrading to user
                    const { error: deleteError } = await supabase
                        .from('user_roles')
                        .delete()
                        .eq('user_id', editingUser.id);

                    if (deleteError) throw deleteError;
                } else {
                    // Upsert role (insert or update)
                    const { error: roleError } = await supabase
                        .from('user_roles')
                        .upsert({
                            user_id: editingUser.id,
                            role: editRole
                        }, { onConflict: 'user_id' }); // user_id is part of unique constraint

                    if (roleError) throw roleError;
                }
            }

            toast.success('User updated successfully');
            setIsEditOpen(false);
            setEditingUser(null);
            fetchUsers();

        } catch (error: any) {
            console.error('Error updating user:', error);
            toast.error(error.message || 'Failed to update user');
        } finally {
            setIsUpdating(false);
        }
    };

    const resetForm = () => {
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserName('');
        setNewUserRole('user');
    };

    const getRoleBadge = (role: string | null) => {
        switch (role) {
            case 'admin':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><ShieldAlert className="w-3 h-3 mr-1" /> Admin</span>;
            case 'moderator':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" /> Moderator</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">User</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage user accounts and roles.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={newUserRole}
                                    onValueChange={(value: 'admin' | 'moderator' | 'user') => setNewUserRole(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create User
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser?.email || ''}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select
                                    value={editRole}
                                    onValueChange={(value: 'admin' | 'moderator' | 'user') => setEditRole(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(user)}
                                                disabled={user.id === currentUser?.id} // Prevent editing self to avoid locking out
                                                title={user.id === currentUser?.id ? "Cannot edit your own role here" : "Edit user"}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
