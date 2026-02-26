export default function AdminHeader() {
  return (
    <>
      <div className="header-tools">
            <div className="d-flex align-items-center">
                <i className="bi bi-search me-2 text-muted"></i>
                <input type="text" className="searchBar" placeholder="搜尋資料..." />
            </div>
            <div className="d-flex align-items-center">
                <button type="button" className="btn btn-sm position-relative me-4">
                    <i className="bi bi-bell fs-5"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill notification-badge">
                        5 </span>
                </button>
                <div className="d-flex align-items-center">
                    <span className="me-3 fw-medium">Administrator</span>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=A7896E&color=fff" className="rounded-circle" width="40" height="40" />
                </div>
            </div>
        </div>
    </>
  )
}