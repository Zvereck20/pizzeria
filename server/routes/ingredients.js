import express from "express";
import Ingredient from "../models/Ingredient.js";
import path from "path";
import fs from "fs";
import { upload } from "../middlewares/upload.js";
import { createIngredientSchema, updateIngredientSchema } from "../validators/Ingredient.js";

const router = express.Router();

// GET api/ingredients
router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/ingredients/id
router.get("/:id", async (req, res) => {
  try {
    const Ingredient = await Ingredient.findById(req.params.id);
    res.json(Ingredient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST api/ingredients
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const image = req.file?.filename;
    const body = { ...req.body, image };

    const { error } = createIngredientSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const ingredient = await Ingredient.create(body);
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/ingredients/id
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const image = req.file?.filename;
    const body = { ...req.body };

    if (image) body.image = image;

    const { error } = updateIngredientSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, body, { returnDocument: "after" });
    res.status(201).json(updatedIngredient);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/ingredients/id
router.delete("/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredietn not found" });
    }

    if (ingredient.image) {
      const filePath = path.resolve("uploads", ingredient.image);

      try {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Cannot remove file:", filePath, err.message);
          }
        });
      } catch (err) {
        console.warn(`Cannot remove file: ${filePath}`, err.message);
      }
    }

    await ingredient.deleteOne();
    res.status(201).json({ message: `Ingredient ${req.params.id} was deleted` });
  } catch (err) {
    res.status(400).json({ message: "Server error", error: err.message });
  }
});

export default router;
