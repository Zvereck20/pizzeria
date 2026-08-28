import { afterEach, describe, expect, test, vi } from "vitest";
import Product from "../../models/Product.js";
import Ingredient from "../../models/Ingredient.js";
import Store from "../../models/Store.js";
import { buildOrder, OrderBuildError } from "../../utils/buildOrder.js";

const storeId = "store-1";
const productId = "product-1";
const ingredientId = "ingredient-1";

const mockLeanResult = (value) => ({
  lean: vi.fn().mockResolvedValue(value),
});

const createBody = (items = [{ productId, quantity: 1, ingredients: [] }]) => ({
  items,
  store: storeId,
  orderDetails: { orderType: "delivery" },
  customer: { fullName: "Customer" },
  address: { city: "Vladivostok" },
});

const mockDatabase = ({
  products = [{ _id: productId, name: "Margherita", price: 500, available: true, ingredients: [] }],
  ingredients = [],
  store = { _id: storeId, isActive: true },
} = {}) => {
  vi.spyOn(Product, "find").mockReturnValue(mockLeanResult(products));
  vi.spyOn(Ingredient, "find").mockReturnValue(mockLeanResult(ingredients));
  vi.spyOn(Store, "findById").mockReturnValue(mockLeanResult(store));
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("buildOrder", () => {
  test("builds a basic pending order from server-controlled product and store data", async () => {
    mockDatabase();
    const body = {
      ...createBody([{ productId, quantity: 2, ingredients: [] }]),
      totalPrice: 1,
      status: "confirmed",
      items: [{ productId, quantity: 2, ingredients: [], name: "Fake", unitPrice: 1 }],
    };

    const order = await buildOrder(body);

    expect(order).toMatchObject({
      totalPrice: 1000,
      status: "pending",
      store: storeId,
      items: [{ productId, name: "Margherita", quantity: 2, unitPrice: 500 }],
    });
  });

  test("adds allowed ingredient prices to the unit price", async () => {
    mockDatabase({
      products: [{ _id: productId, name: "Pizza", price: 500, available: true, ingredients: [ingredientId] }],
      ingredients: [{ _id: ingredientId, name: "Cheese", price: 50, available: true }],
    });

    const order = await buildOrder(createBody([{ productId, quantity: 2, ingredients: [ingredientId] }]));

    expect(order.items[0].unitPrice).toBe(550);
    expect(order.totalPrice).toBe(1100);
  });

  test("sums several ingredients without floating-point drift", async () => {
    const secondIngredientId = "ingredient-2";
    mockDatabase({
      products: [{ _id: productId, name: "Pizza", price: 499.99, available: true, ingredients: [ingredientId, secondIngredientId] }],
      ingredients: [
        { _id: ingredientId, name: "Cheese", price: 20.01, available: true },
        { _id: secondIngredientId, name: "Sauce", price: 25, available: true },
      ],
    });

    const order = await buildOrder(createBody([{ productId, quantity: 2, ingredients: [ingredientId, secondIngredientId] }]));

    expect(order.items[0].unitPrice).toBe(545);
    expect(order.totalPrice).toBe(1090);
  });

  test("builds several order items and their combined total", async () => {
    const secondProductId = "product-2";
    mockDatabase({
      products: [
        { _id: productId, name: "Pizza", price: 500, available: true, ingredients: [] },
        { _id: secondProductId, name: "Drink", price: 300, available: true, ingredients: [] },
      ],
    });

    const order = await buildOrder(createBody([
      { productId, quantity: 2, ingredients: [] },
      { productId: secondProductId, quantity: 1, ingredients: [] },
    ]));

    expect(order.items).toHaveLength(2);
    expect(order.items.map(({ unitPrice }) => unitPrice)).toEqual([500, 300]);
    expect(order.totalPrice).toBe(1300);
  });

  test("uses one product correctly in duplicate product items", async () => {
    mockDatabase();

    const order = await buildOrder(createBody([
      { productId, quantity: 1, ingredients: [] },
      { productId, quantity: 2, ingredients: [] },
    ]));

    expect(order.items.map(({ quantity, unitPrice }) => ({ quantity, unitPrice }))).toEqual([
      { quantity: 1, unitPrice: 500 },
      { quantity: 2, unitPrice: 500 },
    ]);
    expect(order.totalPrice).toBe(1500);
  });

  test("counts a duplicate ingredient only once", async () => {
    mockDatabase({
      products: [{ _id: productId, name: "Pizza", price: 500, available: true, ingredients: [ingredientId] }],
      ingredients: [{ _id: ingredientId, name: "Cheese", price: 50, available: true }],
    });

    const order = await buildOrder(createBody([{ productId, quantity: 1, ingredients: [ingredientId, ingredientId] }]));

    expect(order.items[0].ingredients).toEqual([ingredientId]);
    expect(order.items[0].unitPrice).toBe(550);
  });

  test.each([
    ["store is missing", { store: null }, createBody(), 404, "Store not found"],
    ["store is inactive", { store: { _id: storeId, isActive: false } }, createBody(), 409, "Store is inactive"],
    ["product is missing", { products: [] }, createBody(), 404, "Product not found"],
    ["product is unavailable", { products: [{ _id: productId, name: "Pizza", price: 500, available: false, ingredients: [] }] }, createBody(), 409, 'Product "Pizza" is unavailable'],
    ["ingredient is missing", { products: [{ _id: productId, name: "Pizza", price: 500, available: true, ingredients: [ingredientId] }] }, createBody([{ productId, quantity: 1, ingredients: [ingredientId] }]), 404, "Ingredient not found"],
    ["ingredient is unavailable", { products: [{ _id: productId, name: "Pizza", price: 500, available: true, ingredients: [ingredientId] }], ingredients: [{ _id: ingredientId, name: "Cheese", price: 50, available: false }] }, createBody([{ productId, quantity: 1, ingredients: [ingredientId] }]), 409, 'Ingredient "Cheese" is unavailable'],
    ["ingredient is not allowed for the product", { ingredients: [{ _id: ingredientId, name: "Cheese", price: 50, available: true }] }, createBody([{ productId, quantity: 1, ingredients: [ingredientId] }]), 400, "Ingredient is not available for this product"],
  ])("throws OrderBuildError when %s", async (_scenario, database, body, status, message) => {
    mockDatabase(database);

    await expect(buildOrder(body)).rejects.toBeInstanceOf(OrderBuildError);
    await expect(buildOrder(body)).rejects.toMatchObject(
      expect.objectContaining({
        status,
        message,
      }),
    );
  });
});
