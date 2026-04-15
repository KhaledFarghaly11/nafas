import type { AuthResult, CairoArea, Order } from '@/types';

export interface LoginRequest {
  phone: string;
  otp: string;
}

export type LoginResponse = AuthResult;

export interface SignupRequest {
  name: string;
  area: string;
  phone: string;
}

export type SignupResponse = AuthResult;

export interface KitchenFilters {
  area?: CairoArea;
  isOpen?: boolean;
  cuisineTag?: string;
  minRating?: number;
  isVerified?: boolean;
  search?: string;
}

export interface CreateOrderItemInput {
  dishId: string;
  quantity: number;
}

export interface CreateOrderKitchenInput {
  kitchenId: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderInput {
  customerId: string;
  deliveryAddress: string;
  paymentMethod: 'cash' | 'vodafone_cash' | 'instapay';
  instructions?: string;
  schedule: 'asap' | 'today' | 'tomorrow';
  deliveryFee: number;
  items: CreateOrderKitchenInput[];
}

export interface CreateOrderResponse {
  order: Order;
}

export interface ChefOrderFilters {
  status?: 'pending' | 'active' | 'completed';
}

export interface CreateDishInput {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: string;
  categoryEn: string;
  prepTime: number;
  maxPortions: number;
  available?: boolean;
}

export type UpdateDishInput = Partial<CreateDishInput>;

export interface DayScheduleInput {
  day: 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface ChefStats {
  weeklyIncome: number;
  weeklyOrders: number;
  repeatCustomerPercent: number;
  topDish: { id: string; name: string; nameEn: string; orderCount: number } | null;
}

export interface ReorderResponse {
  addedItems: {
    dishId: string;
    dishName: string;
    price: number;
    quantity: number;
    kitchenId: string;
    kitchenName: string;
  }[];
  skippedItems: { dishId: string; dishName: string; reason: 'unavailable' | 'deleted' }[];
}

export interface ApiError {
  success: false;
  error: { code: string };
}

export type ApiResult<T> = ({ success: true } & T) | ApiError;
