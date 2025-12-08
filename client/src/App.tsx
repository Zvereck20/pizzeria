import type { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "@/components";

// import { useGetStoresQuery } from "./features/stores/storeApi";

import { DataBootstrap } from "./app/DataBootstrap";
import { Home, CheckoutPage } from "@/pages";
import { CartProvider, useGetProductsQuery } from "@/features";

export const App: FC = () => {
  const { data, isLoading, error } = useGetProductsQuery();

  // const { data: dataOrder } = useGetStoresQuery();

  if (isLoading) console.log("Is loading Now");
  if (error) console.log(error);

  // dataOrder?.forEach((el) => {
  //   console.log(el);
  // });

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="container">
          <DataBootstrap />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CheckoutPage />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};
