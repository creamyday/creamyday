import { useState, ChangeEvent, FormEvent } from "react";
import CustomerSidebar from "./CustomerSideBar";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("新密碼與確認密碼不一致");
      return;
    }

    alert("密碼已變更（Demo）");
  };

  return (
    <main className="container py-5">
      {/* 標題 */}
      <h2 className="fw-bold mb-4">會員中心 / 密碼變更</h2>

      <div className="row">
        {/* 🔹 左側 Sidebar */}
        <CustomerSidebar />

        {/* 🔹 右側表單 */}
        <div className="col-12 col-md-9">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">
                <span className="text-danger">*</span> 原密碼
              </label>
              <input
                type="password"
                name="oldPassword"
                className="form-control"
                placeholder="請輸入原密碼"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                <span className="text-danger">*</span> 新密碼
              </label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="請輸入新密碼"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label className="form-label">
                <span className="text-danger">*</span> 確認新密碼
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="請再次輸入新密碼"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-outline-primary px-5 rounded-pill"
              >
                確認變更
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
