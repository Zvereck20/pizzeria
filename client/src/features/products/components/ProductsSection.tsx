import type { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { ProductsList } from "./ProductsList";
import { categoryLabels, type Category } from "../constants/categories";

export const ProductsSection = ({ category }: { category: Category }) => {
  const all = useSelector((s: RootState) => s.productsData.items);
  const products = all.filter((p) => p.category === category);

  return (
    <section className={`products products--${category}`}>
      <h2 className="products__heading">{categoryLabels[category]}</h2>

      {products.length ? (
        <ProductsList products={products} />
      ) : (
        <div className="products__empty">Нет товаров данной категории</div>
      )}
    </section>
  );
};
