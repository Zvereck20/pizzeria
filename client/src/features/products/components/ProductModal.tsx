import type { FC } from "react";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeProductModal } from "../state/productsUISlice";
import {
  selectSelectedProductId,
  selectProductById,
  selectIngredients,
} from "../state/selectors";
import { formatPrice } from "@/lib/format";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button } from "@/components";
import { IngredientsPicker, useCart } from "@/features";
import type { CartIngredient } from "@/features/cart/types";

export const ProductModal: FC = () => {
  const dispatch = useDispatch();
  const productId = useSelector(selectSelectedProductId);
  const product = useSelector(useMemo(() => selectProductById(productId), [productId]));
  const allIngs = useSelector(selectIngredients);
  const { addItem } = useCart();

  const [selected, setSelected] = useState<string[]>(
    () => product?.ingredients?.map((i: any) => (typeof i === "string" ? i : i._id)) ?? []
  );
  const key = productId ?? "closed";

  const total = useMemo(() => {
    const base = product?.price ?? 0;
    const extra = selected
      .map((id) => allIngs.find((i) => i._id === id))
      .filter(Boolean)
      .reduce((sum, i) => sum + (i!.price || 0), 0);
    return base + extra;
  }, [product, selected, allIngs]);

  const onOrder = () => {
    if (!product) return false;

    const ingredients: CartIngredient[] = [];

    const selectedIngredients = selected.map((id) => allIngs.find((i) => i._id === id));

    selectedIngredients.forEach((el) => {
      const ingredient = {
        _id: el!._id,
        name: el!.name,
        price: el!.price,
      };

      ingredients.push(ingredient);
    });

    addItem({
      ingredients,
      name: product.name,
      image: product.image!,
      productId: product._id,
      productPrice: product?.price,
      quantity: 1,
    });

    dispatch(closeProductModal());
  };

  const onOpenChange = (open: boolean) => {
    if (!open) dispatch(closeProductModal());
  };

  // return (
  //   <Dialog open={!!productId} onOpenChange={onOpenChange}>
  //     {product && (
  //       <DialogContent key={key} className="sm:max-w-[720px]">
  //         <DialogHeader>
  //           <DialogTitle className="flex items-center gap-2">
  //             {product.name}
  //             {/* {product.isHit && <Badge>Хит</Badge>} */}
  //           </DialogTitle>
  //         </DialogHeader>

  //         <div className="grid gap-4 md:grid-cols-[280px_1fr]">
  //           {/* Изображение */}
  //           <div className="rounded-lg border bg-muted/20 p-2">
  //             <div className="aspect-square overflow-hidden rounded-md bg-white">
  //               <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
  //             </div>
  //           </div>

  //           <IngredientsPicker items={allIngs} selectedIds={selected} onChange={setSelected} />
  //         </div>

  //         <DialogFooter className="flex items-center justify-between gap-4">
  //           <div className="text-sm text-muted-foreground">
  //             Базовая цена: <span className="font-medium text-foreground">{formatPrice(product.price || 0)}</span>
  //           </div>
  //           <Button onClick={onOrder}>Заказать · {formatPrice(total)}</Button>
  //         </DialogFooter>
  //       </DialogContent>
  //     )}
  //   </Dialog>
  // );
  return <h2>Halo probuct modal</h2>;
};
