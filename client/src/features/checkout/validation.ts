import * as yup from "yup";

export type OrderType = "delivery" | "pickup";
export type TimeMode = "asap" | "scheduled";
export type PaymentMethod = "cash" | "online" | "card";

export const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d-.\s]{5,}$/;

const addressShape = yup.object({
  street: yup.string().trim().required("Улица обязательна"),
  building: yup.string().trim().required("Дом обязателен"),
  appartment: yup.string().trim().optional(),
  entrance: yup.string().trim().optional(),
  floor: yup.string().trim().optional(),
});

export const checkoutSchema = yup.object({
  orderType: yup.mixed<OrderType>().oneOf(["delivery", "pickup"]).required(),

  fullName: yup.string().trim().min(2, "Введите имя полностью").required("Имя обязательно"),
  phone: yup.string().trim().matches(phoneRegex, "Некорректный номер телефона").required("Телефон обязателен"),

  // ВАЖНО: поле ВСЕГДА присутствует: либо объект, либо null
  address: addressShape
    .nullable()
    .default(null)
    .when("orderType", {
      is: "delivery",
      then: (s) => s.required(),
      otherwise: (s) => s.nullable().default(null),
    }),

  // ВСЕГДА присутствует: string | null
  storeId: yup
    .string()
    .nullable()
    .default(null)
    .when("orderType", {
      is: "pickup",
      then: (s) => s.required("Выберите заведение"),
      otherwise: (s) => s.nullable().default(null),
    }),

  timeMode: yup.mixed<TimeMode>().oneOf(["asap", "scheduled"]).required(),

  // ВСЕГДА присутствует: string | null
  scheduledTime: yup
    .string()
    .nullable()
    .default(null)
    .when("timeMode", {
      is: "scheduled",
      then: (s) => s.required("Выберите время"),
      otherwise: (s) => s.nullable().default(null),
    }),

  persons: yup.number().typeError("Укажите количество персон").integer().min(1, "Не меньше 1").max(20, "Не больше 20").required(),

  // === Оплата ===
  paymentMethod: yup.mixed<PaymentMethod>().oneOf(["cash", "online", "card"]).required(),

  // ВСЕГДА присутствует: boolean
  cashNeedChange: yup
    .boolean()
    .default(false)
    .when("paymentMethod", {
      is: "cash",
      then: (s) => s.required(),
      otherwise: (s) => s.default(false),
    }),

  // ВСЕГДА присутствует: number | null
  cashGiven: yup
    .number()
    .transform((v, orig) => (orig === "" || orig == null ? null : v))
    .nullable()
    .default(null)
    .when(["paymentMethod", "cashNeedChange"], {
      is: (pm: PaymentMethod, need: boolean) => pm === "cash" && need === true,
      then: (s) => s.typeError("Укажите сумму").min(1, "Сумма должна быть больше 0").required("Укажите сумму"),
      otherwise: (s) => s.nullable().default(null),
    }),

  comment: yup.string().trim().max(500, "Не более 500 символов").nullable().default(null),

  consent: yup.boolean().oneOf([true], "Необходимо согласие на обработку персональных данных").required(),
});

export type CheckoutFormValues = yup.InferType<typeof checkoutSchema>;
