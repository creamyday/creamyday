import { Link, useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const logout = () => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - 480).toLocaleString();
    document.cookie = `token=; expires=${date}`;
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <h1 className="navbar-brand">CreamyDay</h1>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/about">關於我們</Link>
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