import axios from "axios";
import { useState, useEffect } from "react";
import CustomerSidebar from "./CustomerSideBar";

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

type OrderStatus = "已付款" | "未付款";

interface Order {
  id: string;
  status: OrderStatus;
  date: string;
  payment: string;
  total: number;
  is_paid: boolean;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"總覽" | "已付款" | "未付款">(
    "總覽",
  );

  const [orders, setOrders] = useState<Order[]>([]);

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* 
 const orders: Order[] = [
    {
      id: "20251201001",
      status: "已付款",
      date: "2025/12/01",
      payment: "LinePay",
      total: 1000,
    },
    {
      id: "20251203005",
      status: "未付款",
      date: "2025/12/02",
      payment: "LinePay",
      total: 850,
    },
  ];
  */

  const filteredOrders =
    activeTab === "總覽"
      ? orders
      : orders?.filter((o) => {
          if (activeTab === "已付款") {
            return o.is_paid;
          } else if (activeTab === "未付款") {
            return !o.is_paid;
          }
        });
  console.log(filteredOrders);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const response = await axios.get(
          `${API_URL}/v2/api/${API_PATH}/admin/orders`,
        );
        console.log("取得訂單成功：", response.data.orders);
        setOrders(response.data.orders);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // console.log(error.response);
          // console.log(error.response?.data);
          setErrorMsg(error.response?.data?.message ?? "取得訂單失敗");
        } else {
          // console.log(error);
          setErrorMsg("取得訂單失敗");
        }
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-4">
        會員中心 / 訂單管理
        {reviewOrder && " / 訂單評論"}
      </h2>

      <div className="row">
        <CustomerSidebar />

        <div className="col-12 col-md-9">
          {!reviewOrder ? (
            <>
              {/* Tabs */}
              <ul className="nav nav-tabs mb-4">
                {["總覽", "已付款", "未付款"].map((tab) => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link ${
                        activeTab === tab ? "active" : ""
                      }`}
                      onClick={() =>
                        setActiveTab(tab as "總覽" | "已付款" | "未付款")
                      }
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>

              {/* 訂單列表 */}
              {filteredOrders &&
                filteredOrders?.map((order) => (
                  <div key={order.id} className="card mb-3">
                    <div className="card-body">
                      {/* 標題列 */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="fw-bold mb-1">訂單編號：{order.id}</p>
                          <p className="mb-0 text-muted">
                            狀態：{order.status}
                          </p>
                        </div>

                        <div className="d-flex gap-2">
                          {/* 評價 */}
                          <button
                            className={`btn btn-sm ${
                              order.status === "已付款"
                                ? "btn-warning"
                                : "btn-secondary"
                            }`}
                            disabled={order.status !== "已付款"}
                            onClick={() => setReviewOrder(order)}
                          >
                            評價
                          </button>

                          {/* 下拉 */}
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              setOpenOrderId(
                                openOrderId === order.id ? null : order.id,
                              )
                            }
                          >
                            {openOrderId === order.id ? "▲" : "▼"}
                          </button>
                        </div>
                      </div>

                      {/* 下拉內容 */}
                      {openOrderId === order.id && (
                        <div className="mt-3 border-top pt-3">
                          <p>訂單時間：{order.date}</p>
                          <p>付款方式：{order.payment}</p>
                          <p>訂單總額：NT${order.total}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <ReviewSection
              order={reviewOrder}
              onBack={() => setReviewOrder(null)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

/* =====================
   評論畫面
===================== */

interface ReviewProps {
  order: Order;
  onBack: () => void;
}

function ReviewSection({ order, onBack }: ReviewProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="fw-bold mb-3">訂單編號：{order.id}</h5>

        {/* 星星 */}
        <div className="mb-3">
          <label className="form-label fw-bold">商品評分</label>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  color: star <= rating ? "#ffc107" : "#ccc",
                }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* 評論文字 */}
        <div className="mb-3">
          <label className="form-label fw-bold">評論內容</label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="請輸入評論..."
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onBack}>
            取消
          </button>

          <button
            className="btn btn-warning"
            onClick={() => {
              alert("評論成功！");
              onBack();
            }}
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
