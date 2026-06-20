import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    operating_mode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    menu: {
      type: String,
      required: true,
    },
    geo: {
      lat: {
        type: Number,
        required: true,
      },
      lan: {
        type: Number,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Store", StoreSchema);
