import Joi from "joi";

export const createStoreSchema = Joi.object({
  name: Joi.string().min(2).required(),
  address: Joi.string().min(5).required(),
  operating_mode: Joi.string().required(),
  phone: Joi.string().required(),
  menu: Joi.string().required(),
  geo: Joi.object({
    lat: Joi.number().required(),
    lan: Joi.number().required(),
  }),
  isActive: Joi.boolean().optional(),
});

export const updateStoreSchema = Joi.object({
  name: Joi.string().min(2),
  address: Joi.string().min(5),
  operating_mode: Joi.string(),
  phone: Joi.string(),
  menu: Joi.string(),
  geo: Joi.object({
    lat: Joi.number(),
    lan: Joi.number(),
  }),
  isActive: Joi.boolean().optional(),
});
