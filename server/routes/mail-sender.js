import express from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { vacancyEmailSchema } from "../validators/mail.js";
import { sendVacancyNotification } from "../utils/mail.js";

const router = express.Router();

router.post("/vacancy", validateBody(vacancyEmailSchema), async (req, res) => {
  try {
    await sendVacancyNotification(req.body);

    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Vacancy notification failed");
    res.status(502).json({ message: "Failed to send email" });
  }
});

export default router;
