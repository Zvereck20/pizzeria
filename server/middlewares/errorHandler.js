export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.too.large" || error.status === 413) {
    return res.status(413).json({ message: "Request payload too large" });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }

  res.status(500).json({ message: "Internal server error" });
};
