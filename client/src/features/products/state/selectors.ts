import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export const selectProducts = (s: RootState) => s.productsData.items; // твой слайс
export const selectIngredients = (s: RootState) => s.ingredients.items; // твой слайс
export const selectSelectedProductId = (s: RootState) => s.productsUI.selectedProductId;

export const selectProductById = (id?: string | null) => createSelector([selectProducts], (items) => items.find((p) => p._id === id) || null);

export const selectIngredientsByIds = (ids: string[]) => createSelector([selectIngredients], (all) => all.filter((i) => ids.includes(i._id)));

export const selectTotalPrice = (productId?: string | null, selectedIngIds: string[] = []) =>
  createSelector([selectProductById(productId), selectIngredients], (product, allIngs) => {
    if (!product) return 0;
    const base = product.price ?? 0;
    const extra = selectedIngIds
      .map((id) => allIngs.find((i) => i._id === id))
      .filter(Boolean)
      .reduce((acc, i) => acc + (i!.price || 0), 0);
    return base + extra;
  });
