import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid("pizza", "combo", "salad", "soup", "paste", "appetizers", "rolls", "dessert", "drink").required(),
  ingredients: Joi.array().items(Joi.string().hex().length(24)).required(),
  image: Joi.string().required(),
  available: Joi.boolean().required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().allow(""),
  price: Joi.number().min(0),
  category: Joi.string().valid("pizza", "combo", "salad", "soup", "paste", "appetizers", "rolls", "dessert", "drink"),
  ingredients: Joi.array().items(Joi.string().hex().length(24)),
  image: Joi.string(),
  available: Joi.boolean(),
});
