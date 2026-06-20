import type { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactModal from "react-modal";
import { Toaster } from "react-hot-toast";
import { Header, Footer, GlobalLoader } from "@/components";
import {
  Home,
  CheckoutPage,
  OrderSuccessPage,
  StoresPage,
  AboutPage,
  VacanciesPage,
  NotFound,
} from "@/pages";
import { CartProvider } from "@/features";

ReactModal.setAppElement("#root");

export const App: FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="container">
          <GlobalLoader />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CheckoutPage />} />
            <Route path="/success-page" element={<OrderSuccessPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/vacancies" element={<VacanciesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" />
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};
