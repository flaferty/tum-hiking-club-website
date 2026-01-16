import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/client';
import { Hike } from '@/lib/types';

interface EnrollmentWithHike {
  id: string;
  status: string;
  enrolled_at: string;
  hike: Hike;
}

export function useUserEnrollments() {
  return useQuery({
    queryKey: ['user-enrollments'],
    queryFn: async (): Promise<EnrollmentWithHike[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch user's enrollments
      const { data: enrollments, error: enrollError } = await supabase
        .from('hike_enrollments')
        .select('id, status, enrolled_at, hike_id')
        .eq('user_id', user.id);

      if (enrollError) throw enrollError;
      if (!enrollments || enrollments.length === 0) return [];

      // Fetch hike details for all enrollments
      const hikeIds = enrollments.map(e => e.hike_id);
      const { data: hikes, error: hikesError } = await supabase
        .from('hikes')
        .select('*')
        .in('id', hikeIds);

      if (hikesError) throw hikesError;

      // Map enrollments with hike details
      return enrollments.map(enrollment => {
        const hike = hikes?.find(h => h.id === enrollment.hike_id);
        if (!hike) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hikeDate = new Date(hike.date);
        const status = hikeDate < today ? 'completed' : 'upcoming';

        return {
          id: enrollment.id,
          status: enrollment.status,
          enrolled_at: enrollment.enrolled_at,
          hike: {
            ...hike,
            status,
            difficulty: hike.difficulty as Hike['difficulty'],
            waypoints: [],
            images: [],
            enrollment_count: 0,
          } as Hike,
        };
      }).filter(Boolean) as EnrollmentWithHike[];
    },
  });
}

export function useUserStats() {
  const { data: enrollments = [] } = useUserEnrollments();

  const completedHikes = enrollments.filter(
    e => (e.status === 'enrolled' || e.status === 'verified') && e.hike.status === 'completed'
  );

  const upcomingHikes = enrollments.filter(
    e => e.status === 'enrolled' && e.hike.status === 'upcoming'
  );

  const waitlistedHikes = enrollments.filter(e => e.status === 'waitlisted');

  const totalDistance = completedHikes.reduce((sum, e) => sum + e.hike.distance, 0);
  const totalElevation = completedHikes.reduce((sum, e) => sum + e.hike.elevation, 0);

  // Calculate activity by month
  const activityByMonth: Record<string, number> = {};
  completedHikes.forEach(e => {
    const date = new Date(e.hike.date);
    const monthKey = date.toLocaleString('en-US', { month: 'short' });
    activityByMonth[monthKey] = (activityByMonth[monthKey] || 0) + 1;
  });

  // Get last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString('en-US', { month: 'short' });
    months.push({ month: monthKey, hikes: activityByMonth[monthKey] || 0 });
  }

  return {
    completedHikes,
    upcomingHikes,
    waitlistedHikes,
    stats: {
      hikesCompleted: completedHikes.length,
      totalDistance,
      totalElevation,
      upcomingCount: upcomingHikes.length,
      waitlistedCount: waitlistedHikes.length,
    },
    activityData: months,
  };
}
