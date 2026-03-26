import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Modal } from "bootstrap";
import Pagination from "./components/Pagination";
import OrderModal from "./components/OrderModal";
import type { Order } from "./types/Product";

const baseUrl = import.meta.env.VITE_API_URL;
const api_path = import.meta.env.VITE_API_PATH;

const initOrder = {
  products: {},
  create_at: 0,
  id: "",
  is_paid: false,
  message: "",
  total: 0,
  user: {
    name: "",
    tel: "",
    address: ""
  }
}

export default function OrdersManagement() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order>(initOrder);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [hasPre, setHasPre] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  // const orderModalRef = useRef(null);
  // const orderModalInstance = useRef(null);
  const orderModalRef = useRef<HTMLDivElement | null>(null);
  const orderModalInstance = useRef<Modal | null>(null);

  const getOrders = useCallback(async (page = 1) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/orders?page=${page}`);
      setOrders(res.data.orders);
      setCurrentPage(res.data.pagination.current_page);
      setTotalPage(res.data.pagination.total_pages);
      setHasPre(res.data.pagination.has_pre);
      setHasNext(res.data.pagination.has_next);
    } catch (error: unknown) {
      console.warn(error);
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getOrders();
    if(orderModalRef.current)  orderModalInstance.current = new Modal(orderModalRef.current);
  }, [getOrders])

  return (
    <>
      <div className="container orderManagement bg-white rounded-3 p-4">
        <div className="d-flex align-items-center mb-2">
          <h5 className="h5 tableTitle mb-0">訂單列表</h5>
        </div>
        <table className="table table-hover mt-2">
          <thead>
            <tr>
              <th>序</th>
              <th>訂購人</th>
              <th>狀態</th>
              <th>訂單日期</th>
              <th>訂單總價</th>
              <th>訂購詳情</th>
            </tr>
          </thead>
          <tbody>
            {
              orders.map((order: Order, index: number) => {
                const date = (new Date(order.create_at * 1000))
                return (
                  <tr key={order.id}>
                    <td>{index+1}</td>
                    <td>{order.user.name}</td>
                    <td className={order.is_paid? "text-success" : "text-danger"}>
                      {order.is_paid ? "已付款" : "尚未付款"}
                    </td>
                    <td>{date.toLocaleString("zh-TW", 
                      {hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"})}</td>
                    <td>{order.total}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSingleOrder(order);
                          if(orderModalInstance.current) orderModalInstance.current.show();
                        }}
                      >查看</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <Pagination hasPre={hasPre} hasNext={hasNext} 
          currentPage={currentPage} totalPage={totalPage} getProducts={getOrders} />
        </div>
      </div>
      <OrderModal orderModalRef={orderModalRef} orderModalInstance={orderModalInstance} singleOrder={singleOrder} />
    </>
  )
}