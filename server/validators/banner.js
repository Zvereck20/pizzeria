import Joi from "joi";

export const createBannerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  image: Joi.string().required(),
  link: Joi.string().allow(""),
  isActive: Joi.boolean().required(),
});

export const updateBannerSchema = Joi.object({
  name: Joi.string().min(2),
  image: Joi.string(),
  link: Joi.string().allow(""),
  isActive: Joi.boolean(),
}).min(1);
