import type { FC, PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart, CartItem, ID } from "./types";
import {
  addItem as addItemUtil,
  updateQuantity as incQuantityUtil,
  removeItem as removeItemUtil,
  clearCart as clearCartUtil,
  loadCart,
} from "./cartStorage";

export type AddItemInput = Omit<CartItem, "uid" | "itemPrice">;

type CartContextValue = {
  cart: Cart;
  items: CartItem[];
  total: number;
  count: number;
  addItem: (input: AddItemInput) => Cart;
  incQuantity: (uid: ID, increase: boolean) => Cart;
  remove: (uid: ID) => Cart;
  clear: () => Cart;
};

export const CartContext = createContext<CartContextValue | null>(null);

const recomputeTotal = (items: CartItem[]) => items.reduce((s, i) => s + (i.itemPrice * i.quantity || 0), 0);

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => loadCart());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "pizzeria_cart") {
        setCart(loadCart());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((input: AddItemInput) => {
    const newItem = addItemUtil(input as unknown as CartItem);
    setCart(loadCart());
    return newItem;
  }, []);

  const incQuantity = useCallback((uid: ID, increase: boolean = true) => {
    const result = incQuantityUtil(uid, increase);
    setCart(result);
    return result;
  }, []);

  const remove = useCallback((uid: ID) => {
    const result = removeItemUtil(uid);
    setCart(result);
    return result;
  }, []);

  const clear = useCallback(() => {
    const result = clearCartUtil();
    setCart(result);
    return result;
  }, []);

  const value: CartContextValue = useMemo(() => {
    const total = cart.totalPrice ?? recomputeTotal(cart.items);
    const count = cart.items.reduce((s, it) => s + it.quantity, 0);
    return {
      cart,
      items: cart.items,
      total,
      count,
      addItem,
      incQuantity,
      remove,
      clear,
    };
  }, [cart, addItem, incQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};
