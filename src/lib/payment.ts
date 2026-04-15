import type { PaymentMethod, PaymentStatus } from '@/types';

export async function simulatePayment(
  method: PaymentMethod,
): Promise<{ success: boolean; status: PaymentStatus }> {
  const delay = 500 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (method === 'cash') {
    return { success: true, status: 'pending' };
  }

  return Math.random() < 0.8
    ? { success: true, status: 'paid' }
    : { success: false, status: 'failed' };
}
