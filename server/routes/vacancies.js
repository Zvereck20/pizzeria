import express from "express";
import Vacancy from "../models/Vacancy.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find({ isActive: true }).lean();

    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();

    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });

    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
