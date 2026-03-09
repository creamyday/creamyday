import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  async function handleSubmit(email: string, password: string) {
  try {
    const res = await axios.post(`${API_BASE_URL}/v2/admin/signin`, {
      username: email,
      password
    });
    console.log("Sign-in successful:", res.data);
    const { token, expired } = res.data;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    document.cookie = `creamydayToken=${token}; expires=${new Date(expired)}`;
    navigate("/admin/upload");
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
}

  return <>
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="col-4">
          <form onSubmit={(e)=> {
                e.preventDefault();
                handleSubmit(email, password);
              }}>
            <div className="form-floating">
              <input type="email" className="form-control" id="emailInput" placeholder="email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="emailInput">Email address</label>
            </div>
            <div className="form-floating mt-3">
              <input type="password" className="form-control" id="passwordInput" placeholder="password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="passwordInput">Password</label>
            </div>
              <button type="submit" className="btn btn-lg btn-primary mt-3 w-100">登入</button>
          </form>
        </div>
      </div>
    </div>
  </>;
}
