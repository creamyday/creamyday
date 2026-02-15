import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router";

// const API_URL = import.meta.env.VITE_API_URL;

// const handleLogin = async () => {
//   try {
//     const res = await axios.post(`${API_URL}/v2/admin/signin`, data);
//     const { token, expired } = res.data;

//     document.cookie = `token=${token}; expires=${new Date(expired)}; path=/`;
//     axios.defaults.headers.common["Authorization"] = token;

//     navigate("/");
//   } catch (error) {
//     console.log("登入失敗", error?.response || error);
//   }
// };

export default function Login() {
  const navigate = useNavigate();
  const [data,setData] = useState({
    username:null,
    password:null,
  })
  const [isError,setError] = useState(false);

  const changeData = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const { name ,value} = e.target;
    // console.log(name,value);
    setData({ ...data, [name]:value.trim()});
  }

  const submit = async ()=>{
    if (data.username === null || data.username === '' || data.password === null || data.password === ''){
      setError(true);
    }
    // console.log(data);
    if(isError)return;
    try {
      const res = await axios.post('/v2/admin/signin',data);
      const { token, expired } = res.data;
      axios.defaults.headers.common['Authorization'] = token;
      document.cookie = `token=${token};expired:${new Date(expired)}`;
      navigate('/');
    } catch (error) {
      console.error(error)
      setError(true);
    }
    // console.log(isError);
  }


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">歡迎登入，CreamyDay</h2>
          <div className={`alert alert-danger ${isError?'d-block':'d-none'}`} role="alert" >
            登入失敗
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="form-label w-100">
              Email
              <input id="email" className="form-control" name="username" type="email" placeholder="name@example.com" onChange={changeData} />
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="form-label w-100">
              密碼
              <input type="password" className="form-control" name="password" placeholder="Password" onChange={changeData}/>
            </label>
          </div>
          <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-primary text-center mb-2" onClick={submit}>登入</button>
        </div>
        <div>
          <p className="text-center mb-1">還沒​加入​會員​嗎?​ <a className="text-decoration-none" href="#">立即​加入</a>​</p>
          <p className="text-center mb-0"><a className="text-decoration-none" href="#">忘記密碼</a></p>
        </div>
        </div>
      </div>
    </div>
  )
}