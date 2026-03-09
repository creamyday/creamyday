import { useCallback, useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import axios from 'axios';
import { endOfDay, endOfMonth, format, isWithinInterval, startOfDay, startOfMonth, subMonths } from 'date-fns';
import type { Order } from './types/Product';

const baseUrl = import.meta.env.VITE_API_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function Dashboard() {
  
  const [waitToPay, setWaitToPay] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [todayOrderCount, setTodayOrderCount] = useState<number>(0);
  const [thisMonthTotal, setThisMonthTotal] = useState<number>(0);
  const [allOrder, setAllOrder] = useState<Order[]>([]);

  const getOrders = (page = 1) => {
    try {
      return axios.get(`${baseUrl}/v2/api/${api_path}/admin/orders?page=${page}`);
    } catch (error: unknown) {
      console.warn(error);
    }
  }
  const getAllOrderPages = useCallback(async () => {
    try {
      // 取得所有訂單資料
      const first = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/orders`);
      const totalPages = first.data.pagination.total_pages;
      let allOrders = [...first.data.orders];
      const result = await Promise.all([...Array(totalPages-1)].map((_, index: number) => getOrders(index + 2)));
      result.forEach((page) => {
        console.log("page", page)
        if(!page) return
        allOrders = [...allOrders, ...page.data.orders];
      });
      setAllOrder(allOrders);
      // 取得當日訂單資料
      const todayOrder = allOrders.filter((order: Order) => 
        isWithinInterval(new Date(order.create_at * 1000), {
          start: startOfDay(new Date()),
          end: endOfDay(new Date()),
        })
      )
      // 取得當月訂單資料
      const thisMonthOrder = allOrders.filter((order: Order) => 
        isWithinInterval(new Date(order.create_at * 1000), {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        })
      )
      console.log(allOrders);
      // 取得當日營收數據
      setTodayTotal(todayOrder.reduce((sum: number, b: Order) =>  sum + b.total, 0));
      // 取得當日訂單數
      setTodayOrderCount(todayOrder.length);
      // 取得未付款訂單數
      setWaitToPay(allOrders.filter((order: Order) => !order.is_paid).length);
      // 取得當月營收數據
      setThisMonthTotal(thisMonthOrder.reduce((sum: number, b: Order) => sum + b.total, 0));
    } catch (error: unknown) 
    {
      console.warn(error);
    }
  }, [])
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getAllOrderPages();
  },[getAllOrderPages])

  useEffect(() => {
    const monthKeys = [...Array(6)].map((_, index: number) => `${format(subMonths(new Date(), (5 - index)), "yyyy-MM")}-01`);
    const total: Record<string, number> = {};
    monthKeys.forEach((month: string) => total[month] = 0);
    allOrder.forEach((order: Order) => {
      const key: string = `${format(new Date(order.create_at * 1000), "yyyy-MM")}-01`;
      if(key in total) total[key] += order.total;
    })
    console.log(monthKeys);
    console.log(total);
    const chart = c3.generate({
      bindto: '#chart',
      padding: {
        right: 24,
        top: 24,
      },
      data: {
        x: 'x',
        columns: [
          ['x', ...monthKeys],
          ['營收', ...(Object.values(total))]
        ],
        type: "area-spline",
      },
      color: {pattern:["#815631"]},
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m'
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [allOrder]);

  return (
    <>
      <div className="container dashboard">
        <div className="row row-cols-sm-4 g-4">
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h5 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-currency-dollar"></i></div>
                <div className="statValue h4">$ {todayTotal}</div>
                <div className="statLabel text-secondary">今日營業額</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h5 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-hourglass-split"></i></div>
                <div className="statValue h4">$ {thisMonthTotal}</div>
                <div className="statLabel text-secondary">本月營業額</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h5 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-clock-history"></i></div>
                <div className="statValue h4">{waitToPay} 筆</div>
                <div className="statLabel text-secondary">未付款訂單</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h5 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-folder-plus"></i></div>
                <div className="statValue h4">{todayOrderCount} 筆</div>
                <div className="statLabel text-secondary">今日新增訂單</div>
              </div>
            </div>
          </div>
          {/* <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-truck"></i></div>
                <div className="statValue h3">5 筆</div>
                <div className="statLabel text-secondary">未出貨訂單</div>
              </div>
            </div>
          </div> */}
          {/* <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-shop-window"></i></div>
                <div className="statValue h3">1 筆</div>
                <div className="statLabel text-secondary">未取貨訂單</div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="curve mt-3 rounded-3 bg-white">
          <div id="chart"></div>
        </div>
      </div>
    </>
  )
}