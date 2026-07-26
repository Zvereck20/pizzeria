import type { FC } from "react";
import { Routes } from "react-router-dom";
import { AdminRoutes } from "@/admin/routes/AdminRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const AppRoutes: FC = () => (
  <Routes>
    <PublicRoutes />
    <AdminRoutes />
  </Routes>
);
