import { api } from "../../app/api";

export interface Ingredient {
  _id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
}

const ingredientsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIngredients: build.query<Ingredient[], void>({
      query: () => "/ingredients",
    }),
    getIngredientById: build.query<Ingredient, string>({
      query: (id) => `/ingredients/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetIngredientsQuery, useGetIngredientByIdQuery } = ingredientsApi;
