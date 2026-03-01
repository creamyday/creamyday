import { createHashRouter, Navigate } from "react-router";

// custom page
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/customer/Home";
import About from "./pages/customer/About";
import Dashboard from "./pages/admin/Dashboard";
import Signin from "./pages/admin/Signin";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductsManagement from "./pages/admin/ProductsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import AdminLogin from "./pages/admin/AdminLogin";
import CouponsManagement from "./pages/admin/CouponsManagement";
import NotFound from "./pages/NotFound";
import Products from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import Faqs from "./pages/customer/Faqs";
import ForgetPassword from "./pages/customer/ForgetPassword";
import Carts from "./pages/customer/Carts";
import Checkout from "./pages/customer/Checkout";
import Order from "./pages/customer/Order";

import Profile from "./pages/customer/Profile";
import Favorite from "./pages/customer/favorite";
import Password from "./pages/customer/Password";
import Orders from "./pages/customer/Orders";

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
        path: "/forgetPassword",
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
        path: "/carts",
        Component: Carts,
      },
      {
        path: "/checkout",
        Component: Checkout,
      },
      {
        path: "/order",
        Component: Order,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/favorite",
        Component: Favorite,
      },
      {
        path: "/orders",
        Component: Orders,
      },
      {
        path: "/password",
        Component: Password,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "/adminLogin",
    Component: AdminLogin,
  },
  {
    path: "/adminSignin",
    Component: Signin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "products",
        Component: ProductsManagement,
      },
      {
        path: "orders",
        Component: OrdersManagement,
      },
      {
        path: "coupons",
        Component: CouponsManagement,
      },
    ],
  },
]);

export default createRoutes;
