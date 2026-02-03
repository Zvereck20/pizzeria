import type { FC } from "react";
import type { Product } from "@/features";
import { ProductCard } from "./ProductCard";

export const ProductsList: FC<{ products: Product[] }> = ({ products }) => {
  return (
    <ul className="products__container">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </ul>
  );
};
