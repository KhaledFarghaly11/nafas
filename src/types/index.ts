export type { UserRole, User, UserSession, AuthResult } from './user';
export type { CairoArea, Kitchen } from './kitchen';
export type { Dish, DishCategory } from './dish';
export type {
  Order,
  SubOrder,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  SchedulePreference,
} from './order';

export interface Review {
  id: string;
  kitchenId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface DaySchedule {
  day: 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface Schedule {
  kitchenId: string;
  days: DaySchedule[];
}

export interface Follow {
  userId: string;
  kitchenId: string;
  createdAt: string;
}
