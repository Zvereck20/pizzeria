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
