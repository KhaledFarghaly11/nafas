import {
  getDB,
  getNextId,
  persistDB,
  getKitchen,
  getOrder,
  getSchedule,
  getDishesByKitchen,
  getReviewsByKitchen,
} from '@/api/mock-db';
import type {
  KitchenFilters,
  CreateOrderInput,
  ChefOrderFilters,
  CreateDishInput,
  UpdateDishInput,
  DayScheduleInput,
  ChefStats,
  ReorderResponse,
  ApiError,
} from '@/api/types';
import { cartStore } from '@/stores/cart-store';
import { sessionStore } from '@/stores/session-store';
import { useSettingsStore } from '@/stores/settings-store';
import type {
  AuthResult,
  Kitchen,
  Dish,
  DishCategory,
  DishCategoryEn,
  Review,
  Schedule,
  Order,
  OrderStatus,
  SubOrder,
  CairoArea,
} from '@/types';

async function withLatency(): Promise<void> {
  const delay = 200 + Math.random() * 700;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

function shouldInjectError(): boolean {
  const state = useSettingsStore.getState();
  if (!state.hydrated || !state.devErrorInjection) return false;
  return Math.random() < 0.15;
}

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['cooking', 'cancelled'],
  cooking: ['ready', 'cancelled'],
  ready: ['on_the_way', 'cancelled'],
  on_the_way: ['delivered'],
  delivered: [],
  cancelled: [],
};

function computeOverallStatus(subOrders: SubOrder[]): OrderStatus {
  const active = subOrders.filter((so) => so.status !== 'cancelled');
  if (active.length === 0) return 'cancelled';

  const pipeline: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'cooking',
    'ready',
    'on_the_way',
    'delivered',
  ];

  let leastAdvanced: OrderStatus = 'delivered';
  for (const so of active) {
    const idx = pipeline.indexOf(so.status);
    const currentIdx = pipeline.indexOf(leastAdvanced);
    if (idx < currentIdx) {
      leastAdvanced = so.status;
    }
  }
  return leastAdvanced;
}

function injectedError(): ApiError {
  return { success: false, error: { code: 'INJECTED_ERROR' } };
}

const VALID_DISH_CATEGORIES: DishCategory[] = [
  'مشويات',
  'حلويات',
  'مقبلات',
  'أصناف رئيسية',
  'شوربات',
  'سلطات',
  'مشروبات',
  'فطائر',
];

const VALID_DISH_CATEGORIES_EN: DishCategoryEn[] = [
  'Grills',
  'Sweets',
  'Appetizers',
  'Main Dishes',
  'Soups',
  'Salads',
  'Drinks',
  'Pastries',
];

function validateDishFields(
  input: {
    name?: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    price?: number;
    prepTime?: number;
    maxPortions?: number;
    available?: boolean;
    category?: string;
    categoryEn?: string;
  },
  required = false,
): string | null {
  if (required) {
    if (
      !input.name?.trim() ||
      !input.nameEn?.trim() ||
      !input.description?.trim() ||
      !input.descriptionEn?.trim()
    )
      return 'INVALID_INPUT';
    if (input.price === undefined || !Number.isFinite(input.price) || input.price <= 0)
      return 'INVALID_INPUT';
    if (input.prepTime === undefined || !Number.isFinite(input.prepTime) || input.prepTime <= 0)
      return 'INVALID_INPUT';
    if (
      input.maxPortions === undefined ||
      !Number.isFinite(input.maxPortions) ||
      input.maxPortions <= 0
    )
      return 'INVALID_INPUT';
    if (!input.category || !VALID_DISH_CATEGORIES.includes(input.category as DishCategory))
      return 'INVALID_INPUT';
    if (!input.categoryEn || !VALID_DISH_CATEGORIES_EN.includes(input.categoryEn as DishCategoryEn))
      return 'INVALID_INPUT';
  } else {
    if (input.name !== undefined && !input.name.trim()) return 'INVALID_INPUT';
    if (input.nameEn !== undefined && !input.nameEn.trim()) return 'INVALID_INPUT';
    if (input.description !== undefined && !input.description.trim()) return 'INVALID_INPUT';
    if (input.descriptionEn !== undefined && !input.descriptionEn.trim()) return 'INVALID_INPUT';
    if (input.price !== undefined && (!Number.isFinite(input.price) || input.price <= 0))
      return 'INVALID_INPUT';
    if (input.prepTime !== undefined && (!Number.isFinite(input.prepTime) || input.prepTime <= 0))
      return 'INVALID_INPUT';
    if (
      input.maxPortions !== undefined &&
      (!Number.isFinite(input.maxPortions) || input.maxPortions <= 0)
    )
      return 'INVALID_INPUT';
    if (
      input.category !== undefined &&
      !VALID_DISH_CATEGORIES.includes(input.category as DishCategory)
    )
      return 'INVALID_INPUT';
    if (
      input.categoryEn !== undefined &&
      !VALID_DISH_CATEGORIES_EN.includes(input.categoryEn as DishCategoryEn)
    )
      return 'INVALID_INPUT';
  }
  if (input.available !== undefined && typeof input.available !== 'boolean') return 'INVALID_INPUT';
  return null;
}

