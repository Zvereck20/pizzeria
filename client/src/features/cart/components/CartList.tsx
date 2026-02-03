import type { FC } from "react";
import { CartItemCard } from "./CartItemCard";
import { formatPrice } from "@/lib/format";
import { type CartItem } from "../types";

interface CartListProps {
  items: CartItem[];
  total: number;
}

export const CartList: FC<CartListProps> = ({ items, total }) => {
  if (!items.length) {
    return <div className="cart__empty">Ваша корзина пуста</div>;
  }

  return (
    <div>
      <h2 className="cart__heading">Состав заказа:</h2>
      <ul className="cart__list">
        {items.map((it) => (
          <CartItemCard key={it.uid} item={it} />
        ))}
      </ul>

      <div className="cart__summary">
        <p>
          Итого: <span className="cart__summary-nums">{formatPrice(total)}</span>
        </p>
      </div>
    </div>
  );
};
