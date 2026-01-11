import { createHashRouter } from "react-router";
// custom page
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/admin/Home";
import About from "./pages/admin/About";

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
]);

export default createRoutes;
