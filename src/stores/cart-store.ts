import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SchedulePreference } from '@/types';

export interface CartItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
}

export interface CartKitchenGroup {
  kitchenId: string;
  kitchenName: string;
  items: CartItem[];
}

interface CartState {
  kitchenGroups: CartKitchenGroup[];
  schedule: SchedulePreference;
  instructions: string;
  deliveryFee: number;
  hydrated: boolean;
  addItem: (item: {
    dishId: string;
    dishName: string;
    price: number;
    kitchenId: string;
    kitchenName: string;
  }) => void;
  removeItem: (kitchenId: string, dishId: string) => void;
  updateQuantity: (kitchenId: string, dishId: string, quantity: number) => void;
  setSchedule: (schedule: SchedulePreference) => void;
  setInstructions: (instructions: string) => void;
  clearCart: () => void;
  clearOnLogout: () => void;
}

const INITIAL_STATE = {
  kitchenGroups: [] as CartKitchenGroup[],
  schedule: 'asap' as SchedulePreference,
  instructions: '',
  deliveryFee: 25,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      hydrated: false,
      addItem: (item) => {
        const { kitchenGroups } = get();
        const groupIdx = kitchenGroups.findIndex((g) => g.kitchenId === item.kitchenId);

        if (groupIdx >= 0) {
          const group = kitchenGroups[groupIdx];
          const itemIdx = group.items.findIndex((i) => i.dishId === item.dishId);
          const newGroups = [...kitchenGroups];

          if (itemIdx >= 0) {
            const newItems = [...group.items];
            newItems[itemIdx] = {
              ...newItems[itemIdx],
              quantity: newItems[itemIdx].quantity + 1,
            };
            newGroups[groupIdx] = { ...group, items: newItems };
          } else {
            newGroups[groupIdx] = {
              ...group,
              items: [
                ...group.items,
                { dishId: item.dishId, dishName: item.dishName, price: item.price, quantity: 1 },
              ],
            };
          }
          set({ kitchenGroups: newGroups });
        } else {
          set({
            kitchenGroups: [
              ...kitchenGroups,
              {
                kitchenId: item.kitchenId,
                kitchenName: item.kitchenName,
                items: [
                  {
                    dishId: item.dishId,
                    dishName: item.dishName,
                    price: item.price,
                    quantity: 1,
                  },
                ],
              },
            ],
          });
        }
      },
      removeItem: (kitchenId, dishId) => {
        const { kitchenGroups } = get();
        const groupIdx = kitchenGroups.findIndex((g) => g.kitchenId === kitchenId);
        if (groupIdx < 0) return;

        const group = kitchenGroups[groupIdx];
        const newItems = group.items.filter((i) => i.dishId !== dishId);
        const newGroups = [...kitchenGroups];

        if (newItems.length === 0) {
          newGroups.splice(groupIdx, 1);
        } else {
          newGroups[groupIdx] = { ...group, items: newItems };
        }
        set({ kitchenGroups: newGroups });
      },
      updateQuantity: (kitchenId, dishId, quantity) => {
        if (quantity < 1) {
          get().removeItem(kitchenId, dishId);
          return;
        }
        const { kitchenGroups } = get();
        const groupIdx = kitchenGroups.findIndex((g) => g.kitchenId === kitchenId);
        if (groupIdx < 0) return;

        const group = kitchenGroups[groupIdx];
        const itemIdx = group.items.findIndex((i) => i.dishId === dishId);
        if (itemIdx < 0) return;

        const newItems = [...group.items];
        newItems[itemIdx] = { ...newItems[itemIdx], quantity };
        const newGroups = [...kitchenGroups];
        newGroups[groupIdx] = { ...group, items: newItems };
        set({ kitchenGroups: newGroups });
      },
      setSchedule: (schedule) => set({ schedule }),
      setInstructions: (instructions) => set({ instructions }),
      clearCart: () => set({ ...INITIAL_STATE }),
      clearOnLogout: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'nafas-cart',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.warn('[cart-store] Rehydration failed:', error);
          }
          useCartStore.setState({ hydrated: true });
        };
      },
    },
  ),
);

export const cartStore = useCartStore;

export function getSubtotal(): number {
  const { kitchenGroups } = cartStore.getState();
  return kitchenGroups.reduce(
    (total, group) =>
      total + group.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    0,
  );
}

export function getTotal(): number {
  return getSubtotal();
}

export function getGrandTotal(): number {
  return getSubtotal() + cartStore.getState().deliveryFee;
}

export function getItemCount(): number {
  const { kitchenGroups } = cartStore.getState();
  return kitchenGroups.reduce(
    (total, group) => total + group.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );
}
