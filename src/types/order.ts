export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'cooking'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'vodafone_cash' | 'instapay';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type SchedulePreference = 'asap' | 'today' | 'tomorrow';

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
}

export interface SubOrder {
  kitchenId: string;
  chefId: string;
  status: OrderStatus;
  items: OrderItem[];
  kitchenTotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  subOrders: SubOrder[];
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryFee: number;
  instructions: string | null;
  schedule: SchedulePreference;
  createdAt: string;
  updatedAt: string;
}
