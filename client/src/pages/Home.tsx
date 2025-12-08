import type { FC } from "react";
import { Banners, ProductModal, ProductLayout } from "@/features";

export const Home: FC = () => {
  return (
    <>
      <Banners />
      <ProductLayout />
      <ProductModal />
    </>
  );
};
