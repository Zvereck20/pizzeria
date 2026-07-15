import type { Product } from "@/features/products";

export interface ProductFormValues
  extends Pick<
    Product,
    "name" | "description" | "price" | "category" | "available" | "information"
  > {}

interface BuildProductFormDataParams {
  values: ProductFormValues;
  ingredientIds: string[];
  image: File | null;
}

export const buildProductFormData = ({
  values,
  ingredientIds,
  image,
}: BuildProductFormDataParams) => {
  const body = new FormData();
  const information = {
    weight: Number(values.information.weight),
    energy: Number(values.information.energy),
    proteins: Number(values.information.proteins),
    fats: Number(values.information.fats),
    carbohydrates: Number(values.information.carbohydrates),
  };

  body.append("name", values.name);
  body.append("description", values.description);
  body.append("price", String(Number(values.price)));
  body.append("category", values.category);
  body.append("available", String(values.available));
  body.append("information", JSON.stringify(information));
  body.append("ingredients", JSON.stringify(ingredientIds));

  if (image) {
    body.append("image", image);
  }

  return body;
};
