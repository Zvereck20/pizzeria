import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import * as routes from "./routes/index.js";
import * as adminsRoutes from "./routes/admin/index.js";
import { authorization } from "./middlewares/authorization.js";

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/pizza-db";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // если нужны куки или авторизация
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 6, // 6 часов
      httpOnly: true,
      sameSite: "lax", // защита от CSRF
      secure: process.env.NODE_ENV === "production",
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 60 * 60 * 6, // 6 часов
    }),
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // Путь к папке с загруженными изображениями

app.use("/api/products", routes.productRoutes);
app.use("/api/ingredients", routes.ingredientRoutes);
app.use("/api/orders", routes.orderRoutes);
app.use("/api/stores", routes.storeRoutes);
app.use("/api/banners", routes.bannerRoutes);
app.use("/api/vacancies", routes.vacancyRoutes);
app.use("/api/address", routes.addressRoutes);
app.use("/api/mail-sender", routes.mailSenderRoutes);

//ADMIN ROUTES
app.use("/api/admin/login", adminsRoutes.adminLogin);
app.use("/api/admin/products", authorization, adminsRoutes.productAdminRoutes);
app.use("/api/admin/ingredients", authorization, adminsRoutes.ingredientAdminRoutes);
app.use("/api/admin/orders", authorization, adminsRoutes.orderAdminRoutes);
app.use("/api/admin/stores", authorization, adminsRoutes.storeAdminRoutes);
app.use("/api/admin/banners", authorization, adminsRoutes.bannerAdminRoutes);
app.use("/api/admin/vacancies", authorization, adminsRoutes.vacancyAdminRoutes);

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
