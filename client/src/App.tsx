import type { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactModal from "react-modal";
import { CartProvider } from "@/features/cart";
import { AppRoutes } from "@/app/routes";

ReactModal.setAppElement("#root");

export const App: FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
};
