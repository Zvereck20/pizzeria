import { api } from "../../app/api";
import type { Ingredient } from "../ingredients/ingredientsApi";

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  ingredients: Ingredient[];
}

const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => "/products",
    }),
    getProductById: build.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
