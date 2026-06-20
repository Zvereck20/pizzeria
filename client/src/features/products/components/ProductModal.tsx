import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeProductModal } from "../state/productsUISlice";
import {
  selectSelectedProductId,
  // selectIngredients,
  statusProductModal,
} from "../state/selectors";
import type { RootState } from "@/app/store";
import { formatPrice } from "@/lib/format";
import {
  type Ingredient,
  IngredientsPicker,
  ProductInformation,
  useCart,
  useGetProductByIdQuery,
} from "@/features";
import type { CartIngredient } from "@/features/cart/types";
import ReactModal from "react-modal";
import { Button } from "@/components";
import { skipToken } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

export const ProductModal: FC = () => {
  const dispatch = useDispatch();
  const statusModal = useSelector(statusProductModal);
  const productId = useSelector(selectSelectedProductId);
  const { data: product } = useGetProductByIdQuery(productId ?? skipToken);
  const { addItem } = useCart();

  console.log(product, "product");

  const [isOpen, setIsOpen] = useState(false);
  const [productIngredients, setProductIngredients] = useState<Ingredient[]>([]);
  const [productInfromation, setProductInformation] = useState<ProductInformation>();
  const [selected, setSelected] = useState<string[]>([]);

  const total = useMemo(() => {
    const base = product?.price ?? 0;
    const extra = selected
      .map((id) => product?.ingredients.find((i) => i._id === id))
      .filter(Boolean)
      .reduce((sum, i) => sum + (i!.price || 0), 0);
    return base + extra;
  }, [product, selected]);

  useEffect(() => {
    if (product && statusModal) {
      setIsOpen(true);
      setProductIngredients(product.ingredients);
      setProductInformation(product.information);
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
      .map((id) => productIngredients?.find((i) => i._id === id))
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
    toast.success("Товар добавлен в корзину");
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
      // closeTimeoutMS={1000}
      preventScroll={true}
    >
      <div className="product-modal">
        <button
          type="button"
          className="modal__close"
          aria-label="Закрыть"
          onClick={startClose}
        >
          ×
        </button>
        <div className="product-modal__image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-modal__container">
          <div className="product-modal__content">
            <h2 className="product-modal__title">{product.name}</h2>
            <ul className="product-modal__information">
              <li>
                Энерг. ценность <span>{productInfromation?.energy} ккал</span>
              </li>
              <li>
                Белки <span>{productInfromation?.proteins} гр.</span>
              </li>
              <li>
                Жиры <span>{productInfromation?.fats} гр.</span>
              </li>
              <li>
                Углеводы <span>{productInfromation?.carbohydrates} гр.</span>
              </li>
              <li>
                Вес <span>{productInfromation?.weight} гр.</span>
              </li>
            </ul>
            <div className="product-modal__wrap">
              <IngredientsPicker
                items={productIngredients}
                selectedIds={selected}
                onChange={setSelected}
              />
            </div>
          </div>
          <div className="product-modal__order">
            <Button type="button" variant="order" onClick={onOrder}>
              Заказать · {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
