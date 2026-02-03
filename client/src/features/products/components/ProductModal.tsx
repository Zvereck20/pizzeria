import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeProductModal } from "../state/productsUISlice";
import {
  selectSelectedProductId,
  selectProductById,
  selectIngredients,
  statusProductModal,
} from "../state/selectors";
import type { RootState } from "@/app/store";
import { formatPrice } from "@/lib/format";
import { type Ingredient, IngredientsPicker, useCart } from "@/features";
import type { CartIngredient } from "@/features/cart/types";
import ReactModal from "react-modal";
import { Button } from "@/components";

export const ProductModal: FC = () => {
  const dispatch = useDispatch();
  const statusModal = useSelector(statusProductModal);
  const productId = useSelector(selectSelectedProductId);
  const product = useSelector((s: RootState) => selectProductById(productId)(s));
  const allIngs = useSelector(selectIngredients);
  const { addItem } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [productIngredients, setProductIngredients] = useState<Ingredient[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const total = useMemo(() => {
    const base = product?.price ?? 0;
    const extra = selected
      .map((id) => product?.ingredients.find((i) => i._id === id))
      .filter(Boolean)
      .reduce((sum, i) => sum + (i!.price || 0), 0);
    return base + extra;
  }, [product, selected, allIngs]);

  useEffect(() => {
    if (product && statusModal) {
      setIsOpen(true);
      setProductIngredients(product.ingredients);
    } else {
      setIsOpen(false);
      setSelected([]);
    }

    return () => {
      setIsOpen(false);
      setSelected([]);
    };
  }, [product, statusModal]);

  const startClose = () => {
    setIsOpen(false);
    dispatch(closeProductModal());
  };

  const onOrder = () => {
    if (!product) return;
    const ingredients: CartIngredient[] = selected
      .map((id) => allIngs.find((i) => i._id === id))
      .filter(Boolean)
      .map((el) => ({ _id: el!._id, name: el!.name, price: el!.price }));

    addItem({
      ingredients,
      name: product.name,
      image: product.image!,
      productId: product._id,
      productPrice: product.price,
      quantity: 1,
    });

    startClose();
  };

  if (!product) {
    return <ReactModal isOpen={false}></ReactModal>;
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={startClose}
      className={"modal__content"}
      overlayClassName={"modal__overlay"}
      closeTimeoutMS={1000}
      preventScroll={true}
    >
      <div className="product-modal__header">
        <h2 className="product-modal__title">{product.name}</h2>
        <button
          type="button"
          className="modal__close"
          aria-label="Закрыть"
          onClick={startClose}
        >
          ×
        </button>
      </div>

      <div className="product-modal__body">
        <div className="product-modal__image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-modal__wrap">
          <IngredientsPicker
            items={productIngredients}
            selectedIds={selected}
            onChange={setSelected}
          />
        </div>
      </div>

      <div className="product-modal__footer">
        <div className="product-modal__base">
          Базовая цена:{" "}
          <span className="product-modal__base-value">
            {formatPrice(product.price || 0)}
          </span>
        </div>
        <Button type="button" variant="classic" onClick={onOrder}>
          Заказать · {formatPrice(total)}
        </Button>
      </div>
    </ReactModal>
  );
};
