import mongoose from "mongoose";

export const toObjectIdArray = (field) => (req, res, next) => {
  const v = req.body?.[field];

  if (v === null) return next();

  const asArrray = Array.isArray(v) ? v : [v];

  try {
    req.body[field] = asArrray.map((id) => new mongoose.Types.ObjectId(id));
    next();
  } catch (err) {
    return res.status(400).json({
      message: `Field "${field}" must be an ObjectId or array of ObjectIds`,
    });
  }
};
