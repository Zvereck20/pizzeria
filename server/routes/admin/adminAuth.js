import express from "express";
import { adminLoginSchema } from "../../validators/login.js";
import { authorization } from "../../middlewares/authorization.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { getAdminsConfig } from "../../config/adminConfig.js";
import { rateLimit } from "express-rate-limit";

const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

// POST api/admin
router.post("/", loginLimiter, validateBody(adminLoginSchema), (req, res, next) => {
  try {
    const { login, password } = req.body;

    const admin = getAdminsConfig(login, password);

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        return next(regenerateError);
      }

      req.session.admin = { login: admin.login, role: admin.role };

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        res.status(200).json({ role: admin.role });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authorization, async (req, res, next) => {
  try {
    res.status(200).json(req.session.admin);
  } catch (error) {
    next(error);
  }
});

export default router;
