import Ingredient from "../models/Ingredient.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";

let sequence = 0;

const nextName = (prefix) => {
  sequence += 1;
  return `${prefix} ${sequence}`;
};

export const createIngredient = (overrides = {}) =>
  Ingredient.create({
    name: nextName("Ingredient"),
    image: "ingredient.jpg",
    price: 30,
    available: true,
    ...overrides,
  });

export const createProduct = (overrides = {}) =>
  Product.create({
    name: nextName("Product"),
    description: "Test product",
    image: "product.jpg",
    category: "pizza",
    information: {
      weight: 500,
      energy: 300,
      proteins: 10,
      fats: 12,
      carbohydrates: 35,
    },
    ingredients: [],
    price: 500,
    available: true,
    ...overrides,
  });

export const createStore = (overrides = {}) =>
  Store.create({
    name: nextName("Store"),
    address: "Test street, 1",
    operating_mode: "10:00-22:00",
    phone: "+70000000000",
    menu: "https://example.com/menu",
    geo: { lat: 43.1, lan: 131.9 },
    isActive: true,
    ...overrides,
  });

export const validOrderPayload = (product, store, overrides = {}) => ({
  items: [
    {
      productId: product._id.toString(),
      quantity: 2,
      name: "Fake product",
      unitPrice: 1,
    },
  ],
  totalPrice: 1,
  status: "done",
  orderDetails: {
    orderType: "delivery",
    persons: 2,
    paymentMethod: "cash",
  },
  customer: {
    fullName: "Test Customer",
    phone: "+70000000000",
  },
  address: {
    city: "Vladivostok",
    street: "Test street",
    building: "1",
  },
  store: store._id.toString(),
  ...overrides,
});
