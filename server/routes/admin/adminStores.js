import express from "express";
import Store from "../../models/Store.js";
import Order from "../../models/Order.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import { createStoreSchema, updateStoreSchema } from "../../validators/store.js";

const router = express.Router();

// POST api/admin/stores
router.post("/", validateBody(createStoreSchema), async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (err) {
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
});

// PATCH api/admin/stores/id
router.patch(
  "/:id",
  validateObjectId,
  validateBody(updateStoreSchema),
  async (req, res) => {
    try {
      const updatedStore = await Store.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { returnDocument: "after", runValidators: true },
      );

      if (!updatedStore) {
        return res.status(404).json({ message: "Store not found" });
      }

      res.status(200).json(updatedStore);
    } catch (err) {
      const status = err.name === "ValidationError" ? 400 : 500;
      res.status(status).json({
        message: status === 400 ? "Validation error" : "Server error",
      });
    }
  },
);

// DELETE api/admin/stores/id
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const hasOrders = await Order.exists({ store: req.params.id });

    if (hasOrders) {
      return res.status(409).json({
        message: "Store cannot be deleted because it has orders",
      });
    }

    const deletedStore = await Store.findByIdAndDelete(req.params.id);

    if (!deletedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: `Store ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
