import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/services/supabase/client';
import { useAuth } from '@/features/auth/AuthContext';
import { useUserStats } from '@/hooks/useUserEnrollments';
import { badges } from '@/lib/data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  Mountain, 
  TrendingUp, 
  MapPin, 
  Award, 
  User,
  Footprints,
  Flame,
  Trophy,
  Calendar,
  Clock,
  Loader2,
  Camera,
  LucideIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const iconMap: Record<string, LucideIcon> = {
  footprints: Footprints,
  flame: Flame,
  mountain: Mountain,
  award: Trophy,
};

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { stats, activityData, completedHikes, upcomingHikes, waitlistedHikes } = useUserStats();
  const { toast } = useToast();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // get profile data
  useEffect(() => {
    if (user) getProfile(); 
  }, [user]);

  const getProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.warn('Error fetching profile:', error);
      } else if (data) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl } as never)
        .eq('user_id', user!.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({ title: 'Success', description: 'Profile picture updated!' });

    } catch (error: unknown) { 
      let errorMessage = 'An error occurred while uploading.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Calculate badges earned based on real stats
  const badgesEarned = badges.filter(badge => {
    if (badge.id === '1') return stats.hikesCompleted >= 1; // First Steps
    if (badge.id === '2') return stats.hikesCompleted >= 5; // Week Warrior (5 hikes)
    if (badge.id === '3') return stats.totalElevation >= 1000; // Peak Bagger
    if (badge.id === '4') return stats.hikesCompleted >= 10;
    if (badge.id === '5') return stats.totalDistance >= 50;   // Explorer
    if (badge.id === '6') return stats.totalElevation >= 5000; // Sherpa
    if (badge.id === '7') return stats.totalDistance >= 100;  // Globetrotter
    if (badge.id === '8') return stats.hikesCompleted >= 10; // Club Veteran
    return false;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Profile Header */}
       <section className="relative overflow-hidden bg-gradient-to-b from-primary/90 via-primary/70 to-background py-20">
        <img
          src="/images/hero/mountains_2.jpg"
          alt="Mountainous landscape fading out"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"

        />
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card/20">
              {/* Avatar Upload Section */}
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card/20 border-4 border-white/20 overflow-hidden shadow-xl bg-white/10">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <User className="h-10 w-10 text-snow" />
                )}
                
                {/* Upload Overlay */}
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-snow md:text-3xl">
                {user.user_metadata?.full_name || user.email}
              </h1>
              <p className="text-snow/70">
                {stats.hikesCompleted} hikes completed · {badgesEarned} badges earned
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{stats.hikesCompleted}</p>
                <p className="text-sm text-muted-foreground">Hikes Completed</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-forest/10">
                <Mountain className="h-6 w-6 text-forest" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{stats.totalElevation.toLocaleString()}m</p>
                <p className="text-sm text-muted-foreground">Total Elevation</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky/10">
                <MapPin className="h-6 w-6 text-sky" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{stats.totalDistance.toFixed(1)}km</p>
                <p className="text-sm text-muted-foreground">Total Distance</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-trail/10">
                <Calendar className="h-6 w-6 text-trail" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{stats.upcomingCount}</p>
                <p className="text-sm text-muted-foreground">Upcoming Hikes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* My Hikes */}
      <section className="container mx-auto px-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              My Hikes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upcoming Hikes */}
            {upcomingHikes.length > 0 && (
              <div>
                <h4 className="mb-3 font-heading font-semibold text-primary">Upcoming</h4>
                <div className="space-y-2">
                  {upcomingHikes.map(({ hike }) => (
                    <div key={hike.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Mountain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{hike.name}</p>
                          <p className="text-sm text-muted-foreground">{hike.location_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(hike.date), 'dd/MM/yyyy')}</p>
                        <Badge variant="upcoming" className="text-xs">Enrolled</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Waitlisted Hikes */}
            {waitlistedHikes.length > 0 && (
              <div>
                <h4 className="mb-3 font-heading font-semibold text-yellow-600">Waitlisted</h4>
                <div className="space-y-2">
                  {waitlistedHikes.map(({ hike }) => (
                    <div key={hike.id} className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">{hike.name}</p>
                          <p className="text-sm text-muted-foreground">{hike.location_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(hike.date), 'dd/MM/yyyy')}</p>
                        <Badge variant="outline" className="border-yellow-500/50 text-xs text-yellow-600">Waitlist</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Hikes */}
            {completedHikes.length > 0 && (
              <div>
                <h4 className="mb-3 font-heading font-semibold text-green-600">Completed</h4>
                <div className="space-y-2">
                  {completedHikes.map(({ hike }) => (
                    <div key={hike.id} className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{hike.name}</p>
                          <p className="text-sm text-muted-foreground">{hike.distance}km · {hike.elevation}m elevation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(hike.date), 'dd/MM/yyyy')}</p>
                        <Badge variant="completed" className="text-xs">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcomingHikes.length === 0 && waitlistedHikes.length === 0 && completedHikes.length === 0 && (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <Mountain className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No hikes yet. Enroll in a hike to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      
      {/* Trophy Case */}
      <section className="container mx-auto px-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-trail" />
              Trophy Case
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {badges.map((badge) => {
                const IconComponent = iconMap[badge.icon] || Award;
                const isEarned = 
                  (badge.id === '1' && stats.hikesCompleted >= 1) ||
                  (badge.id === '2' && stats.hikesCompleted >= 5) ||
                  (badge.id === '3' && stats.totalElevation >= 1000) ||
                  (badge.id === '4' && stats.hikesCompleted >= 10) || 
                  (badge.id === '5' && stats.totalDistance >= 50) ||
                  (badge.id === '6' && stats.totalElevation >= 5000) ||
                  (badge.id === '7' && stats.totalDistance >= 100) ||
                  (badge.id === '8' && stats.hikesCompleted >= 10);
                
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center rounded-lg border p-4 text-center transition-all ${
                      isEarned 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-muted/30 opacity-50'
                    }`}
                  >
                    <IconComponent className={`mb-2 h-8 w-8 ${isEarned ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h4 className="font-heading font-semibold">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Activity Chart */}
      <section className="container mx-auto px-4 pb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Activity Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    className="text-sm fill-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-sm fill-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="hikes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
