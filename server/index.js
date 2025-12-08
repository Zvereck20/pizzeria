import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import productRoutes from "./routes/products.js";
import ingredientRoutes from "./routes/ingredients.js";
import orderRoutes from "./routes/orders.js";
import storeRoutes from "./routes/stores.js";
import bannerRoutes from "./routes/banners.js";
import addressRoutes from "./routes/address.js";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // если нужны куки или авторизация
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // Путь к папке с загруженными изображениями

app.use("/api/products", productRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/address", addressRoutes);

// URI из docker-compose.yml
const MONGO_URI = "mongodb://mongo:27017/pizza-db";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
