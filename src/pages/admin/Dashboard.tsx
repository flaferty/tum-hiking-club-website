import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useHikes, useDeleteHike } from '@/features/hikes/useHikes';
import { useUsers, useAssignRole, useRemoveRole } from '@/hooks/useUsers';
import { Difficulty } from '@/lib/types';
import { Database } from '@/services/supabase/types';
import { HikeParticipantsModal } from '@/features/hikes/HikeParticipantsModal';
import { AdminEmail } from '@/pages/admin/AdminEmail';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Mountain,
  Users,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Shield,
  ShieldCheck,
  ShieldAlert,
  X,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
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
} from '@/components/ui/alert-dialog';

type AppRole = Database['public']['Enums']['app_role'];



const difficultyVariant: Record<Difficulty, 'easy' | 'moderate' | 'hard' | 'expert'> = {
  easy: 'easy',
  moderate: 'moderate',
  hard: 'hard',
  expert: 'expert',
};

const roleIcons: Record<AppRole, typeof Shield> = {
  admin: ShieldAlert,
  member: ShieldCheck,
  user: Shield,
};

const roleColors: Record<AppRole, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  member: 'bg-green-100 text-green-700 border-green-200',
  user: 'bg-muted text-muted-foreground border-border',
};

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: hikes = [], isLoading: hikesLoading } = useHikes();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const deleteHikeMutation = useDeleteHike();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();
  const [viewParticipantsHike, setViewParticipantsHike] = useState<{id: string, name: string} | null>(null);

  const currentUserProfile = users.find(u => u.user_id === user?.id);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const handleDelete = async (hikeId: string) => {
    try {
      await deleteHikeMutation.mutateAsync(hikeId);
      toast({
        title: 'Hike deleted',
        description: 'The hike has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete hike.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignRole = async (userId: string, role: AppRole) => {
    try {
      await assignRoleMutation.mutateAsync({ userId, role });
      toast({
        title: 'Role assigned',
        description: `Successfully assigned ${role} role.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign role.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    try {
      await removeRoleMutation.mutateAsync({ userId, role });
      toast({
        title: 'Role removed',
        description: `Successfully removed ${role} role.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove role.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage hikes and users</p>
          </div>
          
          <Link to="/profile">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-3">
               <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={currentUserProfile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-right min-w-0">
                  <p className="text-sm font-medium truncate max-w-[150px] sm:max-w-[250px]">{user.email}</p>
                  <p className="text-xs text-muted-foreground">View Profile</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <Tabs defaultValue="hikes">
          <TabsList className="mb-6">
            <TabsTrigger value="hikes" className="gap-2">
              <Mountain className="h-4 w-4" />
              Hikes
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="emails" className="gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hikes">
            <div className="mb-4 flex justify-end">
              <Link to="/admin/add-hike">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Hike
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {hikes.map((hike) => (
                <Card key={hike.id} className="overflow-hidden">
                  <CardContent className="flex flex-col gap-0 p-0 md:flex-row md:items-center md:gap-4">
                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted md:h-24 md:w-32">
                      {hike.image_url ? (
                        <img
                          src={hike.image_url}
                          alt={hike.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:py-4 md:pr-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-semibold">{hike.name}</h3>
                          <Badge variant={difficultyVariant[hike.difficulty]} className="text-xs">
                            {hike.difficulty}
                          </Badge>
                          <Badge variant={hike.status === 'upcoming' ? 'upcoming' : 'completed'} className="text-xs">
                            {hike.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(hike.date), 'dd/MM/yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {hike.location_name}
                          </span>
                          <span>{hike.distance} km</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/admin/edit-hike/${hike.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </Link>

                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => setViewParticipantsHike({ id: hike.id, name: hike.name })}
                          >
                            <Users className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="gap-1">
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Hike</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{hike.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(hike.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              
              {hikes.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                  <Mountain className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No hikes yet. Add your first hike!</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading users...</div>
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No users found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((u) => (
                  <Card key={u.id} className="overflow-hidden">
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                      <div className="flex w-full items-center gap-4 md:w-auto"></div>
                        <Avatar className="h-12 w-12 shrink-0">
                          <AvatarImage src={u.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(u.full_name, u.email)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-semibold truncate">
                              {u.full_name || 'No name'}
                            </h3>
                            {u.user_id === user?.id && (
                              <Badge variant="outline" className="text-xs shrink-0">You</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground break-all">{u.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {format(new Date(u.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      
                      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:ml-auto">
                        <div className="flex flex-wrap gap-2">
                          {u.roles.map((role) => {
                            const RoleIcon = roleIcons[role];
                            return (
                              <Badge
                                key={role}
                                variant="outline"
                                className={`gap-1 ${roleColors[role]}`}
                              >
                                <RoleIcon className="h-3 w-3" />
                                {role}
                                {u.user_id !== user?.id && (
                                  <button
                                    onClick={() => handleRemoveRole(u.user_id, role)}
                                    className="ml-1 hover:text-destructive"
                                    disabled={removeRoleMutation.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      {u.user_id !== user?.id && (
                        <Select
                          onValueChange={(value) => handleAssignRole(u.user_id, value as AppRole)}
                          disabled={assignRoleMutation.isPending}
                        >
                          <SelectTrigger className=" w-full md:w-[140px]">
                            <SelectValue placeholder="Add role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(['admin', 'user', 'member'] as AppRole[])
                              .filter((role) => !u.roles.includes(role))
                              .map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="emails">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-heading font-semibold">Email Communication</h2>
                <p className="text-muted-foreground">
                  Send photos and updates to all participants of past hikes.
                </p>
              </div>
              
              {/* This renders the form we created */}
              <AdminEmail />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <HikeParticipantsModal 
        hikeId={viewParticipantsHike?.id || null}
        hikeName={viewParticipantsHike?.name || ''}
        isOpen={!!viewParticipantsHike}
        onClose={() => setViewParticipantsHike(null)}
      />
    </div>
  );
}
