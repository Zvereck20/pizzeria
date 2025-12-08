import type { FC } from "react";
import type { Product } from "@/features";
import { ProductCard } from "./ProductCard";

interface ProductsListProps {
  products: Product[];
}

export const ProductsList: FC<ProductsListProps> = ({ products }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};
