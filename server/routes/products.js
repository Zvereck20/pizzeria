import express from "express";
import Product from "../models/Product.js";
import { mapImages } from "../utils/mapImages.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ available: true })
      .populate({ path: "ingredients", match: { available: true } })
      .lean();

    const data = products.map((p) =>
      mapImages(p, req, [
        { path: "", field: "image" },
        { path: "ingredients", field: "image" },
      ]),
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      available: true,
    })
      .populate({ path: "ingredients", match: { available: true } })
      .lean();

    if (!product) return res.status(404).json({ message: "Product not found" });

    const data = mapImages(product, req, [
      { path: "", field: "image" },
      { path: "ingredients", field: "image" },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
