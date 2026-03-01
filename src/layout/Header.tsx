import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { changeShow, initProduct, initFinalTotal, initTotal } from "../stores/carts.ts";
import 'bootstrap';
import Cart from "../components/Cart.tsx";

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

function MobileMenu({
  isAuth,
  user,
  onLogout,
}: {
  isAuth: boolean;
  user: { name: string } | null;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <NavLink to="/about" className="menu-main">
        關於我們
      </NavLink>

      {/* 手機商品介紹 */}
      <div className="menu-section">
        <div
          className="menu-title clickable"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>商品介紹</span>
          <span className={`arrow ${isOpen ? "open" : ""}`}>⌃</span>
        </div>

        <div className={`submenu ${isOpen ? "show" : ""}`}>
          <NavLink to="/products/new" className="menu-subtitle">
            新品推薦
          </NavLink>
          <NavLink to="/products/hot" className="menu-subtitle">
            熱門商品
          </NavLink>
          <NavLink to="/products/basque" className="menu-subtitle">
            巴斯克乳酪蛋糕
          </NavLink>
          <NavLink to="/products/tiramisu" className="menu-subtitle">
            提拉米蘇
          </NavLink>
          <NavLink to="/products/roll" className="menu-subtitle">
            生乳捲
          </NavLink>
          <NavLink to="/products/other" className="menu-subtitle">
            其他甜點
          </NavLink>
        </div>
      </div>

      <NavLink to="/faq" className="menu-main pb-0">
        常見問題
      </NavLink>

      <div className="menu-divider"></div>

      {isAuth && (
        <>
          <div className="mobile-user">
            <div className="user-header">
              <span>個人帳戶</span>

              <div className="user-info">
                <Icon icon="mdi:account-circle-outline" width="20" />
                <span>{user?.name}</span>
              </div>
            </div>

            <NavLink to="/profile" className="menu-subtitle">
              個人資訊
            </NavLink>

            <NavLink to="/favorite" className="menu-subtitle">
              我的收藏
            </NavLink>

            <NavLink to="/orders" className="menu-subtitle">
              訂單管理
            </NavLink>

            <NavLink to="/password" className="menu-subtitle">
              密碼變更
            </NavLink>
          </div>

          <div className="menu-divider"></div>
        </>
      )}

      {/* 登入登出按鈕 */}
      {!isAuth ? (
        <NavLink to="/Login" className="mobile-login-btn">
          登入 / 註冊
        </NavLink>
      ) : (
        <button type="button" className="mobile-login-btn" onClick={onLogout}>
          登出
        </button>
      )}
    </div>
  );
}

export default function Header() {
  interface UserType {
    name: string;
  }
  const dispatch = useDispatch();
  const { isShow, products, final_total, total } = useSelector((state: any) => state.carts);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();

    if (token) {
      setIsAuth(true);
      setUser({ name: "Claire" });
    } else {
      setIsAuth(false);
      setUser(null);
    }

    const checkLogin = async () => {
      if (!token) return;

      try {
        axios.defaults.headers.common["Authorization"] = token;
        await axios.post(`${API_URL}/v2/api/user/check`);
      } catch (err) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        setIsAuth(false);
        setUser(null);
      }
    };

    checkLogin();
    dispatch(changeShow(false));
  }, [location.pathname]);
  
  useEffect(()=>{
    initCart();
  }, [])

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common["Authorization"];
    setIsAuth(false);
    setUser(null);
    navigate("/");
  };
  const initCart = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/v2/api/${API_PATH}/cart`,
      );
      dispatch(initProduct(res.data.data.carts));
      dispatch(initFinalTotal(res.data.data.final_total));
      dispatch(initTotal(res.data.data.total));
    } catch (error) {
      dispatch(initProduct(products));
      dispatch(initFinalTotal(final_total));
      dispatch(initTotal(total));
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container d-flex  align-items-center ">
        {/* 電腦版的header 左邊的logo+文字 */}
        <Link className="text-decoration-none" to="/">
          <div className="brand d-flex align-items-center">
            <div className="logo-circle">
              <img src="./logo1.png" alt="CreamyDay Logo" />
            </div>
            <h1 className="navbar-brand text-primary">CreamyDay</h1>
          </div>
        </Link>

        {/* 手機的漢堡選單 */}
        <div>
          <button
            type="button"
            className="btn px-2 border-0 d-inline d-lg-none position-relative"
            onClick={() => dispatch(changeShow(!isShow))}
          >
            <Icon icon="ph:shopping-cart-simple" width="24px" />
            {products?.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {
                  products.reduce((a: any, b: any) => {
                    a += b.qty;
                    return a;
                  }, 0)
                }
              </span>
            )}
          </button>
          <span className="d-lg-none position-relative">
            <Cart />
          </span>

          <button
            className="navbar-toggler border-0 px-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            onClick={() => dispatch(changeShow(false))}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div
          className="offcanvas offcanvas-end mobile-menu d-lg-none"
          tabIndex={-1}
          id="mobileMenu"
        >
          <div className="offcanvas-body">
            <MobileMenu isAuth={isAuth} user={user} onLogout={logout} />
          </div>
        </div>

        {/* 電腦版的header 項目 */}
        <div
          className="collapse navbar-collapse d-none d-lg-flex"
          id="navbarScroll"
        >
          <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll w-180">
            <li className="nav-item">
              <Link className="nav-link h5" to="/about">
                關於我們
              </Link>
            </li>

            {/* 商品介紹 dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle h5"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                商品介紹
              </Link>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item mb-12" to="/products/new">
                    新品推薦
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item mb-12" to="/products/hot">
                    熱門商品
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item mb-12" to="/products/basque">
                    巴斯克乳酪蛋糕
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item mb-12" to="/products/tiramisu">
                    提拉米蘇
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item mb-12" to="/products/roll">
                    生乳捲
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/other">
                    其他甜點
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link h5 " to="/faq">
                常見問題
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            {isAuth ? (
              <div className="dropdown header-dropdown">
                <button
                  className="btn user-btn dropdown-toggle me-12"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => dispatch(changeShow(false))}
                >
                  <Icon
                    icon="mdi:account-circle-outline"
                    className="m-1"
                    width="16px"
                  />
                  {user?.name}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item mb-12" to="/profile">
                      個人資訊
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item mb-12" to="/favorite">
                      我的收藏
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item mb-12" to="/orders">
                      訂單管理
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item mb-12" to="/password">
                      密碼變更
                    </Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item btn-outline-primary"
                      onClick={logout}
                    >
                      登出
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-outline-primary login-btn me-3" to="/login">
                登入 / 註冊
              </Link>
            )}
            <button
              type="button"
              className="btn border-0 p-0"
              onClick={() => dispatch(changeShow(!isShow))}
            >
              <Icon icon="ph:shopping-cart-simple" width="24px" />

              {products?.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {
                    products.reduce((a: any, b: any) => {
                      a+=b.qty;
                      return a;
                    },0)
                  }
                </span>
              )}
            </button>
            <div className="position-relative">
              <Cart />
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
