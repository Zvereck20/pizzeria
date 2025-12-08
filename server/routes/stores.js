import express from "express";
import Store from "../models/Store.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createStoreSchema, updateStoreSchema } from "../validators/store.js";

const router = express.Router();

// GET api/stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/stores/id
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST api/stores
router.post("/", validateBody(createStoreSchema), async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/stores/id
router.patch("/:id", validateBody(updateStoreSchema), async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, { ...req.body }, { returnDocument: "after" });
    res.status(201).json(updatedStore);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/stores/id
router.delete("/:id", async (req, res) => {
  try {
    await Store.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: `Store ${req.params.id} was deleted` });
  } catch (err) {
    res.status(400).json({ message: "Server error", error: err.message });
  }
});

export default router;
