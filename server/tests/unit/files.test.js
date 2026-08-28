import { promises as fs } from "fs";
import path from "path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { removeUploadedFile, UPLOAD_DIR } from "../../utils/files.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("removeUploadedFile", () => {
  test("removes a regular filename from the upload directory", async () => {
    const unlink = vi.spyOn(fs, "unlink").mockResolvedValue();

    await removeUploadedFile("pizza.jpg");

    expect(unlink).toHaveBeenCalledWith(path.resolve(UPLOAD_DIR, "pizza.jpg"));
  });

  test("does nothing for an empty filename", async () => {
    const unlink = vi.spyOn(fs, "unlink").mockResolvedValue();

    await removeUploadedFile(null);

    expect(unlink).not.toHaveBeenCalled();
  });

  test("reduces path traversal input to its basename", async () => {
    const unlink = vi.spyOn(fs, "unlink").mockResolvedValue();

    await removeUploadedFile("../../outside.jpg");

    expect(unlink).toHaveBeenCalledWith(path.resolve(UPLOAD_DIR, "outside.jpg"));
  });

  test("handles missing files and other cleanup errors without throwing", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const unlink = vi.spyOn(fs, "unlink");
    unlink.mockRejectedValueOnce(Object.assign(new Error("Missing"), { code: "ENOENT" }));
    unlink.mockRejectedValueOnce(Object.assign(new Error("Denied"), { code: "EACCES" }));

    await expect(removeUploadedFile("missing.jpg")).resolves.toBeUndefined();
    await expect(removeUploadedFile("denied.jpg")).resolves.toBeUndefined();

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Cannot remove uploaded file:"),
      "Denied",
    );
  });
});
