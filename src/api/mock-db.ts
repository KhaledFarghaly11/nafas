import { DISH_SEEDS } from '@/api/seeds/dishes';
import { KITCHEN_SEEDS } from '@/api/seeds/kitchens';
import { ORDER_SEEDS } from '@/api/seeds/orders';
import { REVIEW_SEEDS } from '@/api/seeds/reviews';
import { SCHEDULE_SEEDS } from '@/api/seeds/schedules';
import { USER_SEEDS } from '@/api/seeds/users';
import { StorageService } from '@/lib/storage';
import type { User, Kitchen, Dish, Review, Schedule, Order, Follow } from '@/types';

const STORAGE_KEY = 'nafas-mock-db';
const DB_VERSION = 2;

interface StoredData {
  version: number;
  data: SerializedDB;
}

interface MockDBData {
  users: Map<string, User>;
  kitchens: Map<string, Kitchen>;
  dishes: Map<string, Dish>;
  reviews: Map<string, Review>;
  schedules: Map<string, Schedule>;
  orders: Map<string, Order>;
  follows: Map<string, Follow>;
  autoIncrementCounters: Map<string, number>;
}

interface SerializedDB {
  users: [string, User][];
  kitchens: [string, Kitchen][];
  dishes: [string, Dish][];
  reviews: [string, Review][];
  schedules: [string, Schedule][];
  orders: [string, Order][];
  follows: [string, Follow][];
  autoIncrementCounters: [string, number][];
}

function createEmptyDB(): MockDBData {
  return {
    users: new Map(),
    kitchens: new Map(),
    dishes: new Map(),
    reviews: new Map(),
    schedules: new Map(),
    orders: new Map(),
    follows: new Map(),
    autoIncrementCounters: new Map(),
  };
}

let db: MockDBData = createEmptyDB();

const idLocks = new Map<string, Promise<void>>();

function serializeDB(data: MockDBData): SerializedDB {
  return {
    users: Array.from(data.users.entries()),
    kitchens: Array.from(data.kitchens.entries()),
    dishes: Array.from(data.dishes.entries()),
    reviews: Array.from(data.reviews.entries()),
    schedules: Array.from(data.schedules.entries()),
    orders: Array.from(data.orders.entries()),
    follows: Array.from(data.follows.entries()),
    autoIncrementCounters: Array.from(data.autoIncrementCounters.entries()),
  };
}

function deserializeDB(serialized: SerializedDB): MockDBData {
  return {
    users: new Map(serialized.users),
    kitchens: new Map(serialized.kitchens),
    dishes: new Map(serialized.dishes),
    reviews: new Map(serialized.reviews),
    schedules: new Map(serialized.schedules),
    orders: new Map(serialized.orders),
    follows: new Map(serialized.follows),
    autoIncrementCounters: new Map(serialized.autoIncrementCounters),
  };
}

export function loadSeeds(): void {
  db = createEmptyDB();

  for (const user of USER_SEEDS) {
    db.users.set(user.id, user);
  }
  for (const kitchen of KITCHEN_SEEDS) {
    db.kitchens.set(kitchen.id, kitchen);
  }
  for (const dish of DISH_SEEDS) {
    db.dishes.set(dish.id, dish);
  }
  for (const review of REVIEW_SEEDS) {
    db.reviews.set(review.id, review);
  }
  for (const schedule of SCHEDULE_SEEDS) {
    db.schedules.set(schedule.kitchenId, schedule);
  }
  for (const order of ORDER_SEEDS) {
    db.orders.set(order.id, order);
  }

  db.autoIncrementCounters.set('user', db.users.size);
  db.autoIncrementCounters.set('kitchen', db.kitchens.size);
  db.autoIncrementCounters.set('dish', db.dishes.size);
  db.autoIncrementCounters.set('review', db.reviews.size);
  db.autoIncrementCounters.set('order', db.orders.size);
  db.autoIncrementCounters.set('follow', db.follows.size);
}

export async function persistDB(): Promise<void> {
  const serialized = serializeDB(db);
  await StorageService.setItem(STORAGE_KEY, { version: DB_VERSION, data: serialized });
}

export async function initializeDB(): Promise<void> {
  const stored = await StorageService.getItem<StoredData>(STORAGE_KEY);
  if (stored && stored.version === DB_VERSION) {
    try {
      db = deserializeDB(stored.data);
    } catch (err) {
      console.warn(`[mock-db] Failed to deserialize ${STORAGE_KEY}:`, err);
      loadSeeds();
      await persistDB();
    }
  } else {
    loadSeeds();
    await persistDB();
  }
}

export async function resetToSeeds(): Promise<void> {
  await StorageService.removeItem(STORAGE_KEY);
  loadSeeds();
  await persistDB();
}

export async function getNextId(entityType: string): Promise<string> {
  const prev = idLocks.get(entityType) ?? Promise.resolve();
  let resolve!: () => void;
  const nextLock = new Promise<void>((r) => {
    resolve = r;
  });
  idLocks.set(entityType, nextLock);
  await prev;
  try {
    const current = db.autoIncrementCounters.get(entityType) ?? 0;
    const next = current + 1;
    db.autoIncrementCounters.set(entityType, next);
    await persistDB();
    return `${entityType}-${next}`;
  } finally {
    resolve();
  }
}

export function getUser(id: string): User | null {
  return db.users.get(id) ?? null;
}

export function getKitchen(id: string): Kitchen | null {
  return db.kitchens.get(id) ?? null;
}

export function getDish(id: string): Dish | null {
  return db.dishes.get(id) ?? null;
}

export function getOrder(id: string): Order | null {
  return db.orders.get(id) ?? null;
}

export function getSchedule(kitchenId: string): Schedule | null {
  return db.schedules.get(kitchenId) ?? null;
}

export function getKitchensByArea(area: string): Kitchen[] {
  return Array.from(db.kitchens.values()).filter((k) => k.area === area);
}

export function getDishesByKitchen(kitchenId: string): Dish[] {
  return Array.from(db.dishes.values()).filter((d) => d.kitchenId === kitchenId);
}

export function getReviewsByKitchen(kitchenId: string): Review[] {
  return Array.from(db.reviews.values()).filter((r) => r.kitchenId === kitchenId);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return Array.from(db.orders.values()).filter((o) => o.customerId === customerId);
}

export function getOrdersByChef(chefId: string): Order[] {
  return Array.from(db.orders.values()).filter((o) =>
    o.subOrders.some((so) => so.chefId === chefId),
  );
}

export function getFollowsByUser(userId: string): Follow[] {
  return Array.from(db.follows.values()).filter((f) => f.userId === userId);
}

/** Returns the live/mutable db reference. Clone if you need an immutable snapshot. */
export function getDB(): MockDBData {
  return db;
}
