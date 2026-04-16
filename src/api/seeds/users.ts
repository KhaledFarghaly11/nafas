import type { CairoArea, User } from '@/types';

export const CHEF_ACCOUNTS = [
  { phone: '01000000001', name: 'أم سمية', kitchenId: 'kitchen-1' },
  { phone: '01000000002', name: 'حاج محمد', kitchenId: 'kitchen-2' },
  { phone: '01000000003', name: 'ست نونه', kitchenId: 'kitchen-3' },
  { phone: '01000000004', name: 'حنان عبدالله', kitchenId: 'kitchen-4' },
  { phone: '01000000005', name: 'سعاد إبراهيم', kitchenId: 'kitchen-5' },
  { phone: '01000000006', name: 'فاطمة حسن', kitchenId: 'kitchen-6' },
] as const;

export const CUSTOMER_ACCOUNTS = [
  { phone: '01100000001', name: 'فاطمة أحمد', area: 'Maadi' as CairoArea },
  { phone: '01100000002', name: 'عمر خالد', area: 'Zamalek' as CairoArea },
  { phone: '01100000003', name: 'نورة سعيد', area: 'Heliopolis' as CairoArea },
] as const;

export const USER_SEEDS: User[] = [
  ...CHEF_ACCOUNTS.map((c) => ({
    id: `chef-${c.phone}`,
    phone: c.phone,
    role: 'chef' as const,
    name: c.name,
    kitchenId: c.kitchenId,
    createdAt: '2026-04-01T00:00:00.000Z',
  })),
  ...CUSTOMER_ACCOUNTS.map((c) => ({
    id: `customer-${c.phone}`,
    phone: c.phone,
    role: 'customer' as const,
    name: c.name,
    area: c.area,
    createdAt: '2026-04-01T00:00:00.000Z',
  })),
];
