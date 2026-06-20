import { FC } from "react";
import { useCart } from "@/features";
import { formatPrice } from "@/lib/format";
import { Link } from "react-router-dom";

export const CartSummary: FC = () => {
  const { total } = useCart();

  return (
    <>
      {total ? (
        <Link className="cart-header" to="/cart" aria-label="Корзина">
          <img
            className="cart-header__img"
            src="/images/basket.png"
            width={47}
            height={47}
            alt="корзина"
          />
          <div className="cart-header__summary">{formatPrice(total)}</div>
        </Link>
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
