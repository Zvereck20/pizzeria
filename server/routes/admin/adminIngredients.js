import express from "express";
import path from "path";
import { promises as fs } from "fs";
import Ingredient from "../../models/Ingredient.js";
import Product from "../../models/Product.js";
import { uploadImage } from "../../middlewares/upload.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import {
  createIngredientSchema,
  updateIngredientSchema,
} from "../../validators/ingredient.js";

const router = express.Router();

// POST api/admin/ingredients
router.post("/", uploadImage, async (req, res) => {
  try {
    const image = req.file?.filename;
    const body = { ...req.body, image };

    const { error, value } = createIngredientSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const ingredient = await Ingredient.create(value);
    res.status(201).json(ingredient);
  } catch (err) {
    const status = err instanceof SyntaxError || err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
});

// PATCH api/admin/ingredients/id
router.patch("/:id", validateObjectId, uploadImage, async (req, res) => {
  try {
    const image = req.file?.filename;
    const body = { ...req.body };

    if (image) body.image = image;

    const { error, value } = updateIngredientSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, value, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json(updatedIngredient);
  } catch (err) {
    const status = err instanceof SyntaxError || err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
});

// DELETE api/admin/ingredients/id
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    await Product.updateMany(
      { ingredients: ingredient._id },
      { $pull: { ingredients: ingredient._id } },
    );
    await ingredient.deleteOne();

    if (ingredient.image) {
      const filePath = path.resolve("uploads", ingredient.image);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`Cannot remove file: ${filePath}`, err.message);
      }
    }

    res.status(200).json({ message: `Ingredient ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
