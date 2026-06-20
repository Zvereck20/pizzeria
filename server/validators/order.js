import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        ingredients: Joi.array().items(Joi.string().hex().length(24)),
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1),
        unitPrice: Joi.number().min(0).required(),
      }),
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(0).required(),
  status: Joi.string()
    .valid("pending", "confirmed", "delivering", "done", "canceled")
    .optional(),
  orderDetails: Joi.object({
    orderType: Joi.string().valid("delivery", "pickup").required(),
    scheduledTime: Joi.string().allow("", null),
    persons: Joi.number().min(1).required(),
    paymentMethod: Joi.string().valid("cash", "online", "card").required(),
    comment: Joi.string().allow("", null),
  }).required(),
  customer: Joi.object({
    fullName: Joi.string().min(2).required(),
    phone: Joi.string().required(),
  }).required(),
  address: Joi.object({
    city: Joi.string().allow(""),
    street: Joi.string().allow(""),
    building: Joi.string().allow(""),
    appartment: Joi.string().allow("", null),
    entrance: Joi.string().allow("", null),
    floor: Joi.string().allow("", null),
    comment: Joi.string().allow("", null),
  }).optional(),

  store: Joi.string().hex().length(24).required(),
});

export const updateOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24),
        ingredients: Joi.array().items(Joi.string().hex().length(24)),
        name: Joi.string(),
        quantity: Joi.number().integer().min(1),
        unitPrice: Joi.number().min(0),
      }),
    )
    .min(1),
  totalPrice: Joi.number().min(0),
  status: Joi.string()
    .valid("pending", "confirmed", "delivering", "done", "canceled")
    .optional(),
  customer: Joi.object({
    fullName: Joi.string().min(2),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/),
  }),
  orderDetails: Joi.object({
    orderType: Joi.string().valid("delivery", "pickup"),
    scheduledTime: Joi.string(),
    persons: Joi.number().min(1),
    paymentMethod: Joi.string().valid("cash", "online", "card"),
    comment: Joi.string(),
  }),
  address: Joi.object({
    city: Joi.string().allow(""),
    street: Joi.string().allow(""),
    building: Joi.string().allow(""),
    appartment: Joi.string().allow("", null),
    entrance: Joi.string().allow("", null),
    floor: Joi.string().allow("", null),
  }).optional(),

  store: Joi.string().hex().length(24),
});
