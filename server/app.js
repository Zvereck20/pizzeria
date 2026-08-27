import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import path from "path";
import * as routes from "./routes/index.js";
import * as adminsRoutes from "./routes/admin/index.js";
import { authorization } from "./middlewares/authorization.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:5173" : null);
export const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI || "mongodb://mongo:27017/pizza-db";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

if (!CLIENT_ORIGIN) {
  throw new Error("CLIENT_ORIGIN is required in production");
}

if (!MONGO_URI) {
  throw new Error("MONGO_URI_TEST is required when NODE_ENV is test");
}

if (process.env.TRUST_PROXY) {
  const trustProxy = Number(process.env.TRUST_PROXY);

  if (!Number.isInteger(trustProxy) || trustProxy < 0) {
    throw new Error("TRUST_PROXY must be a non-negative integer");
  }

  app.set("trust proxy", trustProxy);
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Try again later." },
});

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(helmet());

export const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URI,
  ttl: 60 * 60 * 6,
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 6,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
    store: sessionStore,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(
  "/uploads",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(process.cwd(), "uploads")),
);

app.use("/api", apiLimiter);
app.use("/api/products", routes.productRoutes);
app.use("/api/ingredients", routes.ingredientRoutes);
app.use("/api/orders", routes.orderRoutes);
app.use("/api/stores", routes.storeRoutes);
app.use("/api/banners", routes.bannerRoutes);
app.use("/api/vacancies", routes.vacancyRoutes);
app.use("/api/address", routes.addressRoutes);
app.use("/api/mail-sender", routes.mailSenderRoutes);

app.use("/api/admin/login", adminsRoutes.adminLogin);
app.use("/api/admin/products", authorization, adminsRoutes.productAdminRoutes);
app.use("/api/admin/ingredients", authorization, adminsRoutes.ingredientAdminRoutes);
app.use("/api/admin/orders", authorization, adminsRoutes.orderAdminRoutes);
app.use("/api/admin/stores", authorization, adminsRoutes.storeAdminRoutes);
app.use("/api/admin/banners", authorization, adminsRoutes.bannerAdminRoutes);
app.use("/api/admin/vacancies", authorization, adminsRoutes.vacancyAdminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
