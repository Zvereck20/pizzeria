import { api } from "@/app/api";
import type { Ingredient } from "@/features";

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
  category: string;
  ingredients: Ingredient[];
  information: ProductInformation;
}

const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => "/products",
      keepUnusedDataFor: 86400,
      providesTags: ["Products"],
    }),
    getProductById: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
