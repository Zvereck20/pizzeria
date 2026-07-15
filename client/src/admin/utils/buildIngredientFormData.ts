import type { Ingredient } from "@/features/ingredients";

export interface IngredientFormValues
  extends Pick<Ingredient, "name" | "price" | "available"> {}

interface BuildIngredientFormDataParams {
  values: IngredientFormValues;
  image: File | null;
}

export const buildIngredientFormData = ({
  values,
  image,
}: BuildIngredientFormDataParams) => {
  const body = new FormData();

  body.append("name", values.name);
  body.append("price", String(Number(values.price)));
  body.append("available", String(values.available));

  if (image) {
    body.append("image", image);
  }

  return body;
};
