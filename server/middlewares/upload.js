import multer from "multer";
import path from "path";
import fs from "fs";

export const IMAGE_FILE_SIZE_LIMIT_MB = 5;

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
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
    return res.status(413).json({
      message: `Изображение слишком большое. Максимальный размер: ${IMAGE_FILE_SIZE_LIMIT_MB} МБ.`,
      field: err.field || "image",
      code: err.code,
      limitMb: IMAGE_FILE_SIZE_LIMIT_MB,
    });
  }

  if (err.message === "Unsupported file type") {
    return res.status(400).json({
      message: "Неподдерживаемый формат изображения. Используйте JPEG, PNG или WebP.",
      field: "image",
    });
  }

  next(err);
};

export const uploadImage = [upload.single("image"), handleUploadError];
