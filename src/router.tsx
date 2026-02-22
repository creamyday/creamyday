import { createHashRouter } from "react-router";
// custom page
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/customer/Home";
import About from "./pages/customer/About";
import NotFound from "./pages/NotFound";
import Products from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import Faqs from "./pages/customer/Faqs";
import ForgetPassword from "./pages/customer/ForgetPassword";


const createRoutes = createHashRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: '/forgetPassword',
        Component: ForgetPassword,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "products/:category",
        Component: Products,
      },
      {
        path: "products/:category/:productId",
        Component: ProductDetail,
      },
      {
        path: "faq",
        Component: Faqs,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default createRoutes;
