import Joi from "joi";

export const adminLoginSchema = Joi.object({
  login: Joi.string().trim().min(3).max(50).required(),
  password: Joi.string().min(4).max(100).required(),
});
