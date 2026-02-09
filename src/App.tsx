import { Outlet } from "react-router";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

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
