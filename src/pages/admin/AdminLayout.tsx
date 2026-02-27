import axios from "axios"
import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_API_URL;

const getToken = () => 
  document.cookie.replace(/(?:(?:^|.*;\s*)creamydayToken\s*\=\s*([^;]*).*$)|^.*$/,
    "$1");

export default function AdminLayout() {
  
  const navigate = useNavigate();
  const [ isChecking, setIsChecking ] = useState(true);

  // 檢查登入狀態promise
  useEffect(() => {
    const creamydayToken:string = getToken();
    axios.defaults.headers.common["Authorization"] = creamydayToken;
    (async () => {
      try {
        const res = await axios.post(`${baseUrl}/v2/api/user/check`)
        if (res.data.success) setIsChecking(false);
      } catch (error:any) {
        console.warn(error.response);
        navigate('/adminLogin');
      }
    })()
  },[])

  return (
    <>
    { isChecking ? null : 
      <div className="d-flex">
        <aside className="adminSidebar">
          <AdminSidebar />
        </aside>
        <div className="mainContent">
          <AdminHeader />
          <main className="flex-grow-1">
            <Outlet />
          </main>
        </div>
      </div>
    }
    </>
  )
}