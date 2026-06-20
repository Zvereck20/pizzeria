import express from "express";
import Vacancy from "../models/Vacancy.js";

const router = express.Router();

// GET api/vacancies
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find();

    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET api/vacancies/id
router.get("/:id", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });

    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
