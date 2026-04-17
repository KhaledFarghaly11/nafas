import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFavorites,
  followKitchen,
  unfollowKitchen,
} from '@/api/mock-server';

export function useFavorites(userId: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFollowKitchen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, kitchenId }: { userId: string; kitchenId: string }) =>
      followKitchen(userId, kitchenId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['kitchens'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen', variables.kitchenId] });
    },
  });
}

export function useUnfollowKitchen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, kitchenId }: { userId: string; kitchenId: string }) =>
      unfollowKitchen(userId, kitchenId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['kitchens'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen', variables.kitchenId] });
    },
  });
}
