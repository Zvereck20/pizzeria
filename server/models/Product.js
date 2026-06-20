import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "pizza",
        "combo",
        "salad",
        "soup",
        "paste",
        "appetizers",
        "rolls",
        "dessert",
        "drink",
      ],
      required: true,
    },
    information: {
      weight: {
        type: Number,
        required: true,
      },
      energy: {
        type: Number,
        required: true,
      },
      proteins: {
        type: Number,
        required: true,
      },
      fats: {
        type: Number,
        required: true,
      },
      carbohydrates: {
        type: Number,
        required: true,
      },
    },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
    price: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", ProductSchema);
