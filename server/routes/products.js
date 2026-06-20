import express from "express";
import Product from "../models/Product.js";
import { mapImages } from "../utils/mapImages.js";

const router = express.Router();

// GET api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("ingredients");

    const data = products.map((p) =>
      mapImages(p, req, [
        { path: "", field: "image" },
        { path: "ingredients", field: "image" },
      ]),
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET api/products/id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("ingredients");

    if (!product) return res.status(404).json({ message: "Product not found" });

    const data = mapImages(product, req, [
      { path: "", field: "image" },
      { path: "ingredients", field: "image" },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
