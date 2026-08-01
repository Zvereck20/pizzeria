import express from "express";
import Order from "../models/Order.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createOrderSchema } from "../validators/order.js";
import { buildOrder, OrderBuildError } from "../utils/buildOrder.js";
import { sendOrderNotification } from "../utils/mail.js";

const router = express.Router();

// POST api/orders
router.post("/", validateBody(createOrderSchema), async (req, res) => {
  try {
    const orderData = await buildOrder(req.body);
    const order = await Order.create(orderData);

    res.status(201).json(order);

    void sendOrderNotification(order).catch(() => {
      console.error("Order notification failed");
    });
  } catch (err) {
    if (err instanceof OrderBuildError) {
      return res.status(err.status).json({ message: err.message });
    }

    console.error("Order creation failed");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
