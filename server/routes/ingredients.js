import express from "express";
import Ingredient from "../models/Ingredient.js";
import { mapImages } from "../utils/mapImages.js";

const router = express.Router();

// GET api/ingredients
router.get("/", async (req, res) => {
  try {
    const data = await Ingredient.find();

    const ingredients = data.map((ing) =>
      mapImages(ing, req, [{ path: "", field: "image" }]),
    );

    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/ingredients/id
router.get("/:id", async (req, res) => {
  try {
    const data = await Ingredient.findById(req.params.id);

    if (!data) return res.status(404).json({ message: "Ingredient not found" });

    const ingredient = mapImages(data, req, [{ path: "", field: "image" }]);

    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
