import { FC } from "react";
import { CartList, CheckoutForm, useCart } from "@/features";

export const CheckoutPage: FC = () => {
  const { items, total } = useCart();

  const handleCheckout = (data: any) => {
    console.log("data", data);
    console.log("items", items);
    console.log("total", total);

    // TODO: переход к оформлению / модалка заказа
  };

  return (
    <section>
      <h1 className="visually-hidden">Корзина</h1>
      <CartList items={items} total={total} />
      <CheckoutForm onSubmitOrder={handleCheckout} />
    </section>
  );
};
