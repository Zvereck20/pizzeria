import express from "express";
import mongoose from "mongoose";
import Order from "../../models/Order.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { updateOrderStatusSchema } from "../../validators/order.js";

const router = express.Router();

// GET api/admin/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Orders loading failed");
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/admin/orders/id
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Order loading failed");
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH api/admin/orders/id
router.patch("/:id", validateBody(updateOrderStatusSchema), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Order update failed");
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE api/admin/orders/id
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: `Order ${req.params.id} was deleted` });
  } catch (err) {
    console.error("Order deletion failed");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
