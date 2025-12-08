import type { FC } from "react";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/features";
import type { CartItem } from "@/features/cart/types";
import { Button, Separator } from "@/components/";
import { QuantityControl } from "./QuantityControl";

type Props = {
  item: CartItem; // одна позиция корзины
};

export const CartItemCard: FC<Props> = ({ item }) => {
  const { remove, incQuantity } = useCart();

  const lineTotal = item.itemPrice * item.quantity;

  return (
    <div className={"w-full rounded-xl border bg-white p-3 sm:p-4"}>
      <div className="flex items-start gap-3 sm:gap-4">
        {/* img */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white sm:h-24 sm:w-24">
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">нет фото</div>
          )}
        </div>

        {/* content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">{item.name}</h3>
              {/* ингредиенты: имена через запятую */}
              {item.ingredients?.length ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.ingredients.map((g) => g.name).join(", ")}</p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Без добавок</p>
              )}
            </div>

            {/* удалить */}
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(item.uid)} aria-label="Удалить позицию">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="my-3" />

          {/* bottom: цена за единицу, кол-во, сумма */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              За единицу: <span className="font-medium text-foreground">{formatPrice(item.itemPrice)}</span>
            </div>

            <QuantityControl value={item.quantity} onInc={() => incQuantity(item.uid, true)} onDec={() => incQuantity(item.uid, false)} />

            <div className="ml-auto text-base font-semibold">{formatPrice(lineTotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
