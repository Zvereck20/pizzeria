import { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSendOrderEmailMutation } from "@/app/emailApi";
import {
  CartList,
  CheckoutForm,
  useCart,
  type CheckoutFormValues,
  useCreateOrderMutation,
  mapCheckoutToOrder,
  setOrder,
} from "@/features";

export const CheckoutPage: FC = () => {
  const { items, total, clear } = useCart();
  const [createOrder] = useCreateOrderMutation();
  const [sendOrderEmail] = useSendOrderEmailMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async (form: CheckoutFormValues) => {
    const data = mapCheckoutToOrder(form, items, total);

    try {
      const response = await createOrder(data).unwrap();

      const email = {
        to: "Zvereck27@yandex.ru",
        subject: "Заказ оформлен",
        message: `<h1>Заказ №${response.number} оформлен</h1><p>Перейдите в админ панель <a href="http://localhost:5173/admin">сайта</a> для ознакомления и изменения статуса</p>`,
      };

      const emailStatus = await sendOrderEmail(email).unwrap();

      console.log("email-status", emailStatus);

      dispatch(setOrder(response));
      clear();
      navigate("/success-page");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <h1 className="visually-hidden">Корзина</h1>
      <CartList items={items} total={total} />
      <CheckoutForm onSubmitOrder={handleCheckout} />
    </section>
  );
};
