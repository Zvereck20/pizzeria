import express from "express";
import Product from "../../models/Product.js";
import { uploadImage } from "../../middlewares/upload.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import { createProductSchema, updateProductSchema } from "../../validators/product.js";
import { removeUploadedFile } from "../../utils/files.js";

const router = express.Router();

const normalizeIngredients = (ingredients) => {
  if (ingredients === undefined) return undefined;
  if (Array.isArray(ingredients)) return ingredients;

  try {
    const parsedIngredients = JSON.parse(ingredients);
    return Array.isArray(parsedIngredients) ? parsedIngredients : [ingredients];
  } catch {
    return [ingredients];
  }
};

const parseInformation = (information) => {
  if (typeof information !== "string") return information;
  return JSON.parse(information);
};

router.post("/", uploadImage, async (req, res) => {
  const image = req.file?.filename;

  try {
    const body = {
      ...req.body,
      image,
      ingredients: normalizeIngredients(req.body.ingredients),
      information: parseInformation(req.body.information),
    };
    const { error, value } = createProductSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      await removeUploadedFile(image);
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const product = await Product.create(value);
    res.status(201).json(product);
  } catch (err) {
    await removeUploadedFile(image);
    const status =
      err instanceof SyntaxError || err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
});

router.patch("/:id", validateObjectId, uploadImage, async (req, res) => {
  const image = req.file?.filename;

  try {
    const body = { ...req.body };
    delete body.image;

    if (image) body.image = image;
    if (req.body.information !== undefined) {
      body.information = parseInformation(req.body.information);
    }

    const ingredients = normalizeIngredients(req.body.ingredients);
    if (ingredients !== undefined) body.ingredients = ingredients;

    const { error, value } = updateProductSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      await removeUploadedFile(image);
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      await removeUploadedFile(image);
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, value, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedProduct) {
      await removeUploadedFile(image);
      return res.status(404).json({ message: "Product not found" });
    }

    if (image && product.image !== image) {
      await removeUploadedFile(product.image);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    await removeUploadedFile(image);
    const status =
      err instanceof SyntaxError || err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
});

router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    await removeUploadedFile(product.image);
    res.status(200).json({ message: `Product ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
