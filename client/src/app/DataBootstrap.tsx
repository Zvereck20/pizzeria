import type { FC } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  // useGetBannersQuery,
  // setBanners,
  useGetIngredientsQuery,
  setIngredients,
  useGetProductsQuery,
  setProducts as setProductsData,
} from "@/features";

export const DataBootstrap: FC = () => {
  const dispatch = useDispatch();

  const {
    data: products,
    isSuccess: productsReady,
    isError: productsError,
  } = useGetProductsQuery();
  const {
    data: ingredients,
    isSuccess: ingredientsReady,
    isError: ingredientsError,
  } = useGetIngredientsQuery();

  // const {
  //   data: banners,
  //   isSuccess: bannersReady,
  //   isError: bannersError,
  // } = useGetBannersQuery();

  useEffect(() => {
    if (productsReady && products) {
      dispatch(setProductsData(products));
    }
  }, [productsReady, products, dispatch]);

  useEffect(() => {
    if (ingredientsReady && ingredients) {
      dispatch(setIngredients(ingredients));
    }
  }, [ingredientsReady, ingredients, dispatch]);

  // useEffect(() => {
  //   if (bannersReady && banners) {
  //     dispatch(setBanners(banners));
  //   }
  // }, [bannersReady, banners, dispatch]);

  useEffect(() => {
    if (productsError) console.error("Failed to bootstrap products");
    if (ingredientsError) console.error("Failed to bootstrap ingredients");
    // if (bannersError) console.error("Failed to bootstrap banners");
  }, [productsError, ingredientsError]);

  return null;
};
