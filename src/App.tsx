import { Outlet } from "react-router";
import { Provider } from "react-redux";
import { stores } from "./stores/allStores";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Toast from "./components/Toast";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Provider store={stores}>
      <ScrollToTop /> 
      <Header />
      <Toast />
      <Outlet />
      <Footer />
    </Provider>
  );
}

export default App;
