import express from "express";
import Banner from "../models/Banner.js";
import { mapImages } from "../utils/mapImages.js";

const router = express.Router();

// GET api/banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find();

    const data = banners.map((p) =>
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
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
