import type { FC } from "react";
// import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/features";
import type { CartItem } from "@/features/cart/types";
import { Button, Separator } from "@/components/";
import { QuantityControl } from "./QuantityControl";

export const CartItemCard: FC<{ item: CartItem }> = ({ item }) => {
  const { remove, incQuantity } = useCart();

  const lineTotal = item.itemPrice * item.quantity;

  return (
    <li className="cart__item">
      <div className="cart__img">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
      </div>

      <div className="cart__wrap">
        <h3 className="cart__title">{item.name}</h3>
        {item.ingredients?.length ? (
          <ul className="cart__ingredients">
            <li className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {item.ingredients.map((g) => g.name).join(", ")}
            </li>
          </ul>
        ) : (
          <p className="cart__ingredients--empty">Без добавок</p>
        )}
      </div>

      <div className="cart__price">{formatPrice(item.itemPrice)}</div>

      <QuantityControl
        value={item.quantity}
        onInc={() => incQuantity(item.uid, true)}
        onDec={() => incQuantity(item.uid, false)}
      />

      <div className="cart__total">{formatPrice(lineTotal)}</div>

      <Button
        className="cart__remove"
        type="button"
        variant="classic"
        onClick={() => remove(item.uid)}
        aria-label="Удалить позицию"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="trash">
            <path
              id="Vector"
              d="M3 6H5H21"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </Button>
    </li>
  );
};
