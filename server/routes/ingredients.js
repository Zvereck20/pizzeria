import express from "express";
import Ingredient from "../models/Ingredient.js";
import { mapImages } from "../utils/mapImages.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Ingredient.find({ available: true }).lean();

    const ingredients = data.map((ing) =>
      mapImages(ing, req, [{ path: "", field: "image" }]),
    );

    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const data = await Ingredient.findOne({
      _id: req.params.id,
      available: true,
    }).lean();

    if (!data) return res.status(404).json({ message: "Ingredient not found" });

    const ingredient = mapImages(data, req, [{ path: "", field: "image" }]);

    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
