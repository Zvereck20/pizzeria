import { promises as fs } from "fs";
import path from "path";

export const UPLOAD_DIR = path.resolve("uploads");

export const removeUploadedFile = async (filename) => {
  if (!filename) {
    return;
  }

  const filePath = path.resolve(UPLOAD_DIR, path.basename(filename));

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Cannot remove uploaded file: ${filePath}`, error.message);
    }
  }
};
