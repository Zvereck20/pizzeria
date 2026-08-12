import express from "express";
import Vacancy from "../models/Vacancy.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

// GET api/vacancies
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().lean();

    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET api/vacancies/id
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id).lean();

    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });

    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
