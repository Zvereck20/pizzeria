import { useEffect, useMemo, type FC } from "react";
import { ProductsList } from "./ProductsList";
import { Category } from "../constants/categories";
import { Product, useGetProductsQuery } from "../productsApi";
import { ErrorBlock } from "@/components";

export const ProductsSection: FC<{ category: Category; label: string }> = ({
  category,
  label,
}) => {
  const { data, isError } = useGetProductsQuery();

  const products = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => p.category === category);
  }, [data, category]);

  if (isError) return <ErrorBlock />;

  return (
    <section className={`products products--${category}`} id={category}>
      <h2 className="products__heading">{label}</h2>

      {products.length ? (
        <ProductsList products={products} />
      ) : (
        <div className="products__empty">Нет товаров данной категории</div>
      )}
    </section>
  );
};