// ─── Auth ────────────────────────────────────────────────

export async function login(phone: string, otp: string): Promise<AuthResult> {
  await withLatency();
  if (shouldInjectError()) return { ...injectedError(), user: null };

  const normalizedPhone = phone?.trim();
  if (!normalizedPhone || !/^\d{11}$/.test(normalizedPhone)) {
    return { success: false, user: null, error: { code: 'INVALID_PHONE' } };
  }

  if (otp !== '123456') {
    return { success: false, user: null, error: { code: 'INVALID_OTP' } };
  }

  const db = getDB();
  const user = Array.from(db.users.values()).find((u) => u.phone === normalizedPhone);
  if (!user) {
    return { success: false, user: null, error: { code: 'UNKNOWN_PHONE' } };
  }

  sessionStore.getState().login(user);
  return { success: true, user, error: null };
}

export async function signup(name: string, area: string, phone: string): Promise<AuthResult> {
  await withLatency();
  if (shouldInjectError()) return { ...injectedError(), user: null };

  const normalizedPhone = phone?.trim();
  if (!normalizedPhone || !/^\d{11}$/.test(normalizedPhone)) {
    return { success: false, user: null, error: { code: 'INVALID_PHONE' } };
  }
  const trimmedName = name?.trim();
  if (!trimmedName || trimmedName.length < 1 || trimmedName.length > 100) {
    return { success: false, user: null, error: { code: 'INVALID_NAME' } };
  }
  const validAreas: CairoArea[] = [
    'Maadi',
    'Zamalek',
    'Heliopolis',
    'Nasr City',
    'Dokki',
    'Mohandessin',
    'New Cairo',
    '6th October',
  ];
  if (!validAreas.includes(area as CairoArea)) {
    return { success: false, user: null, error: { code: 'INVALID_AREA' } };
  }

  const db = getDB();
  const existing = Array.from(db.users.values()).find((u) => u.phone === normalizedPhone);
  if (existing) {
    return { success: false, user: null, error: { code: 'PHONE_EXISTS' } };
  }

  const id = await getNextId('user');
  const user = {
    id,
    phone: normalizedPhone,
    role: 'customer' as const,
    name: trimmedName,
    area,
    createdAt: new Date().toISOString(),
  };
  db.users.set(id, user);
  await persistDB();
  sessionStore.getState().login(user);
  return { success: true, user, error: null };
}

export async function logout(): Promise<{ success: true } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  sessionStore.getState().logout();
  cartStore.getState().clearOnLogout();
  return { success: true };
}

export async function getSession() {
  await withLatency();
  if (shouldInjectError()) return null;

  const state = sessionStore.getState();
  if (state.userId === null || state.role === null) return null;
  return {
    userId: state.userId,
    role: state.role,
    phone: state.phone,
    authenticatedAt: state.authenticatedAt,
  };
}

