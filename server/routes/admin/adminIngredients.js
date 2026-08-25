import express from "express";
import Ingredient from "../../models/Ingredient.js";
import Product from "../../models/Product.js";
import { uploadImage } from "../../middlewares/upload.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import {
  createIngredientSchema,
  updateIngredientSchema,
} from "../../validators/ingredient.js";
import { removeUploadedFile } from "../../utils/files.js";

const router = express.Router();

router.post("/", uploadImage, async (req, res) => {
  const image = req.file?.filename;

  try {
    const { error, value } = createIngredientSchema.validate(
      { ...req.body, image },
      { abortEarly: false },
    );

    if (error) {
      await removeUploadedFile(image);
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const ingredient = await Ingredient.create(value);
    res.status(201).json(ingredient);
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

    const { error, value } = updateIngredientSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      await removeUploadedFile(image);
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      await removeUploadedFile(image);
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      value,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedIngredient) {
      await removeUploadedFile(image);
      return res.status(404).json({ message: "Ingredient not found" });
    }

    if (image && ingredient.image !== image) {
      await removeUploadedFile(ingredient.image);
    }

    res.status(200).json(updatedIngredient);
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
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    await Product.updateMany(
      { ingredients: ingredient._id },
      { $pull: { ingredients: ingredient._id } },
    );
    await ingredient.deleteOne();
    await removeUploadedFile(ingredient.image);

    res.status(200).json({ message: `Ingredient ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
