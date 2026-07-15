import type { FC } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import {
  AdminProductsPage,
  AdminIngredientDetailsPage,
  AdminIngredientsPage,
  AdminLayout,
  AdminLoginPage,
  AdminOrderDetailsPage,
  AdminOrdersPage,
  AdminProductDetailsPage,
  ProtectedAdminRoute,
} from "@/admin";

ReactModal.setAppElement("#root");

const PublicLayout: FC = () => {
  return (
    <div className="container">
      <GlobalLoader />
      <Header />
      <Outlet />
      <Toaster position="top-center" />
      <Footer />
    </div>
  );
};

export const App: FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CheckoutPage />} />
            <Route path="/success-page" element={<OrderSuccessPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/vacancies" element={<VacanciesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/:id" element={<AdminProductDetailsPage />} />
              <Route path="ingredients" element={<AdminIngredientsPage />} />
              <Route path="ingredients/:id" element={<AdminIngredientDetailsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};