// ─── Kitchens ────────────────────────────────────────────

export async function getKitchens(
  filters?: KitchenFilters,
): Promise<{ kitchens: Kitchen[]; total: number } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  let kitchens = Array.from(db.kitchens.values());

  if (filters?.area) kitchens = kitchens.filter((k) => k.area === filters.area);
  if (filters?.isOpen !== undefined) kitchens = kitchens.filter((k) => k.isOpen === filters.isOpen);
  if (filters?.cuisineTag)
    kitchens = kitchens.filter((k) => k.cuisineTags.includes(filters.cuisineTag!));
  if (filters?.minRating) kitchens = kitchens.filter((k) => k.rating >= filters.minRating!);
  if (filters?.isVerified !== undefined)
    kitchens = kitchens.filter((k) => k.isVerified === filters.isVerified);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    const dishKitchenIds = new Set(
      Array.from(db.dishes.values())
        .filter((d) => d.name.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q))
        .map((d) => d.kitchenId),
    );
    kitchens = kitchens.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.nameEn.toLowerCase().includes(q) ||
        dishKitchenIds.has(k.id),
    );
  }

  return { kitchens, total: kitchens.length };
}

export async function getKitchenDetail(
  id: string,
): Promise<{ kitchen: Kitchen; dishes: Dish[]; reviews: Review[]; schedule: Schedule } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const kitchen = getKitchen(id);
  if (!kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  const dishes = getDishesByKitchen(id).filter((d) => d.available);
  const reviews = getReviewsByKitchen(id);
  const schedule = getSchedule(id);
  if (!schedule) return { success: false, error: { code: 'NOT_FOUND' } };

  return { kitchen, dishes, reviews, schedule };
}

export async function searchKitchens(
  query: string,
): Promise<{ kitchens: Kitchen[]; dishes: Dish[] } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const q = query.toLowerCase();

  const kitchens = Array.from(db.kitchens.values()).filter(
    (k) => k.name.toLowerCase().includes(q) || k.nameEn.toLowerCase().includes(q),
  );
  const dishes = Array.from(db.dishes.values()).filter(
    (d) => d.name.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q),
  );

  return { kitchens, dishes };
}

// ─── Menu / Reviews ──────────────────────────────────────

export async function getMenu(kitchenId: string): Promise<{ dishes: Dish[] } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const dishes = getDishesByKitchen(kitchenId).filter((d) => d.available);
  return { dishes };
}

export async function getReviews(
  kitchenId: string,
): Promise<{ reviews: Review[]; averageRating: number; totalCount: number } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const reviews = getReviewsByKitchen(kitchenId);
  const totalCount = reviews.length;
  const averageRating =
    totalCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount : 0;

  return { reviews, averageRating, totalCount };
}

// ─── Favorites ───────────────────────────────────────────

export async function getFavorites(userId: string): Promise<{ kitchens: Kitchen[] } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const follows = Array.from(db.follows.values()).filter((f) => f.userId === userId);
  const kitchens = follows
    .map((f) => db.kitchens.get(f.kitchenId))
    .filter((k): k is Kitchen => k !== undefined);

  return { kitchens };
}

export async function followKitchen(
  userId: string,
  kitchenId: string,
): Promise<{ success: true } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const user = db.users.get(userId);
  const kitchen = db.kitchens.get(kitchenId);
  if (!user || !kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  const existing = Array.from(db.follows.values()).find(
    (f) => f.userId === userId && f.kitchenId === kitchenId,
  );
  if (existing) return { success: false, error: { code: 'ALREADY_FOLLOWING' } };

  const followKey = `${userId}:${kitchenId}`;
  db.follows.set(followKey, {
    userId,
    kitchenId,
    createdAt: new Date().toISOString(),
  });
  await persistDB();
  return { success: true };
}

