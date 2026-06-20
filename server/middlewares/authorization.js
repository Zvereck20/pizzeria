export const authorization = (req, res, next) => {
  try {
    if (!req.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.log("auth.error", error);
  }
};
