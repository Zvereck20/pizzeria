import { Route } from "react-router-dom";
import {
  AboutPage,
  CheckoutPage,
  Home,
  NotFound,
  OrderSuccessPage,
  StoresPage,
  VacanciesPage,
} from "@/pages";
import { PublicLayout } from "@/app/layouts/PublicLayout";

export const PublicRoutes = (
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<CheckoutPage />} />
    <Route path="/success-page" element={<OrderSuccessPage />} />
    <Route path="/stores" element={<StoresPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/vacancies" element={<VacanciesPage />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
