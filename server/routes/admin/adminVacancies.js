import express from "express";
import Vacancy from "../../models/Vacancy.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";
import { createVacancySchema, updateVacancySchema } from "../../validators/vacancy.js";

const router = express.Router();

// POST api/admin/vacancies
router.post("/", validateBody(createVacancySchema), async (req, res) => {
  try {
    const vacancy = await Vacancy.create(req.body);

    res.status(201).json(vacancy);
  } catch (err) {
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
});

// PATCH api/admin/vacancies/id
router.patch(
  "/:id",
  validateObjectId,
  validateBody(updateVacancySchema),
  async (req, res) => {
  try {
    const updatedVacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedVacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    res.status(200).json(updatedVacancy);
  } catch (err) {
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Validation error" : "Server error",
    });
  }
  },
);

// DELETE api/admin/vacancies/id
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    await Vacancy.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: `Vacancy ${req.params.id} was deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
