import { Outlet } from "react-router";
import { Provider } from 'react-redux';
import { stores } from './stores/allStores';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Cart from "./components/Cart";
import Toast from "./components/Toast";

function App() {
  return (
    <Provider store={stores}>
      <Header />
      <Toast />
      <Cart/>
      <Outlet />
      <Footer />
    </Provider>
  )
}

export default App
