import c3 from'c3';
import { useEffect, useRef } from 'react';


export default function Home(){
  let chart = c3.generate({
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
  });
  let chartRef = useRef(null);
  
  useEffect(() => {
    // 確保組件渲染後才初始化圖表
    chart = c3.generate({
      bindto: chartRef.current, // 使用 ref 綁定 DOM
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ],
        type: 'line' // 圖表類型
      }
    });

    // 組件卸載時銷毀圖表，防止記憶體洩漏
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={chartRef}></div>
      <h1>關於我們primary</h1>
      <h2>關於我們primary</h2>
      <h3>關於我們primary</h3>
      <h4>關於我們primary</h4>
      <h5>關於我們primary</h5>
      <h6>關於我們primary</h6>
      <button type="button" className="btn btn-primary">Primary</button>
      <button type="button" className="btn btn-secondary">Secondary</button>
      <button type="button" className="btn btn-success">Success</button>
      <button type="button" className="btn btn-danger">Danger</button>
      <button type="button" className="btn btn-warning">Warning</button>
      <button type="button" className="btn btn-info">Info</button>
      <button type="button" className="btn btn-light">Light</button>
      <button type="button" className="btn btn-dark">Dark</button>

      <button type="button" className="btn btn-link">Link</button>
    </div>
  )
}