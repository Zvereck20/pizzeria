import { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async (form: CheckoutFormValues) => {
    const data = mapCheckoutToOrder(form, items);

    try {
      const response = await createOrder(data).unwrap();

      dispatch(setOrder(response));
      clear();
      navigate("/success-page");
    } catch (error) {
      console.error("Checkout error:", error);
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
