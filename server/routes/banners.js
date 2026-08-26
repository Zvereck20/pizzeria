import express from "express";
import Banner from "../models/Banner.js";
import { mapImages } from "../utils/mapImages.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

// GET api/banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).lean();

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
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const banner = await Banner.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();

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
