import express from "express";
import { adminLoginSchema } from "../../validators/login.js";
import { authorization } from "../../middlewares/authorization.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { getAdminsConfig } from "../../config/adminConfig.js";

const router = express.Router();

// POST api/admin
router.post("/", validateBody(adminLoginSchema), async (req, res) => {
  try {
    const { login, password } = req.body;

    const admin = getAdminsConfig(login, password);

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.admin = { ...admin };

    res.status(200).json({ role: admin.role });
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// // PATCH api/admin
// router.patch("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const image = req.file?.filename;
//     const body = { ...req.body };

//     if (image) body.image = image;

//     const { error } = updateBannerSchema.validate(body);

//     if (error) {
//       return res.status(400).json({ message: error.message });
//     }

//     const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, body, {
//       returnDocument: "after",
//     });
//     res.status(201).json(updatedBanner);
//   } catch (err) {
//     res.status(400).json({ message: "Validation error", error: err.message });
//   }
// });

router.get("/me", authorization, async (req, res, next) => {
  try {
    res.status(200).json(req.session.admin);
  } catch (error) {
    next(error);
  }
});

export default router;
