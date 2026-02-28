import { Outlet } from "react-router";
import { Provider } from 'react-redux';
import { stores } from './stores/allStores';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Toast from "./components/Toast";

function App() {
  return (
    <Provider store={stores}>
      <Header />
      <Toast />
      <Outlet />
      <Footer />
    </Provider>
  )
}

export default App
