import Joi from "joi";

export const createStoreSchema = Joi.object({
  name: Joi.string().min(2).required(),
  address: Joi.string().min(5).required(),
  isActive: Joi.boolean().optional(),
});

export const updateStoreSchema = Joi.object({
  name: Joi.string().min(2),
  address: Joi.string().min(5),
  isActive: Joi.boolean().optional(),
});
