import { Outlet } from "react-router";
import Header from "./layout/Header";

function App() {
  return (
    <>
      <Header />
      <div className='container'>
        <Outlet />
      </div>
    </>
  )
}

export default App
