import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/client';

export type PlannedDate = {
  id: number;
  date: string;
  description: string | null;
};

export function usePlannedDates() {
  return useQuery({
    queryKey: ['planned-dates'],
    queryFn: async (): Promise<PlannedDate[]> => {
      const { data, error } = await supabase
        .from('planned_hikes_date')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAddPlannedDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { date: string; description?: string }) => {
      const { error } = await supabase
        .from('planned_hikes_date')
        .insert({
          date: input.date,
          description: input.description || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planned-dates'] });
    },
  });
}

export function useDeletePlannedDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('planned_hikes_date')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planned-dates'] });
    },
  });
}
