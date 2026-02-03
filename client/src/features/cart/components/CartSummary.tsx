import { FC } from "react";
import { useCart } from "@/features";
import { formatPrice } from "@/lib/format";

export const CartSummary: FC = () => {
  const { total } = useCart();

  return (
    <>
      {total ? (
        <a className="cart-header" href="/cart" aria-label="Корзина">
          <img
            className="cart-header__img"
            src="/images/basket.png"
            width={47}
            height={47}
            alt="корзина"
          />
          <div className="cart-header__summary">{formatPrice(total)}</div>
        </a>
      ) : (
        <div className="cart-header cart-header--empty">
          <img
            className="cart-header__img"
            src="/images/basket.png"
            width={47}
            height={47}
            alt="корзина"
          />
          <div className="cart-header__summary">{formatPrice(total)}</div>
        </div>
      )}
    </>
  );
};
