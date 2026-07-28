'use client';

import { useEffect, useState } from 'react';
import { Search, Users, Shield, ShieldCheck, ShieldOff, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { UserProfile } from '@/lib/types';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers((data as UserProfile[]) ?? []);
    setLoading(false);
  }

  async function toggleRole(targetUser: UserProfile) {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(targetUser.id);
    try {
      const { error } = await supabase.rpc('admin_set_user_role', {
        p_target_user_id: targetUser.id,
        p_new_role: newRole,
      });
      if (error) throw error;
      setUsers(users.map((u) => (u.id === targetUser.id ? { ...u, role: newRole as 'user' | 'admin' } : u)));
      toast.success(
        newRole === 'admin'
          ? `${targetUser.full_name || targetUser.email} is now an admin.`
          : `${targetUser.full_name || targetUser.email} is now a regular user.`
      );
    } catch {
      toast.error('Failed to update role. Make sure you are an admin.');
    } finally {
      setUpdatingId(null);
      setConfirmUser(null);
    }
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-muted-foreground">
          View all registered users and manage admin access. {users.length} total, {adminCount} admins.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => {
            const isSelf = u.id === currentUser?.id;
            const isAdmin = u.role === 'admin';
            return (
              <Card key={u.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${isAdmin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      {(u.full_name || u.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{u.full_name || 'Unknown'}</p>
                        {isSelf && (
                          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      {u.country && <p className="text-xs text-muted-foreground">{u.country}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && <Shield className="h-4 w-4 text-primary" />}
                    <Badge variant={isAdmin ? 'default' : 'secondary'}>
                      {u.role}
                    </Badge>
                    {updatingId === u.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Button
                        variant={isAdmin ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => setConfirmUser(u)}
                        disabled={isSelf}
                        className="ml-1"
                      >
                        {isAdmin ? (
                          <>
                            <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation dialog */}
      <Dialog open={!!confirmUser} onOpenChange={(open) => !open && setConfirmUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmUser?.role === 'admin' ? (
                <><ShieldOff className="h-5 w-5 text-destructive" /> Remove Admin Access</>
              ) : (
                <><ShieldCheck className="h-5 w-5 text-primary" /> Grant Admin Access</>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmUser?.role === 'admin' ? (
                <>
                  Are you sure you want to remove admin access from{' '}
                  <span className="font-medium text-foreground">{confirmUser?.full_name || confirmUser?.email}</span>?
                  They will no longer be able to access the admin panel.
                </>
              ) : (
                <>
                  Are you sure you want to grant admin access to{' '}
                  <span className="font-medium text-foreground">{confirmUser?.full_name || confirmUser?.email}</span>?
                  They will have full access to the admin panel including managing users, jobs, and projects.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmUser(null)}>Cancel</Button>
            <Button
              variant={confirmUser?.role === 'admin' ? 'destructive' : 'default'}
              onClick={() => confirmUser && toggleRole(confirmUser)}
            >
              {confirmUser?.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
