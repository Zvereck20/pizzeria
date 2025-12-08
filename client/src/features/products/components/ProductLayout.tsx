import { categoryOrder } from "../constants/categories";
import { ProductsSection } from "./ProductsSection";

export const ProductLayout = () => {
  return (
    <>
      {categoryOrder.map((cat) => (
        <ProductsSection key={cat} category={cat} />
      ))}
    </>
  );
};
