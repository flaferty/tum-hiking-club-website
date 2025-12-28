import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/client';
import { Hike, Waypoint } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useHikes() {
  return useQuery({
    queryKey: ['hikes'],
    queryFn: async (): Promise<Hike[]> => {
      const { data: hikesRaw, error } = await supabase
        .from('hikes')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const hikes = hikesRaw ?? [];
      if (hikes.length === 0) return [];

      // Fetch waypoints for all hikes
      const hikeIds = hikes.map(h => h.id);
      const { data: waypoints, error: waypointsError } = await supabase
        .from('waypoints')
        .select('*')
        .in('hike_id', hikeIds);

      if (waypointsError) throw waypointsError;

      // Fetch images for all hikes
      const { data: images, error: imagesError } = await supabase
        .from('hike_images')
        .select('*')
        .in('hike_id', hikeIds)
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;

      // Fetch enrollment counts
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('hike_enrollments')
        .select('hike_id')
        .eq('status', 'enrolled');

      if (enrollmentsError) throw enrollmentsError;

      // Count enrollments per hike
      const enrollmentCounts: Record<string, number> = {};
      enrollments.forEach(e => {
        enrollmentCounts[e.hike_id] = (enrollmentCounts[e.hike_id] || 0) + 1;
      });

      // Map to Hike type
      return hikes.map(hike => {
        const hikeWaypoints = waypoints
          .filter(w => w.hike_id === hike.id)
          .map(w => ({
            id: w.id,
            hike_id: w.hike_id,
            name: w.name,
            latitude: w.latitude,
            longitude: w.longitude,
            type: w.type as 'start' | 'end' | 'overnight_stop',
            day_number: w.day_number,
            created_at: w.created_at,
          }));

        const hikeImages = images
          .filter(i => i.hike_id === hike.id)
          .map(i => ({
            id: i.id,
            hike_id: i.hike_id,
            image_url: i.image_url,
            display_order: i.display_order,
            created_at: i.created_at,
          }));

        // Calculate status based on date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hikeDate = new Date(hike.date);
        const endDate = hike.end_date ? new Date(hike.end_date) : hikeDate;
        const status = endDate < today ? 'completed' : 'upcoming';

        const count = enrollmentCounts[hike.id] || 0;

        return {
          id: hike.id,
          name: hike.name,
          date: hike.date,
          end_date: hike.end_date,
          location_name: hike.location_name,
          location_lat: hike.location_lat,
          location_lng: hike.location_lng,
          difficulty: hike.difficulty as 'easy' | 'moderate' | 'hard' | 'expert',
          distance: hike.distance,
          elevation: hike.elevation,
          duration: hike.duration,
          description: hike.description,
          image_url: hike.image_url,
          max_participants: hike.max_participants,
          organizer_name: hike.organizer_name,
          organizer_id: hike.organizer_id,
          status: status as 'upcoming' | 'completed',
          enrollment_count: count,
          current_participants: count,
          waypoints: hikeWaypoints,
          images: hikeImages,
          created_at: hike.created_at,
          updated_at: hike.updated_at,
        };
      });
    },
  });
}

export function useHike(id: string | undefined) {
  return useQuery({
    queryKey: ['hike', id],
    queryFn: async (): Promise<Hike | null> => {
      if (!id) return null;

      const { data: hike, error } = await supabase
        .from('hikes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!hike) return null;

      // Fetch waypoints
      const { data: waypoints } = await supabase
        .from('waypoints')
        .select('*')
        .eq('hike_id', id);

      // Fetch images
      const { data: images } = await supabase
        .from('hike_images')
        .select('*')
        .eq('hike_id', id)
        .order('display_order', { ascending: true });

      // Fetch enrollment count
      const { count } = await supabase
        .from('hike_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('hike_id', id)
        .eq('status', 'enrolled');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const hikeDate = new Date(hike.date);
      const endDate = hike.end_date ? new Date(hike.end_date) : hikeDate;
      const status = endDate < today ? 'completed' : 'upcoming';

      const enrollmentCount = count || 0;

      return {
        id: hike.id,
        name: hike.name,
        date: hike.date,
        end_date: hike.end_date,
        location_name: hike.location_name,
        location_lat: hike.location_lat,
        location_lng: hike.location_lng,
        difficulty: hike.difficulty as 'easy' | 'moderate' | 'hard' | 'expert',
        distance: hike.distance,
        elevation: hike.elevation,
        duration: hike.duration,
        description: hike.description,
        image_url: hike.image_url,
        max_participants: hike.max_participants,
        organizer_name: hike.organizer_name,
        organizer_id: hike.organizer_id,
        status: status as 'upcoming' | 'completed',
        enrollment_count: enrollmentCount,
        current_participants: enrollmentCount,
        waypoints: waypoints?.map(w => ({
          id: w.id,
          hike_id: w.hike_id,
          name: w.name,
          latitude: w.latitude,
          longitude: w.longitude,
          type: w.type as 'start' | 'end' | 'overnight_stop',
          day_number: w.day_number,
          created_at: w.created_at,
        })) || [],
        images: images?.map(i => ({
          id: i.id,
          hike_id: i.hike_id,
          image_url: i.image_url,
          display_order: i.display_order,
          created_at: i.created_at,
        })) || [],
        created_at: hike.created_at,
        updated_at: hike.updated_at,
      };
    },
    enabled: !!id,
  });
}

export function useEnrollment(hikeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enrollmentQuery = useQuery({
    queryKey: ['enrollment', hikeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !hikeId) return null;

      const { data, error } = await supabase
        .from('hike_enrollments')
        .select('*')
        .eq('hike_id', hikeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!hikeId,
  });

  const enrollMutation = useMutation({
    mutationFn: async ({ hikeId, maxParticipants }: { hikeId: string; maxParticipants: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check current enrollment count
      const { count, error: countError } = await supabase
        .from('hike_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('hike_id', hikeId)
        .eq('status', 'enrolled');

      if (countError) throw countError;

      const currentCount = count || 0;
      const status = currentCount >= maxParticipants ? 'waitlisted' : 'enrolled';

      const { error } = await supabase
        .from('hike_enrollments')
        .insert({ hike_id: hikeId, user_id: user.id, status });

      if (error) throw error;
      
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', hikeId] });
      queryClient.invalidateQueries({ queryKey: ['hikes'] });
      queryClient.invalidateQueries({ queryKey: ['hike', hikeId] });
      toast({ 
        title: status === 'waitlisted' ? 'Added to Waitlist' : 'Enrolled!', 
        description: status === 'waitlisted' 
          ? 'The hike is full. You\'ve been added to the waitlist.'
          : 'You have enrolled in this hike!' 
      });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const unenrollMutation = useMutation({
    mutationFn: async (hikeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('hike_enrollments')
        .delete()
        .eq('hike_id', hikeId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', hikeId] });
      queryClient.invalidateQueries({ queryKey: ['hikes'] });
      queryClient.invalidateQueries({ queryKey: ['hike', hikeId] });
      toast({ title: 'Success', description: 'You have unenrolled from this hike.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return {
    enrollment: enrollmentQuery.data,
    isLoading: enrollmentQuery.isLoading,
    enroll: enrollMutation.mutate,
    unenroll: unenrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    isUnenrolling: unenrollMutation.isPending,
  };
}

export function useDeleteHike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hikeId: string) => {
      const { error } = await supabase
        .from('hikes')
        .delete()
        .eq('id', hikeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hikes'] });
    },
  });
}
