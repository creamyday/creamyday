import { Link } from "react-router";

export default function Menu({ variant = "desktop" }) {
  return (
    <ul className="navbar-nav">

      <li className="nav-item">
        <Link className="nav-link" to="/about">
          關於我們
        </Link>
      </li>

      {/* 商品介紹 */}
      {variant === "desktop" ? (
        /* 桌機 dropdown */
        <li className="nav-item dropdown">
          <span
            className="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
          >
            商品介紹
          </span>

          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" to="/new">新品推薦</Link></li>
            <li><Link className="dropdown-item" to="/hot">熱門商品</Link></li>
            <li><Link className="dropdown-item" to="/tiramisu">提拉米蘇</Link></li>
            <li><Link className="dropdown-item" to="/basque">巴斯克乳酪蛋糕</Link></li>
            <li><Link className="dropdown-item" to="/cheese">生乳酪蛋糕</Link></li>
            <li><Link className="dropdown-item" to="/cream">奶油蛋糕</Link></li>
            <li><Link className="dropdown-item" to="/roll">生乳捲</Link></li>
          </ul>
        </li>
      ) : (
        /* 手機直接展開 */
        <>
          <li className="nav-item mt-3">
            <span className="nav-link fw-bold">商品介紹</span>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/new">新品推薦</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/hot">熱門商品</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/tiramisu">提拉米蘇</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/basque">巴斯克乳酪蛋糕</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/cheese">生乳酪蛋糕</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/cream">奶油蛋糕</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link ps-3" to="/roll">生乳捲</Link>
          </li>
        </>
      )}

      <li className="nav-item">
        <Link className="nav-link" to="/faq">
          常見問題
        </Link>
      </li>

    </ul>
  );
}
