import Joi from "joi";

export const createIngredientSchema = Joi.object({
  name: Joi.string().min(1).required(),
  image: Joi.string().required(), // имя файла или путь
  price: Joi.number().min(0).required(),
  available: Joi.boolean().required(),
});

export const updateIngredientSchema = Joi.object({
  name: Joi.string().min(1),
  image: Joi.string(), // имя файла или путь
  price: Joi.number().min(0),
  available: Joi.boolean(),
});
