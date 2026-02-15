import { Outlet } from "react-router";
import Header from "./assets/layout/Header";
import Footer from "./assets/layout/Footer";

function App() {
  return (
    <>
      <Header />
      <div className='container'>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default App
