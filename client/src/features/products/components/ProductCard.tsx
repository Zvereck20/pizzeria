import { useState, type FC } from "react";
import { useDispatch } from "react-redux";
import { openProductModal } from "../state/productsUISlice";
import { useCart, Product } from "@/features";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

export const ProductCard: FC<{
  product: Pick<Product, "_id" | "name" | "image" | "description" | "price">;
}> = ({ product }) => {
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

  return (
    <div className="product">
      <div className="product__img">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <img
            src="/images/default-product.png"
            alt="Стандартное изображение"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        )}

        {/* {product.isHit && (
            <span aria-label="Хит" className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-md bg-red-500 text-white shadow">
              Хит
            </span>
          )} */}
      </div>

      <div className="product__container">
        <h3 className="product__title">{product.name}</h3>

        <p className="product__description">{product.description}</p>
        <div className="product__price">{formatPrice(product.price)}</div>
        <div className="products__wrap">
          <Button
            variant="classic"
            onClick={() => onOpenModal(product._id)}
            aria-label="Открыть модалку ингредиентов"
          >
            Ингредиенты
          </Button>
          <Button
            variant="classic"
            onClick={onAddItem}
            aria-label="Добавить товар в корзину"
          >
            Добавить в корзину
          </Button>
        </div>
      </div>
    </div>
  );
};
