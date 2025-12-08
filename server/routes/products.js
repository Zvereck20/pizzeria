import express from "express";
import Product from "../models/Product.js";
import path from "path";
import { promises as fs } from "fs";
import { upload } from "../middlewares/upload.js";
import { parseJsonFields } from "../middlewares/parseJsonFields.js";
import { toObjectIdArray } from "../middlewares/toObjectIdArray.js";
import { createProductSchema, updateProductSchema } from "../validators/product.js";
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
      ])
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

// POST api/products
// router.post("/", upload.single("image"), parseJsonFields(["ingredients"]), toObjectIdArray("ingredients"), async (req, res) => {
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const ingredients = [req.body.ingredients];

    const image = req.file?.filename;
    const body = { ...req.body, image, ingredients };

    const { error } = createProductSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/products/id
// router.patch("/:id", upload.single("image"), parseJsonFields(["ingredients"]), toObjectIdArray("ingredients"), async (req, res) => {
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const ingredients = [req.body.ingredients];
    const image = req.file?.filename;
    const body = ingredients ? { ...req.body, ingredients } : { ...req.body };

    if (image) body.image = image;

    const { error } = updateProductSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, body, { returnDocument: "after" });
    res.status(201).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/products/id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const filePath = path.resolve("uploads", product.image);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`⚠ Не удалось удалить файл: ${filePath}`, err.message);
      }
    }
    await product.deleteOne();
    res.status(200).json({ message: `Product ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
