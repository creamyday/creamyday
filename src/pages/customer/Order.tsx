import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { OrderInfo, LocationState, CheckData } from '../../types/carts';

export default function Order() {
  const location = useLocation();
  const state = location.state as LocationState;
  const [isStatus, setIsStatus] = useState(false);
  const [request, setRequest] = useState<OrderInfo | null>(null);

  useEffect(() => {
    let options = state?.request?.billOptions.find((item) => item.id == state?.request?.billMethod);
    const name = state?.request?.user?.name;
    const tel = state?.request?.user?.tel;
    const email = state?.request?.user?.email;
    const address = state?.request?.user?.address;
    const message = state?.request?.message;
    const billMethod = options?.value;
    const bill = options?.keys.reduce((a,b)=>{
      if (b){
        const key = b as keyof CheckData;
        a += state?.request[key];
      }
      return a;
    },'');
    options = state?.request?.deliveryOptions.find((item) => item.id == state?.request?.deliveryMethod);
    const deliveryMethod = options?.value;
    const delivery = options?.keys.reduce((a, b) => {
      if (b) {
        const key = b as keyof CheckData;
        a += state?.request[key]
      }
      return a;
    }, '');
    options = state?.request?.paymentOptions.find((item) => item.id == state?.request?.paymentMethod);
    const paymentMethod = options?.value;
    const payment = options?.keys.reduce((a, b) => {
      if (b) {
        const key = b as keyof CheckData;
        a += state?.request[key]
      }
      return a;
    }, '');

    const data = {
      name,
      tel,
      email,
      address,
      message,
      billMethod,
      bill,
      deliveryMethod,
      delivery,
      paymentMethod,
      payment,
    }
    const fetch = ()=>{
      setIsStatus(state?.success);
      setRequest(data);
    }
    fetch();
  }, [state])

  if (isStatus) {
    return (
      <main className="order-container">
        <div className="container">
          <div className="row">
            <div className="col col-left col-lg-8 py-100">
              <h4>訂單成功</h4>
              <div className="d-flex justify-content-between align-items-center my-4 border-bottom border-primary">
                <h6 className="mb-0">姓名</h6>
                <span>{request?.name}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">手機</h6>
                <span>{request?.tel}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">Email</h6>
                <span>{request?.email}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">地址</h6>
                <span>{request?.address}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">備註</h6>
                <span>{request?.message}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">配送方式</h6>
                <div className="text-end">
                  <span>{request?.deliveryMethod}</span><br />
                  <span>{request?.delivery}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">付款方式</h6>
                <div className="text-end">
                  <span>{request?.paymentMethod}</span><br />
                  <span>{request?.payment === 'true' ? "" : request?.payment}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary">
                <h6 className="mb-0">發票方式</h6>
                <div className="text-end">
                  <span>{request?.billMethod}</span><br />
                  <span>{request?.bill}</span>
                </div>
              </div>


            </div>
            <div className="col col-right col-lg-4 py-100 d-none d-lg-block">
              <p>
                感謝您的支持！<br />
                我們已收到您的訂單，將會盡快處理。<br />
                請您耐心等候 3 - 7 天 的製作與出貨時間。<br />
                最新狀態與物流追蹤碼，將會透過電子郵件即時寄送到您的信箱 ，請留意查收。<br />
                期待這份美味能點亮您的特別時刻！<br />
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="order-container">
      <div className="container">
        <div className="row">

          <div className="col col-left col-lg-8 py-100">
            <h4>訂單失敗</h4>
            <p>
              非常抱歉，<br />
              由於系統在處理時發生了異常或延遲，<br />
              建議您稍候幾分鐘後重新嘗試付款。<br /><br />
              請不必擔心，我們未收取您的任何費用。<br /><br />
              如仍無法成功，<br />
              請直接聯繫我們的客服，我們將盡快為您處理。<br /><br />
              感謝您的支持與體諒！
            </p>
          </div>
          <div className="col col-right col-lg-4 py-100 d-none d-lg-block">
          </div>
        </div>
      </div>
    </main>
  )
}