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
        path: "/about",
        Component: About,
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
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, 
        element: <Navigate to="dashboard" replace /> 
      },
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
  }
]);

export default createRoutes;
