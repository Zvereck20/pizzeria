import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import { fileTypeFromFile } from "file-type";
import { removeUploadedFile, UPLOAD_DIR } from "../utils/files.js";

export const IMAGE_FILE_SIZE_LIMIT_MB = 5;

const mimeExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${mimeExtensions[file.mimetype]}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (mimeExtensions[file.mimetype]) {
    return cb(null, true);
  }

  cb(new Error("UNSUPPORTED_IMAGE_TYPE"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: IMAGE_FILE_SIZE_LIMIT_MB * 1024 * 1024 },
});

export const handleUploadError = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Image is too large" });
  }

  if (
    err instanceof multer.MulterError &&
    err.code === "LIMIT_UNEXPECTED_FILE"
  ) {
    return res.status(400).json({ message: "Unexpected file field" });
  }

  if (err.message === "UNSUPPORTED_IMAGE_TYPE") {
    return res.status(400).json({ message: "Unsupported image type" });
  }

  next(err);
};

const validateUploadedImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const detectedType = await fileTypeFromFile(req.file.path);

    if (!detectedType || detectedType.mime !== req.file.mimetype) {
      await removeUploadedFile(req.file.filename);
      return res.status(400).json({ message: "Invalid image file" });
    }

    next();
  } catch (error) {
    await removeUploadedFile(req.file.filename);
    next(error);
  }
};

export const uploadImage = [
  upload.single("image"),
  handleUploadError,
  validateUploadedImage,
];
