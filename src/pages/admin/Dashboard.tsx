import { useEffect } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

export default function Dashboard() {

  useEffect(() => {
    const chart = c3.generate({
      bindto: '#chart',
      padding: {
        right: 24,
        top: 24,
      },
      data: {
        x: 'x',
        columns: [
          ['x', '2025-09-01', '2025-10-01', '2025-11-01', '2025-12-01', '2026-01-01', '2026-02-01'],
          ['營收', 6990, 13040, 16780, 21190, 19980, 4880]
        ],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m'
          },
        },
      },
    });
  },[])

  return (
    <>
      <div className="container dashboard">
        <div className="row row-cols-sm-3 g-4">
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-currency-dollar"></i></div>
                <div className="statValue h3">$ 1,000</div>
                <div className="statLabel text-secondary">今日營業額</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-hourglass-split"></i></div>
                <div className="statValue h3">2 筆</div>
                <div className="statLabel text-secondary">已付款，未處理訂單</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-clock-history"></i></div>
                <div className="statValue h3">1 筆</div>
                <div className="statLabel text-secondary">未付款訂單</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-folder-plus"></i></div>
                <div className="statValue h3">3 筆</div>
                <div className="statLabel text-secondary">今日新增訂單</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-truck"></i></div>
                <div className="statValue h3">5 筆</div>
                <div className="statLabel text-secondary">未出貨訂單</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="stat card rounded-3 bg-white">
              <div className="card-body">
                <div className="statIcon p-2 h4 d-flex align-items-center justify-content-center rounded-3"><i className="bi bi-shop-window"></i></div>
                <div className="statValue h3">1 筆</div>
                <div className="statLabel text-secondary">未取貨訂單</div>
              </div>
            </div>
          </div>
        </div>
        <div className="curve mt-3 rounded-3 bg-white">
          <div id="chart"></div>
        </div>
      </div>
    </>
  )
}