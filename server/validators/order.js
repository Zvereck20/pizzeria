import Joi from "joi";

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
    scheduledTime: Joi.string().allow("", null),
    persons: Joi.number().integer().min(1).required(),
    paymentMethod: Joi.string().valid("cash", "online", "card").required(),
    comment: Joi.string().allow("", null),
  }).required(),
  customer: Joi.object({
    fullName: Joi.string().min(2).required(),
    phone: Joi.string().required(),
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
