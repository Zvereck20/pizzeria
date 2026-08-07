import Joi from "joi";

const phonePattern = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d-.\s]{5,}$/;

const addressSchema = Joi.object({
  city: Joi.string().trim().allow(""),
  street: Joi.string().trim().allow(""),
  building: Joi.string().trim().allow(""),
  appartment: Joi.string().allow("", null),
  entrance: Joi.string().allow("", null),
  floor: Joi.string().allow("", null),
  comment: Joi.string().allow("", null),
});

const deliveryAddressSchema = addressSchema.keys({
  city: Joi.string().trim().min(1).required(),
  street: Joi.string().trim().min(1).required(),
  building: Joi.string().trim().min(1).required(),
});

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        ingredients: Joi.array()
          .items(Joi.string().hex().length(24))
          .default([]),
        name: Joi.any().strip(),
        quantity: Joi.number().integer().min(1).required(),
        unitPrice: Joi.any().strip(),
      }),
    )
    .min(1)
    .required(),
  totalPrice: Joi.any().strip(),
  status: Joi.any().strip(),
  orderDetails: Joi.object({
    orderType: Joi.string().valid("delivery", "pickup").required(),
    scheduledTime: Joi.string()
      .pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
      .allow("", null),
    persons: Joi.number().integer().min(1).required(),
    paymentMethod: Joi.string().valid("cash", "online", "card").required(),
    comment: Joi.string().allow("", null),
  }).required(),
  customer: Joi.object({
    fullName: Joi.string().min(2).required(),
    phone: Joi.string().trim().pattern(phonePattern).pattern(/\d/).required(),
  }).required(),
  address: Joi.when("orderDetails.orderType", {
    is: "delivery",
    then: deliveryAddressSchema.required(),
    otherwise: Joi.any().strip(),
  }),

  store: Joi.string().hex().length(24).required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "delivering", "done", "canceled")
    .required(),
});
