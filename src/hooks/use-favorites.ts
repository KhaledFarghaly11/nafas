import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFavorites,
  followKitchen,
  unfollowKitchen,
} from '@/api/mock-server';
import type { ApiError } from '@/api/types';

// Shared invalidation helper
const invalidateFavoriteRelatedQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  kitchenId: string
) => {
  queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
  queryClient.invalidateQueries({ queryKey: ['kitchens'] });
  queryClient.invalidateQueries({ queryKey: ['kitchen', kitchenId] });
};

export function useFavorites(userId: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      const result = await getFavorites(userId);
      // If result is an ApiError, throw it so React Query enters error state
      if ((result as ApiError).success === false) {
        throw result;
      }
      return result;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFollowKitchen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, kitchenId }: { userId: string; kitchenId: string }) => {
      const result = await followKitchen(userId, kitchenId);
      // If result is an ApiError, throw it so React Query enters error state
      if ((result as ApiError).success === false) {
        throw result;
      }
      return result;
    },
    onSuccess: (_, variables) => {
      invalidateFavoriteRelatedQueries(queryClient, variables.userId, variables.kitchenId);
    },
  });
}

export function useUnfollowKitchen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, kitchenId }: { userId: string; kitchenId: string }) => {
      const result = await unfollowKitchen(userId, kitchenId);
      // If result is an ApiError, throw it so React Query enters error state
      if ((result as ApiError).success === false) {
        throw result;
      }
      return result;
    },
    onSuccess: (_, variables) => {
      invalidateFavoriteRelatedQueries(queryClient, variables.userId, variables.kitchenId);
    },
  });
}
