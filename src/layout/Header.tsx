import { Link, useNavigate } from "react-router";
import "./Header.scss";
import logo from "../../public/logo1.png";

export default function Header() {
  const navigate = useNavigate();
  const logout = () => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - 480).toLocaleString();
    document.cookie = `token=; expires=${date}`;
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-white">
      <div className="container d-flex  align-items-center ">

      {/* 電腦版的header 左邊的logo+文字 */}
      <div className="brand d-flex align-items-center">
        <div className="logo-circle">
          <img src={logo} alt="CreamyDay Logo"/>
        </div>
        <h1 className="navbar-brand text-primary">CreamyDay</h1>
        </div>
        
        {/* 手機的漢堡選單 */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

         {/* 電腦版的header 項目 */}
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">

            <li className="nav-item">
              <Link className="nav-link h5 py-12" aria-current="page" to="/about">關於我們</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link h5" aria-current="page" to="/about">商品介紹</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link h5" aria-current="page" to="/about">常見問題</Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link className="btn btn-outline-success" to="/login">Login</Link>
            <button className="btn btn-outline-success" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}