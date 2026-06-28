import { api } from "../../app/api";

export interface Ingredient {
  _id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
}

export interface UpdateIngredientRequest {
  id: string;
  body: FormData;
}

export interface DeleteIngredientResponse {
  message: string;
}

const ingredientsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIngredients: build.query<Ingredient[], void>({
      query: () => "/ingredients",
      keepUnusedDataFor: 86400,
      providesTags: ["Ingredients"],
    }),
    getIngredientById: build.query<Ingredient, string>({
      query: (id) => `/ingredients/${id}`,
      providesTags: ["Ingredients"],
    }),
    createIngredient: build.mutation<Ingredient, FormData>({
      query: (body) => ({
        url: "/admin/ingredients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ingredients"],
    }),
    updateIngredient: build.mutation<Ingredient, UpdateIngredientRequest>({
      query: ({ id, body }) => ({
        url: `/admin/ingredients/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Ingredients"],
    }),
    deleteIngredient: build.mutation<DeleteIngredientResponse, string>({
      query: (id) => ({
        url: `/admin/ingredients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ingredients"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIngredientsQuery,
  useGetIngredientByIdQuery,
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApi;
