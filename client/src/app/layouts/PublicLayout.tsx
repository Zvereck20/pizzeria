import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Footer, GlobalLoader, Header } from "@/components";

export const PublicLayout: FC = () => {
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
