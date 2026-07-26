import { lazy, Suspense, type FC } from "react";
import { Route } from "react-router-dom";

const AdminLayout = lazy(() => import("../layouts/AdminLayout").then(({ AdminLayout: Component }) => ({ default: Component })));
const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage").then(({ AdminLoginPage: Component }) => ({ default: Component })));
const AdminProductsPage = lazy(() => import("../pages/AdminProductsPage").then(({ AdminProductsPage: Component }) => ({ default: Component })));
const AdminProductDetailsPage = lazy(() => import("../pages/AdminProductDetailsPage").then(({ AdminProductDetailsPage: Component }) => ({ default: Component })));
const AdminIngredientsPage = lazy(() => import("../pages/AdminIngredientsPage").then(({ AdminIngredientsPage: Component }) => ({ default: Component })));
const AdminIngredientDetailsPage = lazy(() => import("../pages/AdminIngredientDetailsPage").then(({ AdminIngredientDetailsPage: Component }) => ({ default: Component })));
const AdminOrdersPage = lazy(() => import("../pages/AdminOrdersPage").then(({ AdminOrdersPage: Component }) => ({ default: Component })));
const AdminOrderDetailsPage = lazy(() => import("../pages/AdminOrderDetailsPage").then(({ AdminOrderDetailsPage: Component }) => ({ default: Component })));
const AdminStoresPage = lazy(() => import("../pages/AdminStoresPage").then(({ AdminStoresPage: Component }) => ({ default: Component })));
const AdminStoreDetailsPage = lazy(() => import("../pages/AdminStoreDetailsPage").then(({ AdminStoreDetailsPage: Component }) => ({ default: Component })));
const AdminBannersPage = lazy(() => import("../pages/AdminBannersPage").then(({ AdminBannersPage: Component }) => ({ default: Component })));
const AdminBannerDetailsPage = lazy(() => import("../pages/AdminBannerDetailsPage").then(({ AdminBannerDetailsPage: Component }) => ({ default: Component })));
const AdminVacanciesPage = lazy(() => import("../pages/AdminVacanciesPage").then(({ AdminVacanciesPage: Component }) => ({ default: Component })));
const AdminVacancyDetailsPage = lazy(() => import("../pages/AdminVacancyDetailsPage").then(({ AdminVacancyDetailsPage: Component }) => ({ default: Component })));
const ProtectedAdminRoute = lazy(() => import("./ProtectedAdminRoute").then(({ ProtectedAdminRoute: Component }) => ({ default: Component })));

const load = (Component: FC) => (
  <Suspense fallback={null}>
    <Component />
  </Suspense>
);

export const AdminRoutes: FC = () => (
  <>
    <Route path="/admin/login" element={load(AdminLoginPage)} />
    <Route element={load(ProtectedAdminRoute)}>
      <Route path="/admin" element={load(AdminLayout)}>
        <Route path="products" element={load(AdminProductsPage)} />
        <Route path="products/:id" element={load(AdminProductDetailsPage)} />
        <Route path="ingredients" element={load(AdminIngredientsPage)} />
        <Route path="ingredients/:id" element={load(AdminIngredientDetailsPage)} />
        <Route path="orders" element={load(AdminOrdersPage)} />
        <Route path="orders/:id" element={load(AdminOrderDetailsPage)} />
        <Route path="stores" element={load(AdminStoresPage)} />
        <Route path="stores/:id" element={load(AdminStoreDetailsPage)} />
        <Route path="banners" element={load(AdminBannersPage)} />
        <Route path="banners/:id" element={load(AdminBannerDetailsPage)} />
        <Route path="vacancies" element={load(AdminVacanciesPage)} />
        <Route path="vacancies/:id" element={load(AdminVacancyDetailsPage)} />
      </Route>
    </Route>
  </>
);
