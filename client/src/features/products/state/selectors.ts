import type { RootState } from "@/app/store";

export const statusProductModal = (s: RootState) => s.productsUI.isProductModalOpen;
export const selectSelectedProductId = (s: RootState) => s.productsUI.selectedProductId;
