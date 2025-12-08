import { CartList, CheckoutForm } from "@/features";
import { FC } from "react";

export const CheckoutPage: FC = () => {
  const handleCheckout = (data: any) => {
    console.log(data);

    // TODO: переход к оформлению / модалка заказа
  };

  return (
    <section>
      <h1 className="hidden">Корзина</h1>
      <CartList />
      <CheckoutForm onSubmitOrder={handleCheckout} />
    </section>
  );
};
