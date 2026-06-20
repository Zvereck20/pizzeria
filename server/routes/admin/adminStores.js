import express from "express";
import Store from "../../models/Store.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { createStoreSchema, updateStoreSchema } from "../../validators/store.js";

const router = express.Router();

// POST api/admin/stores
router.post("/", validateBody(createStoreSchema), async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/admin/stores/id
router.patch("/:id", validateBody(updateStoreSchema), async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updatedStore);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/admin/stores/id
router.delete("/:id", async (req, res) => {
  try {
    await Store.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: `Store ${req.params.id} was deleted` });
  } catch (err) {
    res.status(400).json({ message: "Server error", error: err.message });
  }
});

export default router;
