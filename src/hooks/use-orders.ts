import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrder,
  getOrders,
  getOrderDetail,
  reorder,
} from '@/api/mock-server';
import type { CreateOrderInput } from '@/api/types';
import { cartStore } from '@/stores/cart-store';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['chef-orders'] });
    },
  });
}

export function useOrders(userId: string, filters?: { status?: 'active' | 'past' }) {
  return useQuery({
    queryKey: ['orders', userId, filters],
    queryFn: () => getOrders(userId, filters),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });
}

export function useReorder(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reorder(orderId),
    onSuccess: (result) => {
      // Check if result has addedItems (indicating successful reorder)
      if ('addedItems' in result && Array.isArray(result.addedItems)) {
        for (const item of result.addedItems) {
          cartStore.getState().addItem(item);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
