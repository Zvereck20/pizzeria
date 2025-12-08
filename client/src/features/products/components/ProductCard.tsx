import type { FC } from "react";
import { useDispatch } from "react-redux";
import { openProductModal } from "../state/productsUISlice";
// import { Card, CardContent, CardFooter, CardHeader, Button } from "@/components";
import { useCart, Product } from "@/features";
// (опционально) если используешь lucide-react, раскомментируй и добавь иконку в fallback
// import { ImageOff } from "lucide-react";

export type ProductCardProps = {
  // product: Pick<Product, "_id" | "name" | "image" | "description" | "price" | "isHit">;
  product: Pick<Product, "_id" | "name" | "image" | "description" | "price">;
  className?: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }).format(value);

export const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  const dispatch = useDispatch();
  const { addItem } = useCart();

  const onOpenModal = (id: string) => {
    dispatch(openProductModal(id));
  };

  const onAddItem = () => {
    addItem({
      name: product.name,
      image: product.image,
      productId: product._id,
      productPrice: product.price,
      ingredients: [],
      quantity: 1,
    });
  };

  // return (
  //   <Card className={`rounded-2xl p-4 transition-transform ${className ?? ""}`}>
  //     <CardContent className="p-0">
  //       <div className="relative overflow-hidden rounded-xl aspect-square">
  //         {product.image ? (
  //           <img
  //             src={product.image}
  //             alt={product.name}
  //             loading="lazy"
  //             decoding="async"
  //             className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
  //           />
  //         ) : (
  //           <div className="w-full h-full grid place-items-center bg-muted text-muted-foreground">
  //             {/* <ImageOff className="w-6 h-6" /> */}
  //             <span className="text-xs">Нет изображения</span>
  //           </div>
  //         )}

  //         {/* {product.isHit && (
  //           <span aria-label="Хит" className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-md bg-red-500 text-white shadow">
  //             Хит
  //           </span>
  //         )} */}
  //       </div>
  //     </CardContent>

  //     <CardHeader className="p-0 mt-3 space-y-1">
  //       <h3 className="text-lg font-semibold leading-snug line-clamp-2">{product.name}</h3>
  //     </CardHeader>

  //     <CardContent className="p-0 mt-1 space-y-2">
  //       {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
  //       <div className="text-base font-semibold">{formatPrice(product.price)}</div>
  //     </CardContent>

  //     <CardFooter className="p-0 mt-4">
  //       <Button size="sm" onClick={() => onOpenModal(product._id)} aria-label="Открыть модалку ингредиентов">
  //         Ингредиенты
  //       </Button>
  //       <Button size="sm" onClick={onAddItem} aria-label="Добавить товар в корзину">
  //         Добавить в корзину
  //       </Button>
  //     </CardFooter>
  //   </Card>
  // );
  return <h2>Halo product Card</h2>;
};
