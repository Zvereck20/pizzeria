import Product from "../models/Product.js";
import Ingredient from "../models/Ingredient.js";
import Store from "../models/Store.js";

export class OrderBuildError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const toMinorUnits = (price) => Math.round(Number(price) * 100);

export const buildOrder = async (body) => {
  const productIds = [...new Set(body.items.map(({ productId }) => productId))];
  const ingredientIds = [
    ...new Set(body.items.flatMap(({ ingredients = [] }) => ingredients)),
  ];

  const [products, ingredients, store] = await Promise.all([
    Product.find({ _id: { $in: productIds } }).lean(),
    Ingredient.find({ _id: { $in: ingredientIds } }).lean(),
    Store.findById(body.store).lean(),
  ]);

  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  );
  const ingredientsById = new Map(
    ingredients.map((ingredient) => [ingredient._id.toString(), ingredient]),
  );

  if (!store) {
    throw new OrderBuildError(404, "Store not found");
  }

  if (!store.isActive) {
    throw new OrderBuildError(409, "Store is inactive");
  }

  let totalPriceMinor = 0;
  const items = body.items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new OrderBuildError(404, "Product not found");
    }

    if (!product.available) {
      throw new OrderBuildError(409, `Product "${product.name}" is unavailable`);
    }

    const selectedIngredientIds = [...new Set(item.ingredients ?? [])];
    const allowedIngredientIds = new Set(
      product.ingredients.map((ingredientId) => ingredientId.toString()),
    );
    const selectedIngredients = selectedIngredientIds.map((ingredientId) => {
      const ingredient = ingredientsById.get(ingredientId);

      if (!ingredient) {
        throw new OrderBuildError(404, "Ingredient not found");
      }

      if (!ingredient.available) {
        throw new OrderBuildError(
          409,
          `Ingredient "${ingredient.name}" is unavailable`,
        );
      }

      if (!allowedIngredientIds.has(ingredientId)) {
        throw new OrderBuildError(
          400,
          "Ingredient is not available for this product",
        );
      }

      return ingredient;
    });

    const unitPriceMinor =
      toMinorUnits(product.price) +
      selectedIngredients.reduce(
        (sum, ingredient) => sum + toMinorUnits(ingredient.price),
        0,
      );

    totalPriceMinor += unitPriceMinor * item.quantity;

    return {
      productId: product._id,
      ingredients: selectedIngredientIds,
      name: product.name,
      quantity: item.quantity,
      unitPrice: unitPriceMinor / 100,
    };
  });

  return {
    items,
    totalPrice: totalPriceMinor / 100,
    status: "pending",
    orderDetails: body.orderDetails,
    customer: body.customer,
    address: body.address,
    store: store._id,
  };
};
