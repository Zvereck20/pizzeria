import type { Cart, CartItem, CartIngredient, ID } from "./types";

const STORAGE_KEY = "pizzeria_cart";

export const emptyCart = (): Cart => ({
  items: [],
  currency: "RUB",
  totalPrice: 0,
});

const createUid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(6).slice(2);
};

const computeIngredientsPrice = (ingredients: CartIngredient[]): number => {
  if (!ingredients.length) return 0;

  const total = ingredients.reduce((s, i) => s + (i.price || 0), 0);

  return total;
};

export const recomputeTotal = (items: CartItem[]) => items.reduce((s, i) => s + (i.itemPrice * i.quantity || 0), 0);

const safeParse = <T>(raw: string | null): T | null => {
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const clearCart = (): Cart => {
  const cart: Cart = emptyCart();
  saveCart(cart);
  return cart;
};

export const loadCart = (): Cart => {
  const parsed = safeParse<Cart>(window.localStorage.getItem(STORAGE_KEY));

  if (!parsed) return emptyCart();

  return parsed;
};

export const saveCart = (cart: Cart): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

export const addItem = (input: CartItem): Cart => {
  const cart = loadCart();
  const ingredientsPrice = computeIngredientsPrice(input.ingredients ?? []);

  const newItem: CartItem = {
    uid: createUid(),
    productId: input.productId,
    name: input.name,
    image: input.image,
    productPrice: input.productPrice,
    ingredients: input.ingredients ?? [],
    quantity: input.quantity,
    itemPrice: input.productPrice + ingredientsPrice,
  };

  const totalPrice = cart.totalPrice + newItem.itemPrice * newItem.quantity;
  const result = {
    ...cart,
    items: [...cart.items, newItem],
    totalPrice,
  };

  saveCart(result);

  return result;
};

export const updateQuantity = (uid: ID, increase: boolean): Cart => {
  const cart: Cart = loadCart();

  const items: CartItem[] = cart.items.reduce<CartItem[]>((s, i) => {
    const quantity = i.uid === uid ? (increase ? i.quantity + 1 : i.quantity - 1) : i.quantity;

    if (quantity > 0) {
      s.push({
        ...i,
        quantity,
      });
    }

    return s;
  }, []);

  const totalPrice = recomputeTotal(items);

  const result = { ...cart, items, totalPrice };
  saveCart(result);
  return result;
};

export const removeItem = (uid: ID): Cart => {
  const cart: Cart = loadCart();
  const items = cart.items.filter((i) => i.uid !== uid);

  const totalPrice = recomputeTotal(items);

  const result = { ...cart, items, totalPrice };

  saveCart(result);
  return result;
};
