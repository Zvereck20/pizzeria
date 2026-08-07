export const adminMiddleware = (req, res, next) => {
  if (req.session?.admin?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
