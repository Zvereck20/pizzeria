import type { CheckoutFormValues } from "../checkout/validation";
import type { CartItem } from "../cart/types";
import type { CreateOrderItemRequest, CreateOrderRequest } from "./ordersTypes";

export const mapCheckoutToOrder = (
  form: CheckoutFormValues,
  items: CartItem[],
): CreateOrderRequest => {
  const orderItems = items.map(
    ({ productId, ingredients, quantity }): CreateOrderItemRequest => {
      const ingerdientsId = ingredients.map((i) => i._id);

      return {
        productId,
        ingredients: ingerdientsId,
        quantity,
      };
    },
  );

  let address;

  if (form.orderType === "delivery") {
    const val = form.address;

    address = {
      city: val?.city,
      street: val?.street,
      building: val?.building,
      appartment: val?.appartment,
      entrance: val?.entrance,
      floor: val?.floor,
      comment: val?.comment,
    };
  }

  return {
    items: orderItems,
    orderDetails: {
      orderType: form.orderType,
      scheduledTime: form.scheduledTime,
      persons: form.persons,
      paymentMethod: form.paymentMethod,
      comment: form.comment,
    },
    customer: {
      fullName: form.fullName,
      phone: form.phone,
    },
    address,
    store: form.storeId || "697ff148392e4936738d74c6",
  };
};
