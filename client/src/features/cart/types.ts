export type ID = string;

export type CartIngredient = {
  _id: ID;
  name: string;
  price: number;
};

export type CartItem = {
  uid: ID;
  productId: ID;
  name: string;
  image: string;
  productPrice: number;
  ingredients: CartIngredient[];
  quantity: number;
  itemPrice: number;
};

export type Cart = {
  items: CartItem[];
  currency: "RUB";
  totalPrice: number;
};

// export type OrderDraft = {
//   items: Array<{
//     productId: ID;
//     name: string;
//     quantity: number;
//     unitPrice: number; // basePrice + sum(ingredients)
//     ingredientIds?: ID[]; // для бэка (если нужно)
//   }>;
//   totalPrice: number;
// };