export async function unfollowKitchen(
  userId: string,
  kitchenId: string,
): Promise<{ success: true } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const followKey = `${userId}:${kitchenId}`;
  const existing = db.follows.get(followKey);
  if (!existing) return { success: false, error: { code: 'NOT_FOLLOWING' } };

  db.follows.delete(followKey);
  await persistDB();
  return { success: true };
}

// ─── Orders ──────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput): Promise<{ order: Order } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();

  if (!input.items || input.items.length === 0) {
    return { success: false, error: { code: 'INVALID_ITEMS' } };
  }

  const unavailableDishIds: string[] = [];
  const subOrders: SubOrder[] = [];
  const now = new Date().toISOString();

  for (const kitchenInput of input.items) {
    const kitchen = db.kitchens.get(kitchenInput.kitchenId);
    if (!kitchen || !kitchen.isOpen) {
      return { success: false, error: { code: 'KITCHEN_CLOSED' } };
    }

    if (!kitchenInput.items || kitchenInput.items.length === 0) {
      return { success: false, error: { code: 'INVALID_ITEMS' } };
    }

    const invalidItems: string[] = [];
    const orderItems = [];
    let kitchenTotal = 0;

    for (const itemInput of kitchenInput.items) {
      if (!itemInput.quantity || itemInput.quantity < 1 || !Number.isInteger(itemInput.quantity)) {
        invalidItems.push(itemInput.dishId);
        continue;
      }

      const dish = db.dishes.get(itemInput.dishId);
      if (!dish || !dish.available || dish.kitchenId !== kitchen.id) {
        unavailableDishIds.push(itemInput.dishId);
        continue;
      }
      orderItems.push({
        dishId: dish.id,
        dishName: dish.name,
        quantity: itemInput.quantity,
        unitPrice: dish.price,
      });
      kitchenTotal += dish.price * itemInput.quantity;
    }

    if (invalidItems.length > 0) {
      return { success: false, error: { code: 'INVALID_ITEMS', data: { invalidItems } } };
    }

    if (unavailableDishIds.length > 0) {
      return { success: false, error: { code: 'DISH_UNAVAILABLE', data: { unavailableDishIds } } };
    }

    subOrders.push({
      kitchenId: kitchenInput.kitchenId,
      chefId: kitchen!.chefId,
      status: 'pending',
      items: orderItems,
      kitchenTotal,
    });
  }

  const id = await getNextId('order');
  const order: Order = {
    id,
    customerId: input.customerId,
    subOrders,
    status: 'pending',
    deliveryAddress: input.deliveryAddress,
    paymentMethod: input.paymentMethod,
    paymentStatus: 'pending',
    deliveryFee: input.deliveryFee,
    instructions: input.instructions ?? null,
    schedule: input.schedule,
    createdAt: now,
    updatedAt: now,
  };

  db.orders.set(id, order);
  await persistDB();
  cartStore.getState().clearCart();
  return { order };
}

export async function getOrders(
  userId: string,
  filters?: { status?: 'active' | 'past' },
): Promise<{ orders: Order[] } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  let orders = Array.from(db.orders.values()).filter((o) => o.customerId === userId);

  if (filters?.status === 'active') {
    orders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  } else if (filters?.status === 'past') {
    orders = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));
  }

  return { orders };
}

export async function getOrderDetail(orderId: string): Promise<{ order: Order } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const order = getOrder(orderId);
  if (!order) return { success: false, error: { code: 'NOT_FOUND' } };
  return { order };
}

