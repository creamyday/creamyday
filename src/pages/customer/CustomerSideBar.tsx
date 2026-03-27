import { NavLink } from "react-router";

export default function CustomerSidebar() {
  const items = [
    { label: "個人資訊", path: "/profile" },
    { label: "我的收藏", path: "/favorite" },
    { label: "訂單管理", path: "/orders" },
    { label: "密碼變更", path: "/password" },
  ];

  return (
    <div className="col-md-3 mb-4">
      <div className="list-group">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
