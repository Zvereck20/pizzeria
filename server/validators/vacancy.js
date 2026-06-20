import Joi from "joi";

export const createVacancySchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(10).required(),
  isActive: Joi.boolean().required(),
});

export const updateVacancySchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().min(10),
  isActive: Joi.boolean(),
});