export async function reorder(orderId: string): Promise<ReorderResponse | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const order = db.orders.get(orderId);
  if (!order) return { success: false, error: { code: 'NOT_FOUND' } };
  if (order.status !== 'delivered' && order.status !== 'cancelled') {
    return { success: false, error: { code: 'INVALID_ORDER_STATUS' } };
  }

  const addedItems: ReorderResponse['addedItems'] = [];
  const skippedItems: ReorderResponse['skippedItems'] = [];

  for (const subOrder of order.subOrders) {
    const kitchen = db.kitchens.get(subOrder.kitchenId);
    if (!kitchen) continue;

    for (const item of subOrder.items) {
      const dish = db.dishes.get(item.dishId);
      if (dish && dish.available) {
        addedItems.push({
          dishId: dish.id,
          dishName: dish.name,
          price: dish.price,
          quantity: item.quantity,
          kitchenId: subOrder.kitchenId,
          kitchenName: kitchen.name,
        });
      } else if (dish && !dish.available) {
        skippedItems.push({
          dishId: dish.id,
          dishName: dish.name,
          reason: 'unavailable',
        });
      } else {
        skippedItems.push({
          dishId: item.dishId,
          dishName: item.dishName,
          reason: 'deleted',
        });
      }
    }
  }

  for (const item of addedItems) {
    cartStore.getState().addItem(item);
  }

  return { addedItems, skippedItems };
}

// ─── Chef Orders ─────────────────────────────────────────

export async function getChefOrders(
  chefId: string,
  filters?: ChefOrderFilters,
): Promise<{ orders: Order[] } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const allOrders = Array.from(db.orders.values()).filter((o) =>
    o.subOrders.some((so) => so.chefId === chefId),
  );

  let orders = allOrders;
  if (filters?.status === 'pending') {
    orders = allOrders.filter((o) =>
      o.subOrders.some((so) => so.chefId === chefId && so.status === 'pending'),
    );
  } else if (filters?.status === 'active') {
    orders = allOrders.filter((o) =>
      o.subOrders.some(
        (so) =>
          so.chefId === chefId &&
          ['confirmed', 'preparing', 'cooking', 'ready', 'on_the_way'].includes(so.status),
      ),
    );
  } else if (filters?.status === 'completed') {
    orders = allOrders.filter((o) =>
      o.subOrders.some(
        (so) => so.chefId === chefId && ['delivered', 'cancelled'].includes(so.status),
      ),
    );
  }

  return { orders };
}

export async function updateOrderStatus(
  orderId: string,
  subOrderId: string,
  status: OrderStatus,
): Promise<{ success: true; order: Order } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const order = db.orders.get(orderId);
  if (!order) return { success: false, error: { code: 'NOT_FOUND' } };

  const subOrder = order.subOrders.find((so) => so.kitchenId === subOrderId);
  if (!subOrder) return { success: false, error: { code: 'NOT_FOUND' } };

  const validNext = VALID_TRANSITIONS[subOrder.status];
  if (!validNext || !validNext.includes(status)) {
    return { success: false, error: { code: 'INVALID_TRANSITION' } };
  }

  subOrder.status = status;
  order.status = computeOverallStatus(order.subOrders);
  order.updatedAt = new Date().toISOString();
  db.orders.set(orderId, order);
  await persistDB();

  return { success: true, order };
}

export async function acceptOrder(
  orderId: string,
  subOrderId: string,
): Promise<{ success: true; order: Order } | ApiError> {
  const db = getDB();
  const order = db.orders.get(orderId);
  if (!order) return { success: false, error: { code: 'NOT_FOUND' } };

  const subOrder = order.subOrders.find((so) => so.kitchenId === subOrderId);
  if (!subOrder) return { success: false, error: { code: 'NOT_FOUND' } };
  if (subOrder.status !== 'pending') {
    return { success: false, error: { code: 'NOT_PENDING' } };
  }

  return updateOrderStatus(orderId, subOrderId, 'confirmed');
}

export async function rejectOrder(
  orderId: string,
  subOrderId: string,
): Promise<{ success: true; order: Order } | ApiError> {
  const db = getDB();
  const order = db.orders.get(orderId);
  if (!order) return { success: false, error: { code: 'NOT_FOUND' } };

  const subOrder = order.subOrders.find((so) => so.kitchenId === subOrderId);
  if (!subOrder) return { success: false, error: { code: 'NOT_FOUND' } };
  if (subOrder.status !== 'pending') {
    return { success: false, error: { code: 'NOT_PENDING' } };
  }

  return updateOrderStatus(orderId, subOrderId, 'cancelled');
}

// ─── Chef Menu ────────────────────────────────────────────

