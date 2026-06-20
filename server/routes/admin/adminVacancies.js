import express from "express";
import Vacancy from "../../models/Vacancy.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { createVacancySchema, updateVacancySchema } from "../../validators/vacancy.js";

const router = express.Router();

// POST api/admin/vacancies
router.post("/", validateBody(createVacancySchema), async (req, res) => {
  try {
    const vacancy = await Vacancy.create(req.body);

    res.status(201).json(vacancy);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PATCH api/admin/vacancies/id
router.patch("/:id", validateBody(updateVacancySchema), async (req, res) => {
  try {
    const updatedVacancy = await Vacancy.findByIdAndUpdate(req.params.id, body, {
      returnDocument: "after",
    });

    res.status(201).json(updatedVacancy);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE api/admin/vacancies/id
router.delete("/:id", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    await Vacancy.deleteOne();
    res.status(200).json({ message: `Vacancy ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
