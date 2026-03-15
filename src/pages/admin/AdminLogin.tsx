import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const baseUrl = import.meta.env.VITE_API_URL;


const getToken = () => 
  document.cookie.replace(/(?:(?:^|.*;\s*)creamydayToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1");


export default function AdminLogin() {

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const loginSubmit = (data:object) => {
    (async () => {
      try {
        const res = await axios.post(`${baseUrl}/v2/admin/signin`,data)
        document.cookie = `creamydayToken=${res.data.token}; expires=${new Date(res.data.expired)}`;
        navigate('/admin');
      } catch (error: unknown) {
        console.warn(error);
      }
    })();
  }

  // 檢查登入狀態promise
  useEffect(() => {
    const creamydayToken:string = getToken();
    axios.defaults.headers.common["Authorization"] = creamydayToken;
    (async () => {
      try {
        const res = await axios.post(`${baseUrl}/v2/api/user/check`)
        console.log(res);
        navigate('/admin/dashboard');
      } catch (error: unknown) {
        console.warn(error);
      }
    })()
  },[navigate])

  return (
    <>
    <div className="container mt-4">
      <h5 className="text-center">Creamyday後台管理系統</h5>
      <div className="row justify-content-center mt-4">
        <div className="col-sm-5 col-8">
          <form onSubmit={handleSubmit(loginSubmit)}>
            <div className="row mb-3">
              <label htmlFor="username" className="col-sm-3 col-form-label">帳號:</label>
              <div className="col-sm-9">
                <input type="text" className="form-control"
                  {...register("username")} />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="username" className="col-sm-3 col-form-label">密碼:</label>
              <div className="col-sm-9">
                <input type="password" className="form-control"
                  {...register("password")} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary form-control">送出</button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}