import express from "express";
import Order from "../models/Order.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createOrderSchema, updateOrderSchema } from "../validators/order.js";

const router = express.Router();

// GET api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/orders/id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST api/orders
router.post("/", validateBody(createOrderSchema), async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/orders/id
router.patch("/:id", validateBody(updateOrderSchema), async (req, res) => {
  try {
    const status = req.body.status;

    if (!status) {
      return res.status(400).json({ message: "You can only change the order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after" });
    res.status(201).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/orders/id
router.delete("/:id", async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: `Order ${req.params.id} was deleted` });
  } catch (err) {
    res.status(400).json({ message: "Server error", error: err.message });
  }
});

export default router;
