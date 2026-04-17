import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getChefOrders,
  updateOrderStatus,
  acceptOrder,
  rejectOrder,
} from '@/api/mock-server';
import type { ChefOrderFilters, OrderStatus } from '@/api/types';

export function useChefOrders(
  chefId: string,
  filters?: ChefOrderFilters,
) {
  return useQuery({
    queryKey: ['chef-orders', chefId, filters],
    queryFn: () => getChefOrders(chefId, filters),
    enabled: !!chefId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      subOrderId,
      status,
    }: {
      orderId: string;
      subOrderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, subOrderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['chef-orders'] });
    },
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, subOrderId }: { orderId: string; subOrderId: string }) =>
      acceptOrder(orderId, subOrderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['chef-orders'] });
    },
  });
}

export function useRejectOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, subOrderId }: { orderId: string; subOrderId: string }) =>
      rejectOrder(orderId, subOrderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['chef-orders'] });
    },
  });
}