export async function getChefMenu(chefId: string): Promise<{ dishes: Dish[] } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const kitchen = Array.from(db.kitchens.values()).find((k) => k.chefId === chefId);
  if (!kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  const dishes = getDishesByKitchen(kitchen.id);
  return { dishes };
}

export async function createDish(
  chefId: string,
  input: CreateDishInput,
): Promise<{ success: true; dish: Dish } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const kitchen = Array.from(db.kitchens.values()).find((k) => k.chefId === chefId);
  if (!kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  const validationError = validateDishFields(input, true);
  if (validationError) return { success: false, error: { code: validationError } };

  const id = await getNextId('dish');
  const dish: Dish = {
    id,
    kitchenId: kitchen.id,
    name: input.name,
    nameEn: input.nameEn,
    description: input.description,
    descriptionEn: input.descriptionEn,
    price: input.price,
    category: input.category as DishCategory,
    categoryEn: input.categoryEn as DishCategoryEn,
    prepTime: input.prepTime,
    maxPortions: input.maxPortions,
    available: input.available ?? true,
    imageUrl: null,
    createdAt: new Date().toISOString(),
  };

  db.dishes.set(id, dish);
  await persistDB();
  return { success: true, dish };
}

export async function updateDish(
  dishId: string,
  input: UpdateDishInput,
): Promise<{ success: true; dish: Dish } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const dish = db.dishes.get(dishId);
  if (!dish) return { success: false, error: { code: 'NOT_FOUND' } };

  const validationError = validateDishFields(input);
  if (validationError) return { success: false, error: { code: validationError } };

  const updated: Dish = {
    ...dish,
    ...(input.name != null && { name: input.name }),
    ...(input.nameEn != null && { nameEn: input.nameEn }),
    ...(input.description != null && { description: input.description }),
    ...(input.descriptionEn != null && { descriptionEn: input.descriptionEn }),
    ...(input.price != null && { price: input.price }),
    ...(input.category != null && { category: input.category as DishCategory }),
    ...(input.categoryEn != null && { categoryEn: input.categoryEn as DishCategoryEn }),
    ...(input.prepTime != null && { prepTime: input.prepTime }),
    ...(input.maxPortions != null && { maxPortions: input.maxPortions }),
    ...(input.available != null && { available: input.available }),
  };
  db.dishes.set(dishId, updated);
  await persistDB();
  return { success: true, dish: updated };
}

export async function deleteDish(dishId: string): Promise<{ success: true } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  if (!db.dishes.has(dishId)) return { success: false, error: { code: 'NOT_FOUND' } };

  db.dishes.delete(dishId);
  await persistDB();
  return { success: true };
}

export async function toggleDishAvailability(
  dishId: string,
): Promise<{ success: true; dish: Dish } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const dish = db.dishes.get(dishId);
  if (!dish) return { success: false, error: { code: 'NOT_FOUND' } };

  dish.available = !dish.available;
  db.dishes.set(dishId, dish);
  await persistDB();
  return { success: true, dish };
}

// ─── Chef Schedule ────────────────────────────────────────

export async function getChefSchedule(chefId: string): Promise<{ schedule: Schedule } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const kitchen = Array.from(db.kitchens.values()).find((k) => k.chefId === chefId);
  if (!kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  const schedule = getSchedule(kitchen.id);
  if (!schedule) return { success: false, error: { code: 'NOT_FOUND' } };

  return { schedule };
}

