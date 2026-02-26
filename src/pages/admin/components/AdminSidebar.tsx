import { NavLink } from "react-router"


export default function AdminSidebar() {
  return (
    <>
      <div className="sidebar">
        <div className="brand-zone">
          <h4 className="fw-bold m-0">CreamyDay</h4>
          <small className="text-muted">管理員系統</small>
        </div>
        <nav className="nav flex-column">
          <NavLink className="nav-link" to="/admin/dashboard"><i className="bi bi-speedometer2 me-2"></i> 儀表板</NavLink>
          <NavLink className="nav-link" to="/admin/products"><i className="bi bi-box-seam me-2"></i> 商品管理</NavLink>
          <NavLink className="nav-link" to="/admin/orders"><i className="bi bi-receipt me-2"></i> 訂單管理</NavLink>
          <NavLink className="nav-link" to="/admin/coupons"><i className="bi bi-ticket-perforated me-2"></i> 折扣碼管理</NavLink>
          <NavLink className="nav-link" to="/admin/banners">
            <i className="bi bi-image me-2"></i> 
            Banner管理</NavLink>
          <NavLink className="nav-link" to="/admin/store-info">
            <i className="bi bi-shop me-2"></i> 
            營業資訊管理</NavLink>
          <NavLink className="nav-link" to="/admin/reviews">
            <i className="bi bi-chat-heart me-2"></i> 
            評論管理</NavLink>
        </nav>
        </div>
    </>
  )
}