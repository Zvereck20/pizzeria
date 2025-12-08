import express from "express";
import Banner from "../models/Banner.js";
import path from "path";
import { promises as fs } from "fs";
import { upload } from "../middlewares/upload.js";
import { mapImages } from "../utils/mapImages.js";
import { createBannerSchema, updateBannerSchema } from "../validators/Banner.js";

const router = express.Router();

// GET api/banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find();

    const data = banners.map((p) =>
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

// GET api/banners/id
router.get("/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    const data = mapImages(banner, req, [
      { path: "", field: "image" },
      { path: "ingredients", field: "image" },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST api/banners
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const image = req.file?.filename;
    const body = { ...req.body, image };

    const { error } = createBannerSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const banner = await Banner.create(body);
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/banners/id
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const image = req.file?.filename;
    const body = { ...req.body };

    if (image) body.image = image;

    const { error } = updateBannerSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, body, { returnDocument: "after" });
    res.status(201).json(updatedBanner);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/banners/id
router.delete("/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (banner.image) {
      const filePath = path.resolve("uploads", banner.image);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`⚠ Не удалось удалить файл: ${filePath}`, err.message);
      }
    }
    await Banner.deleteOne();
    res.status(200).json({ message: `Banner ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
