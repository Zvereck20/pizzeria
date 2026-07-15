import express from "express";
import path from "path";
import { promises as fs } from "fs";
import Product from "../../models/Product.js";
// import { parseJsonFields } from "../../middlewares/parseJsonFields.js";
// import { toObjectIdArray } from "../../middlewares/toObjectIdArray.js";
import { uploadImage } from "../../middlewares/upload.js";
import { createProductSchema, updateProductSchema } from "../../validators/product.js";

const router = express.Router();

const normalizeIngredients = (ingredients) => {
  if (ingredients === undefined) {
    return undefined;
  }

  if (Array.isArray(ingredients)) {
    return ingredients;
  }

  try {
    const parsedIngredients = JSON.parse(ingredients);

    if (Array.isArray(parsedIngredients)) {
      return parsedIngredients;
    }
  } catch {
    return [ingredients];
  }

  return [ingredients];
};

// POST api/admin/products
// router.post("/", upload.single("image"), parseJsonFields(["ingredients"]), toObjectIdArray("ingredients"), async (req, res) => {
router.post("/", uploadImage, async (req, res) => {
  try {
    // переписать допы на выражение перменной типо const ingre = req.body.ingredients ?? чтото : или чтото и потом вск скопом в body
    const ingredients = normalizeIngredients(req.body.ingredients);
    const information = JSON.parse(req.body.information);

    const image = req.file?.filename;
    const body = { ...req.body, image, ingredients, information };

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

// PATCH api/admin/products/id
// router.patch("/:id", upload.single("image"), parseJsonFields(["ingredients"]), toObjectIdArray("ingredients"), async (req, res) => {
router.patch("/:id", uploadImage, async (req, res) => {
  try {
    const ingredients = normalizeIngredients(req.body.ingredients);
    const information = JSON.parse(req.body.information);
    const image = req.file?.filename;
    const body = { ...req.body };

    if (image) body.image = image;
    if (information) body.information = information;
    if (ingredients !== undefined) body.ingredients = ingredients;

    const { error } = updateProductSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, body, {
      returnDocument: "after",
    });
    res.status(201).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/admin/products/id
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
