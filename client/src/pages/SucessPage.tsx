import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "@/app/store";

export const OrderSuccessPage: FC = () => {
  const order = useSelector((s: RootState) => s.order);

  if (!order) return <div>Заказ не найден</div>;

  return (
    <section className="order-success">
      <h1>Ваш заказ принят!</h1>
      <p>Номер заказа: {order.number}</p>
      <p>Сумма: {order.totalPrice} ₽</p>
      <p>Мы вам перезвоним</p>
      <Link to="/">Вернуться на главную</Link>
    </section>
  );
};
