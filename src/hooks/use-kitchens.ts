import { useQuery } from '@tanstack/react-query';
import {
  getKitchens,
  getKitchenDetail,
  searchKitchens,
} from '@/api/mock-server';
import type { KitchenFilters } from '@/api/types';

export function useKitchens(filters?: KitchenFilters) {
  return useQuery({
    queryKey: ['kitchens', filters],
    queryFn: () => getKitchens(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useKitchenDetail(id: string) {
  return useQuery({
    queryKey: ['kitchen', id],
    queryFn: () => getKitchenDetail(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSearchKitchens(query: string) {
  return useQuery({
    queryKey: ['kitchens', 'search', query],
    queryFn: () => searchKitchens(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000,
  });
}
