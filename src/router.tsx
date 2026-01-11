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
], {
  basename: import.meta.env.DEV ? '/' : import.meta.env.VITE_GITHUB_PAGES_PATH, // 這裡一定要加，且要跟你的倉庫名稱一致
});

export default createRoutes;
