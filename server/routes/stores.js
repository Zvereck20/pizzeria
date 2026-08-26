import express from "express";
import Store from "../models/Store.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

// GET api/stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/stores/id
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
