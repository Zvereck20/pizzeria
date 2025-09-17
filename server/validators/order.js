import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24),
        name: Joi.string(),
        quantity: Joi.number().integer().min(1),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(0).required(),
  status: Joi.string().valid("pending", "confirmed", "delivering", "done", "canceled").optional(),
  customer: Joi.object({
    fullName: Joi.string().min(2).required(),
    phone: Joi.string()
      .pattern(/^\+?\d{10,15}$/)
      .required(),
  }).required(),
  orderType: Joi.string().valid("delivery", "pickup").required(),
  address: Joi.object({
    street: Joi.string().allow(""),
    building: Joi.string().allow(""),
    appartment: Joi.string().allow("", null),
    entrance: Joi.string().allow("", null),
    floor: Joi.string().allow("", null),
  }).optional(),

  storeId: Joi.string().hex().length(24).required(),
});

export const updateOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24),
        name: Joi.string(),
        quantity: Joi.number().integer().min(1),
        unitPrice: Joi.number().min(0),
      })
    )
    .min(1),
  totalPrice: Joi.number().min(0),
  status: Joi.string().valid("pending", "confirmed", "delivering", "done", "canceled").optional(),
  customer: Joi.object({
    fullName: Joi.string().min(2),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/),
  }),
  orderType: Joi.string().valid("delivery", "pickup"),
  address: Joi.object({
    street: Joi.string().allow(""),
    building: Joi.string().allow(""),
    appartment: Joi.string().allow("", null),
    entrance: Joi.string().allow("", null),
    floor: Joi.string().allow("", null),
  }).optional(),

  storeId: Joi.string().hex().length(24),
});