export async function updateChefSchedule(
  chefId: string,
  scheduleInput: DayScheduleInput[],
): Promise<{ success: true; schedule: Schedule } | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const kitchen = Array.from(db.kitchens.values()).find((k) => k.chefId === chefId);
  if (!kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  if (scheduleInput.length !== 7) {
    return { success: false, error: { code: 'INVALID_INPUT' } };
  }

  const uniqueDays = new Set(scheduleInput.map((d) => d.day));
  if (uniqueDays.size !== 7) {
    return { success: false, error: { code: 'INVALID_INPUT' } };
  }

  const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

  for (const day of scheduleInput) {
    if (day.isOpen) {
      if (!day.openTime || !day.closeTime) {
        return { success: false, error: { code: 'INVALID_TIMES' } };
      }
      if (!TIME_REGEX.test(day.openTime) || !TIME_REGEX.test(day.closeTime)) {
        return { success: false, error: { code: 'INVALID_TIMES' } };
      }
      const openMinutes =
        parseInt(day.openTime.slice(0, 2), 10) * 60 + parseInt(day.openTime.slice(3), 10);
      const closeMinutes =
        parseInt(day.closeTime.slice(0, 2), 10) * 60 + parseInt(day.closeTime.slice(3), 10);
      if (openMinutes >= closeMinutes) {
        return { success: false, error: { code: 'INVALID_TIMES' } };
      }
    }
  }

  const schedule: Schedule = {
    kitchenId: kitchen.id,
    days: scheduleInput.map((d) => ({
      day: d.day,
      isOpen: d.isOpen,
      openTime: d.isOpen ? d.openTime! : null,
      closeTime: d.isOpen ? d.closeTime! : null,
    })),
  };

  const now = new Date();
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const currentDayName = dayNames[now.getDay()];
  const currentDay = schedule.days.find((d) => d.day === currentDayName);

  if (currentDay && currentDay.isOpen) {
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    kitchen.isOpen = currentTime >= currentDay.openTime! && currentTime < currentDay.closeTime!;
  } else {
    kitchen.isOpen = false;
  }

  db.schedules.set(kitchen.id, schedule);
  db.kitchens.set(kitchen.id, kitchen);
  await persistDB();

  return { success: true, schedule };
}

// ─── Chef Stats ──────────────────────────────────────────

export async function getChefStats(chefId: string): Promise<ChefStats | ApiError> {
  await withLatency();
  if (shouldInjectError()) return injectedError();

  const db = getDB();
  const kitchen = Array.from(db.kitchens.values()).find((k) => k.chefId === chefId);
  if (!kitchen) return { success: false, error: { code: 'NOT_FOUND' } };

  const weekAgo = Date.now() - 7 * 86400000;
  const chefOrders = Array.from(db.orders.values()).filter((o) =>
    o.subOrders.some(
      (so) =>
        so.chefId === chefId &&
        new Date(o.createdAt).getTime() >= weekAgo &&
        so.status !== 'cancelled',
    ),
  );

  let weeklyIncome = 0;
  let weeklyOrders = 0;
  const dishCounts: Record<string, { id: string; name: string; nameEn: string; count: number }> =
    {};
  const customerOrderCounts: Record<string, number> = {};

  for (const order of chefOrders) {
    for (const subOrder of order.subOrders) {
      if (subOrder.chefId !== chefId || subOrder.status === 'cancelled') continue;
      weeklyIncome += subOrder.kitchenTotal;
      weeklyOrders++;
      customerOrderCounts[order.customerId] = (customerOrderCounts[order.customerId] || 0) + 1;

      for (const item of subOrder.items) {
        if (!dishCounts[item.dishId]) {
          const dish = db.dishes.get(item.dishId);
          dishCounts[item.dishId] = {
            id: item.dishId,
            name: dish?.name ?? item.dishName,
            nameEn: dish?.nameEn ?? item.dishName,
            count: 0,
          };
        }
        dishCounts[item.dishId].count += item.quantity;
      }
    }
  }

  const totalCustomers = Object.keys(customerOrderCounts).length;
  const repeatCustomers = Object.values(customerOrderCounts).filter((c) => c >= 2).length;
  const repeatCustomerPercent =
    totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

  const topDishEntry =
    Object.values(dishCounts).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))[0] ??
    null;

  return {
    weeklyIncome,
    weeklyOrders,
    repeatCustomerPercent,
    topDish: topDishEntry
      ? {
          id: topDishEntry.id,
          name: topDishEntry.name,
          nameEn: topDishEntry.nameEn,
          orderCount: topDishEntry.count,
        }
      : null,
  };
}
