import express from "express";
import Banner from "../../models/Banner.js";
import { uploadImage } from "../../middlewares/upload.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import { createBannerSchema, updateBannerSchema } from "../../validators/banner.js";
import { removeUploadedFile } from "../../utils/files.js";

const router = express.Router();

router.post("/", uploadImage, async (req, res) => {
  const image = req.file?.filename;

  try {
    const { error, value } = createBannerSchema.validate(
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

    const banner = await Banner.create(value);
    res.status(201).json(banner);
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

    const { error, value } = updateBannerSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      await removeUploadedFile(image);
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      await removeUploadedFile(image);
      return res.status(404).json({ message: "Banner not found" });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, value, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedBanner) {
      await removeUploadedFile(image);
      return res.status(404).json({ message: "Banner not found" });
    }

    if (image && banner.image !== image) {
      await removeUploadedFile(banner.image);
    }

    res.status(200).json(updatedBanner);
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
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.deleteOne();
    await removeUploadedFile(banner.image);
    res.status(200).json({ message: `Banner ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
