import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivering", "done", "canceled"],
      default: "pending",
    },
    customer: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },
    address: {
      street: String,
      building: String,
      appartment: String,
      entrance: String,
      floor: String,
    },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
