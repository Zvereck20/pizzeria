import { CheckoutFormValues } from "../checkout/validation";
import { CartItem } from "../cart/types";
import type { OrderItem, OrderRequest } from "./ordersTypes";

export const mapCheckoutToOrder = (
  form: CheckoutFormValues,
  items: CartItem[],
  total: number,
): OrderRequest => {
  const orderItems = items.map(
    ({ productId, ingredients, name, quantity, itemPrice }): OrderItem => {
      const ingerdientsId = ingredients.map((i) => i._id);

      return {
        productId,
        ingredients: ingerdientsId,
        name,
        quantity,
        unitPrice: itemPrice,
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
    totalPrice: total,
    status: "pending",
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
