import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
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
  { _id: false },
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
    orderDetails: {
      orderType: {
        type: String,
        enum: ["delivery", "pickup"],
        required: true,
      },
      scheduledTime: String,
      persons: {
        type: Number,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ["cash", "online", "card"],
        required: true,
      },
      comment: String,
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
    address: {
      street: String,
      building: String,
      appartment: String,
      entrance: String,
      floor: String,
      comment: String,
    },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    number: Number,
  },
  { timestamps: true },
);

OrderSchema.plugin(AutoIncrement, { inc_field: "number" });

export default mongoose.model("Order", OrderSchema);
