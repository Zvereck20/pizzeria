export const parseJsonFields =
  (fields = []) =>
  (req, res, next) => {
    try {
      for (const field of fields) {
        const v = req.body?.[field];
        if (typeof v === "string") {
          req.body[field] = JSON.parse(v);
        }
      }
      next();
    } catch (err) {
      return res.status(400).json({
        message: "Invalid JSON in form-data",
        field: err?.field || "unknow",
        error: err.message,
      });
    }
  };
