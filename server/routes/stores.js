import express from "express";
import Store from "../models/Store.js";

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

export default router;
