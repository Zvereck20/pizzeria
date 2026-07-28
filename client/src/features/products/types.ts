import type { Ingredient } from "@/features/ingredients/types";
import type { Category } from "./constants/categories";

export interface ProductInformation {
  weight: number;
  energy: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category;
  available: boolean;
  ingredients: Ingredient[];
  information: ProductInformation;
}

export interface ProductMutationResponse extends Omit<Product, "ingredients"> {
  ingredients: string[];
}

export interface UpdateProductRequest {
  id: string;
  body: FormData;
}

export interface DeleteProductResponse {
  message: string;
}
