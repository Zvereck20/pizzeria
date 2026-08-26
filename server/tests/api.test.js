import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "./app.js";
import {
  createIngredient,
  createProduct,
  createStore,
  validOrderPayload,
} from "./helpers.js";

const adminAgent = async () => {
  const agent = request.agent(app);
  const response = await agent.post("/api/admin/login").send({
    login: process.env.ADMIN_LOGIN,
    password: process.env.ADMIN_PASSWORD,
  });

  expect(response.status).toBe(200);
  return agent;
};

describe("admin authentication", () => {
  test("creates a session for valid credentials and grants access", async () => {
    const agent = await adminAgent();

    const response = await agent.get("/api/admin/login/me");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      login: process.env.ADMIN_LOGIN,
      role: "admin",
    });
  });

  test("rejects invalid credentials", async () => {
    const response = await request(app).post("/api/admin/login").send({
      login: process.env.ADMIN_LOGIN,
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
  });

  test("rejects unauthenticated admin requests", async () => {
    const response = await request(app).get("/api/admin/products");

    expect(response.status).toBe(401);
  });
});

describe("public and admin catalog visibility", () => {
  test("hides unavailable products and ingredients from public API", async () => {
    const availableIngredient = await createIngredient();
    const unavailableIngredient = await createIngredient({ available: false });
    const availableProduct = await createProduct({
      ingredients: [availableIngredient._id, unavailableIngredient._id],
    });
    const unavailableProduct = await createProduct({ available: false });
    const agent = await adminAgent();

    const publicList = await request(app).get("/api/products");
    const publicProduct = await request(app).get(
      `/api/products/${availableProduct._id}`,
    );
    const hiddenProduct = await request(app).get(
      `/api/products/${unavailableProduct._id}`,
    );
    const adminList = await agent.get("/api/admin/products");
    const adminProduct = await agent.get(
      `/api/admin/products/${availableProduct._id}`,
    );

    expect(publicList.status).toBe(200);
    expect(publicList.body.map(({ _id }) => _id)).toContain(
      availableProduct._id.toString(),
    );
    expect(publicList.body.map(({ _id }) => _id)).not.toContain(
      unavailableProduct._id.toString(),
    );
    expect(publicProduct.body.ingredients.map(({ _id }) => _id)).toEqual([
      availableIngredient._id.toString(),
    ]);
    expect(hiddenProduct.status).toBe(404);
    expect(adminList.body.map(({ _id }) => _id)).toEqual(
      expect.arrayContaining([
        availableProduct._id.toString(),
        unavailableProduct._id.toString(),
      ]),
    );
    expect(adminProduct.body.ingredients.map(({ _id }) => _id)).toEqual(
      expect.arrayContaining([
        availableIngredient._id.toString(),
        unavailableIngredient._id.toString(),
      ]),
    );
  });

  test("uses public filters for ingredients and stores only", async () => {
    const availableIngredient = await createIngredient();
    const unavailableIngredient = await createIngredient({ available: false });
    const activeStore = await createStore();
    const inactiveStore = await createStore({ isActive: false });
    const agent = await adminAgent();

    const publicIngredients = await request(app).get("/api/ingredients");
    const publicStores = await request(app).get("/api/stores");
    const hiddenIngredient = await request(app).get(
      `/api/ingredients/${unavailableIngredient._id}`,
    );
    const hiddenStore = await request(app).get(`/api/stores/${inactiveStore._id}`);
    const adminIngredients = await agent.get("/api/admin/ingredients");
    const adminStores = await agent.get("/api/admin/stores");

    expect(publicIngredients.body.map(({ _id }) => _id)).toContain(
      availableIngredient._id.toString(),
    );
    expect(publicIngredients.body.map(({ _id }) => _id)).not.toContain(
      unavailableIngredient._id.toString(),
    );
    expect(publicStores.body.map(({ _id }) => _id)).toContain(activeStore._id.toString());
    expect(publicStores.body.map(({ _id }) => _id)).not.toContain(inactiveStore._id.toString());
    expect(hiddenIngredient.status).toBe(404);
    expect(hiddenStore.status).toBe(404);
    expect(adminIngredients.body.map(({ _id }) => _id)).toContain(
      unavailableIngredient._id.toString(),
    );
    expect(adminStores.body.map(({ _id }) => _id)).toContain(inactiveStore._id.toString());
  });

  test("returns 400 for malformed public object ids", async () => {
    const response = await request(app).get("/api/products/not-an-object-id");

    expect(response.status).toBe(400);
  });
});

describe("admin validation", () => {
  test("validates create and patch payloads and preserves 404 for valid missing ids", async () => {
    const agent = await adminAgent();
    const store = await createStore();
    const missingId = "507f1f77bcf86cd799439011";

    const invalidCreate = await agent.post("/api/admin/stores").send({ name: "x" });
    const emptyPatch = await agent.patch(`/api/admin/stores/${store._id}`).send({});
    const missingPatch = await agent.patch(`/api/admin/stores/${missingId}`).send({
      isActive: false,
    });

    expect(invalidCreate.status).toBe(400);
    expect(emptyPatch.status).toBe(400);
    expect(missingPatch.status).toBe(404);
  });
});

describe("orders", () => {
  test("builds prices and status on the server", async () => {
    const product = await createProduct({ price: 450 });
    const store = await createStore();

    const response = await request(app)
      .post("/api/orders")
      .send(validOrderPayload(product, store));

    expect(response.status).toBe(201);
    expect(response.body.totalPrice).toBe(900);
    expect(response.body.items[0].unitPrice).toBe(450);
    expect(response.body.status).toBe("pending");
  });

  test("rejects unavailable products, inactive stores, and missing products", async () => {
    const unavailableProduct = await createProduct({ available: false });
    const inactiveStore = await createStore({ isActive: false });
    const activeStore = await createStore();

    const unavailableProductResponse = await request(app)
      .post("/api/orders")
      .send(validOrderPayload(unavailableProduct, activeStore));
    const inactiveStoreResponse = await request(app)
      .post("/api/orders")
      .send(validOrderPayload(unavailableProduct, inactiveStore));
    const missingProductResponse = await request(app)
      .post("/api/orders")
      .send(
        validOrderPayload(
          { _id: "507f1f77bcf86cd799439011" },
          activeStore,
        ),
      );

    expect(unavailableProductResponse.status).toBe(409);
    expect(inactiveStoreResponse.status).toBe(409);
    expect(missingProductResponse.status).toBe(404);
  });

  test("keeps order reads and updates in the admin API", async () => {
    const product = await createProduct();
    const store = await createStore();
    const createResponse = await request(app)
      .post("/api/orders")
      .send(validOrderPayload(product, store));
    const agent = await adminAgent();

    const publicRead = await request(app).get("/api/orders");
    const adminRead = await agent.get("/api/admin/orders");
    const update = await agent
      .patch(`/api/admin/orders/${createResponse.body._id}`)
      .send({ status: "confirmed" });
    const invalidUpdate = await agent
      .patch(`/api/admin/orders/${createResponse.body._id}`)
      .send({ status: "invalid" });

    expect(publicRead.status).toBe(404);
    expect(adminRead.status).toBe(200);
    expect(adminRead.body).toHaveLength(1);
    expect(update.status).toBe(200);
    expect(update.body.status).toBe("confirmed");
    expect(invalidUpdate.status).toBe(400);
  });
});
