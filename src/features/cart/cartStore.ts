import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../../types';

interface CartStore {
  items: CartItem[];
  itemCount: number;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  clearItems: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      setItems: (items) => set({ items, itemCount: items.length }),

      addItem: (item) => {
        const exists = get().items.find((i) => i.courseId === item.courseId);
        if (!exists) {
          const newItems = [...get().items, item];
          set({ items: newItems, itemCount: newItems.length });
        }
      },

      removeItem: (courseId) => {
        const newItems = get().items.filter((i) => i.courseId !== courseId);
        set({ items: newItems, itemCount: newItems.length });
      },

      clearItems: () => set({ items: [], itemCount: 0 }),
    }),
    { name: 'cart-storage' }
  )
);