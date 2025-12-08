import type { FC } from "react";
import { CartItemCard } from "./CartItemCard";
import { useCart } from "@/features";
import { Separator } from "@/components";
import { formatPrice } from "@/lib/format";

export const CartList: FC = () => {
  const { items, total } = useCart();

  if (!items.length) {
    return <div className="rounded-xl border bg-white p-6 text-center text-sm text-muted-foreground ">Ваша корзина пуста</div>;
  }

  return (
    // <div className={className}>
    <div>
      <h2 className="mb-4 text-2xl font-bold">Состав заказа:</h2>
      <div className="space-y-3">
        {items.map((it) => (
          <CartItemCard key={it.uid} item={it} />
        ))}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap justify-between gap-3">
        <div className="text-lg font-semibold">
          Итого: <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};
