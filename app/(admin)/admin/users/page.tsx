'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Users,
  Shield,
  ShieldCheck,
  ShieldOff,
  Loader2,
  UserPlus,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  KeyRound,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  History,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { UserProfile, UserActivityLog } from '@/lib/types';
import Image from 'next/image';

const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Dialogs state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [confirmRoleUser, setConfirmRoleUser] = useState<UserProfile | null>(null);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Create User Form State
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' as 'user' | 'admin',
  });

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    company: '',
    country: '',
    role: 'user' as 'user' | 'admin',
    status: 'active' as 'active' | 'suspended',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data as UserProfile[]) ?? []);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Create User
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.email || !createForm.password) {
      toast.error('Email and password are required.');
      return;
    }

    setActionLoadingId('create');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: createForm.email,
        password: createForm.password,
        options: {
          data: {
            full_name: createForm.full_name,
          },
        },
      });

      if (authError) throw authError;

      const newUserId = authData.user?.id;
      if (newUserId) {
        await supabase.from('user_profiles').upsert({
          id: newUserId,
          email: createForm.email,
          full_name: createForm.full_name || null,
          role: createForm.role,
          status: 'active',
        });
      }

      toast.success(`User ${createForm.email} created successfully!`);
      setCreateDialogOpen(false);
      setCreateForm({ email: '', password: '', full_name: '', role: 'user' });
      await loadUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handle Edit User
  function startEditing(u: UserProfile) {
    setEditingUser(u);
    setEditForm({
      full_name: u.full_name ?? '',
      phone: u.phone ?? '',
      company: u.company ?? '',
      country: u.country ?? '',
      role: u.role ?? 'user',
      status: u.status ?? 'active',
    });
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    const adminCount = users.filter((u) => u.role === 'admin').length;
    if (editingUser.role === 'admin' && editForm.role === 'user' && adminCount <= 1) {
      toast.error('Cannot demote the last Admin account.');
      return;
    }

    setActionLoadingId(editingUser.id);
    try {
      // Base payload with standard columns that exist in user_profiles
      const basePayload: Record<string, any> = {
        full_name: editForm.full_name || null,
        phone: editForm.phone || null,
        company: editForm.company || null,
        country: editForm.country || null,
        role: editForm.role,
        updated_at: new Date().toISOString(),
      };

      const { error: baseError } = await supabase
        .from('user_profiles')
        .update(basePayload)
        .eq('id', editingUser.id);

      if (baseError) throw baseError;

      // Try updating status separately if column exists
      if (editForm.status) {
        await supabase
          .from('user_profiles')
          .update({ status: editForm.status })
          .eq('id', editingUser.id);
      }

      toast.success(`Updated profile for ${editingUser.email}`);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user profile. Check admin permissions.');
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handle Quick Role Toggle (Make Admin / Remove Admin)
  async function toggleRole(targetUser: UserProfile) {
    const newRole: 'user' | 'admin' = targetUser.role === 'admin' ? 'user' : 'admin';
    const adminCount = users.filter((u) => u.role === 'admin').length;

    if (targetUser.role === 'admin' && newRole === 'user' && adminCount <= 1) {
      toast.error('Cannot remove the last Admin account.');
      return;
    }

    setActionLoadingId(targetUser.id);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', targetUser.id);

      if (error) throw error;

      setUsers(users.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)));
      toast.success(
        newRole === 'admin'
          ? `${targetUser.full_name || targetUser.email} is now an admin.`
          : `${targetUser.full_name || targetUser.email} is now a regular user.`
      );
    } catch (err) {
      console.error('Error toggling role:', err);
      toast.error('Failed to update role. Make sure you have admin privileges.');
    } finally {
      setActionLoadingId(null);
      setConfirmRoleUser(null);
    }
  }

  // Handle Toggle Suspend/Activate
  async function toggleStatus(u: UserProfile) {
    if (u.id === currentUser?.id) {
      toast.error('You cannot suspend your own account.');
      return;
    }

    const newStatus: 'active' | 'suspended' = u.status === 'suspended' ? 'active' : 'suspended';
    setActionLoadingId(u.id);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', u.id);

      if (error) throw error;

      toast.success(
        newStatus === 'suspended'
          ? `User ${u.email} suspended.`
          : `User ${u.email} activated.`
      );
      await loadUsers();
    } catch (err) {
      console.error('Error changing status:', err);
      toast.error('Failed to update user status.');
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handle Delete User
  async function handleDeleteUser() {
    if (!deletingUser) return;

    if (deletingUser.id === currentUser?.id) {
      toast.error('You cannot delete your own account.');
      return;
    }

    const adminCount = users.filter((u) => u.role === 'admin').length;
    if (deletingUser.role === 'admin' && adminCount <= 1) {
      toast.error('Cannot delete the last Admin account.');
      return;
    }

    setActionLoadingId(deletingUser.id);
    try {
      const { error } = await supabase.from('user_profiles').delete().eq('id', deletingUser.id);
      if (error) throw error;

      toast.success(`User ${deletingUser.email} deleted.`);
      setDeletingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user.');
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handle Reset Password Email Trigger
  async function handleResetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      toast.success(`Password reset email sent to ${email}`);
    } catch (err) {
      console.error('Error sending reset email:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email.');
    }
  }

  // View User Profile & Logs
  async function handleViewUser(u: UserProfile) {
    setViewingUser(u);
    setLogsLoading(true);

    try {
      const { data } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', u.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setActivityLogs((data as UserActivityLog[]) ?? []);
    } catch {
      setActivityLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }

  // Filter & Pagination Logic
  const filtered = users.filter((u) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.company?.toLowerCase().includes(searchLower);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (u.status ?? 'active') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedUsers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View registered users, manage admin privileges, reset passwords, and audit account states.{' '}
            <span className="font-semibold text-foreground">{users.length} Total Users</span> ({adminCount} Admins).
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(val) => {
            setRoleFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User List */}
      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm">Loading users...</p>
        </Card>
      ) : paginatedUsers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-semibold text-foreground">No users match your criteria.</p>
          <p className="text-sm text-muted-foreground">Try clearing your filters or search query.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {paginatedUsers.map((u) => {
            const isSelf = u.id === currentUser?.id;
            const isAdmin = u.role === 'admin';
            const isSuspended = u.status === 'suspended';

            return (
              <Card key={u.id} className={isSuspended ? 'opacity-70 bg-muted/20' : ''}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {u.avatar_url ? (
                      <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border">
                        <Image src={u.avatar_url} alt="Avatar" fill className="object-cover" />
                      </div>
                    ) : (
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                          isAdmin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {(u.full_name || u.email).charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground truncate">{u.full_name || 'Unnamed User'}</p>
                        {isSelf && (
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            You
                          </span>
                        )}
                        <Badge
                          variant={isAdmin ? 'default' : 'secondary'}
                          className="capitalize text-[10px]"
                        >
                          {u.role}
                        </Badge>

                        {isSuspended && (
                          <Badge variant="outline" className="text-destructive border-destructive/40 text-[10px]">
                            Suspended
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      {(u.company || u.country) && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {u.company} {u.company && u.country ? '•' : ''} {u.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewUser(u)}
                      title="View Details & Logs"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(u)}
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmRoleUser(u)}
                      disabled={isSelf}
                      title={isAdmin ? 'Remove Admin Access' : 'Grant Admin Access'}
                      className={isAdmin ? 'text-primary font-semibold' : ''}
                    >
                      {isAdmin ? <ShieldOff className="h-4 w-4 text-amber-500" /> : <ShieldCheck className="h-4 w-4 text-primary" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetPassword(u.email)}
                      title="Send Password Reset Email"
                    >
                      <KeyRound className="h-4 w-4 text-primary" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(u)}
                      disabled={isSelf || actionLoadingId === u.id}
                      title={isSuspended ? 'Activate User' : 'Suspend User'}
                      className={isSuspended ? 'text-success' : 'text-amber-500'}
                    >
                      {isSuspended ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingUser(u)}
                      disabled={isSelf || (isAdmin && adminCount <= 1)}
                      title="Delete User"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Showing Page {currentPage} of {totalPages} ({filtered.length} matching)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Dialog 1: Create User ── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Create New User
            </DialogTitle>
            <DialogDescription>
              Register a new account and assign an initial role (`user` or `admin`).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create_full_name">Full Name</Label>
              <Input
                id="create_full_name"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_email">Email Address *</Label>
              <Input
                id="create_email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_password">Initial Password *</Label>
              <Input
                id="create_password"
                type="password"
                required
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_role">Assigned Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(val: any) => setCreateForm({ ...createForm, role: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoadingId === 'create'}>
                {actionLoadingId === 'create' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Edit User ── */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Edit User Profile
            </DialogTitle>
            <DialogDescription>Modify details, role permissions, and access status for {editingUser?.email}.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>User Role</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(val: any) => setEditForm({ ...editForm, role: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(val: any) => setEditForm({ ...editForm, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoadingId === editingUser.id}>
                  {actionLoadingId === editingUser.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Role Change Confirmation ── */}
      <Dialog open={!!confirmRoleUser} onOpenChange={(open) => !open && setConfirmRoleUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmRoleUser?.role === 'admin' ? (
                <><ShieldOff className="h-5 w-5 text-destructive" /> Remove Admin Privileges</>
              ) : (
                <><ShieldCheck className="h-5 w-5 text-primary" /> Grant Admin Privileges</>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmRoleUser?.role === 'admin' ? (
                <>
                  Are you sure you want to remove admin access from{' '}
                  <span className="font-semibold text-foreground">{confirmRoleUser?.full_name || confirmRoleUser?.email}</span>?
                  They will no longer be able to access the admin panel.
                </>
              ) : (
                <>
                  Are you sure you want to promote{' '}
                  <span className="font-semibold text-foreground">{confirmRoleUser?.full_name || confirmRoleUser?.email}</span> to Admin?
                  They will have full access to the admin dashboard.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRoleUser(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmRoleUser?.role === 'admin' ? 'destructive' : 'default'}
              onClick={() => confirmRoleUser && toggleRole(confirmRoleUser)}
            >
              {confirmRoleUser?.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 4: View Details & Activity Logs ── */}
      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> User Profile & Activity
            </DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6 pt-2">
              {/* Info card */}
              <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">{viewingUser.full_name || 'Unnamed User'}</p>
                  <Badge variant="outline" className="capitalize font-bold">
                    {viewingUser.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                  <div><span className="text-muted-foreground">Status:</span> <span className="font-semibold capitalize">{viewingUser.status ?? 'active'}</span></div>
                  <div><span className="text-muted-foreground">Joined:</span> <span className="font-semibold">{new Date(viewingUser.created_at).toLocaleDateString()}</span></div>
                  <div><span className="text-muted-foreground">Company:</span> <span className="font-semibold">{viewingUser.company || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground">Country:</span> <span className="font-semibold">{viewingUser.country || 'N/A'}</span></div>
                </div>
              </div>

              {/* Activity History */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Recent Login & Activity History
                </h3>
                {logsLoading ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">Loading activity history...</div>
                ) : activityLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No logged activity events recorded yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
                        <span className="font-medium capitalize">{log.event}</span>
                        <span className="text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog 5: Confirm Delete ── */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Delete User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-foreground">{deletingUser?.email}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={actionLoadingId === deletingUser?.id}>
              {actionLoadingId === deletingUser?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
