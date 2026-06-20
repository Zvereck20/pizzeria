import { categoryLabels } from "../constants/categories";
import { ProductsSection } from "./ProductsSection";

export const ProductLayout = () => {
  return (
    <>
      {categoryLabels.map(({ id, label }) => (
        <ProductsSection key={id} category={id} label={label} />
      ))}
    </>
  );
};
