import type { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGetProductsQuery } from "./features/products/productsApi";
import { useGetStoresQuery } from "./features/stores/storeApi";

// import Home from "./pages/Home";
// import AdminPage from "./pages/AdminPage";
// import CheckoutPage from "./pages/CheckoutPage";

export const App: FC = () => {
  const { data, isLoading, error } = useGetProductsQuery();

  const { data: dataOrder } = useGetStoresQuery();

  if (isLoading) console.log("Is loading Now");
  if (error) console.log(error);

  dataOrder?.forEach((el) => {
    console.log(el);
  });

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/admin" element={<AdminPage />} />
    //     <Route path="/checkout" element={<CheckoutPage />} />
    //   </Routes>
    // </BrowserRouter>
    <>
      <div>Hello World</div>
      <ul>
        {data?.map(({ _id, name, price, image, category, description, ingredients }) => (
          <li key={_id}>
            {name}
            <br />
            {price}
            <br />
            {description}
            <br />
            <img src={`http://localhost:5000/uploads/${image}`} alt={name} width="100px" height="100px" />
            <br />
            {category}
            <br />
            {ingredients.map((i) => (
              <div key={i._id}>
                <p>{i.name}</p>
                <p>{i.price}</p>
                <img src={`http://localhost:5000/uploads/${i.image}`} alt={name} width="100px" height="100px" />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
};
