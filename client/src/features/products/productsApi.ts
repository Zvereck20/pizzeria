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

export interface ProductMutationResponse extends Omit<Product, "ingredients"> {
  ingredients: string[];
  available: boolean;
}

export interface UpdateProductRequest {
  id: string;
  body: FormData;
}

export interface DeleteProductResponse {
  message: string;
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
    createProduct: build.mutation<ProductMutationResponse, FormData>({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<ProductMutationResponse, UpdateProductRequest>({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation<DeleteProductResponse, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
