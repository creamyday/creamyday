import { Outlet } from "react-router";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

function App() {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default App
