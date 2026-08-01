import Joi from "joi";

export const vacancyEmailSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().max(254).required(),
  message: Joi.string().trim().allow("").max(2000).default(""),
  vacancyName: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .pattern(/^[^\r\n]+$/)
    .required(),
});
