import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMBO_DISCOUNT } from "./types";

export type CartItem = {
  dishId: number;
  name: string;
  price: number;
  qty: number;
  categorySlug: string;
  image_key: string;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (dishId: number, qty: number) => void;
  remove: (dishId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const existing = get().items.find((i) => i.dishId === item.dishId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.dishId === item.dishId ? { ...i, qty: i.qty + qty } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, qty }] });
        }
      },
      setQty: (dishId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.dishId !== dishId) });
          return;
        }
        set({
          items: get().items.map((i) => (i.dishId === dishId ? { ...i, qty } : i)),
        });
      },
      remove: (dishId) =>
        set({ items: get().items.filter((i) => i.dishId !== dishId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "peremena-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export function comboCount(items: CartItem[]) {
  const soup = items
    .filter((i) => i.categorySlug === "soups")
    .reduce((s, i) => s + i.qty, 0);
  const main = items
    .filter((i) => i.categorySlug === "mains")
    .reduce((s, i) => s + i.qty, 0);
  const drink = items
    .filter((i) => i.categorySlug === "drinks")
    .reduce((s, i) => s + i.qty, 0);
  return Math.min(soup, main, drink);
}

export function cartDiscount(items: CartItem[]) {
  const hasReadyCombo = items.some((i) => i.categorySlug === "combos");
  if (hasReadyCombo) return 0;
  return comboCount(items) * COMBO_DISCOUNT;
}

export function cartTotal(items: CartItem[]) {
  return Math.max(0, cartSubtotal(items) - cartDiscount(items));
}
