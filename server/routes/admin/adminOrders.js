import express from "express";
import Order from "../../models/Order.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import { updateOrderStatusSchema } from "../../validators/order.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    res.json(orders);
  } catch (err) {
    console.error("Orders loading failed");
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Order loading failed");
    res.status(500).json({ message: "Server error" });
  }
});

router.patch(
  "/:id",
  validateObjectId,
  validateBody(updateOrderStatusSchema),
  async (req, res) => {
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
  },
);

router.delete("/:id", validateObjectId, async (req, res) => {
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
