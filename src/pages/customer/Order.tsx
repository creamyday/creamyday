import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function Order() {
  const { state } = useLocation();
  const [isStatus, setIsStatus] = useState(false);
  const [request, setRequest] = useState<any>({});

  useEffect(() => {
    let options = state?.request?.billOptions.find((item: any) => item.id == state?.request?.billMethod);
    const name = state?.request?.user?.name;
    const tel = state?.request?.user?.tel;
    const email = state?.request?.user?.email;
    const address = state?.request?.user?.address;
    const message = state?.request?.message;
    const billMethod = options?.value;
    const bill = options?.keys.reduce((a:string,b:string)=>{
      if (b){
        a += state?.request[b]
      }
      return a;
    },'');
    options = state?.request?.deliveryOptions.find((item: any) => item.id == state?.request?.deliveryMethod);
    const deliveryMethod = options?.value;
    const delivery = options?.keys.reduce((a: string, b: string) => {
      if (b) {
        a += state?.request[b]
      }
      return a;
    }, '');
    options = state?.request?.paymentOptions.find((item: any) => item.id == state?.request?.paymentMethod);
    const paymentMethod = options?.value;
    const payment = options?.keys.reduce((a: string, b: string) => {
      if (b) {
        a += state?.request[b]
      }
      return a;
    }, '');

    let data = {
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
    setIsStatus(state?.success);
    setRequest(data);
  }, [location.pathname])

  if (isStatus) {
    return (
      <main className="order-container">
        <div className="container">
          <div className="row">
            <div className="col col-left col-md-8 py-100">
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
            <div className="col col-right col-md-4 py-100 d-none d-lg-block">
              <p>
                感謝​您​的​支持！<br />
                我​們​已​收​到​您​的​訂單，​將會​盡快​處理。<br />
                請​您​耐心​等​候 3 - 7​ ​天 ​的​製作​與出​貨​時間。<br />
                最​新​狀態​與物​流追蹤碼，​將會​透過​電子​郵件​即時寄​送​到​您​的​信箱 ，​請留意​查收。<br />
                期​待​這份​美味​能​點亮​您​的​特別​時刻！​<br />
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

          <div className="col col-left col-md-8 py-100">
            <h4>訂單失敗</h4>
            <p>
              非常​抱歉，<br />
              由​於系統​在​處理​時​發生​了​異常​或​延遲，<br />
              建議​您​稍候幾分鐘後重新​嘗試​付款。<br /><br />
              請​不​必擔心，​我​們​未​收取​您​的​任何​費用。<br /><br />
              如​仍​無法​成功，<br />
              請​直接​聯繫​我​們​的​客服，​我​們將​盡​快為​您​處理。<br /><br />
              感謝​您​的​支持​與體​諒！
            </p>
          </div>
          <div className="col col-right col-md-4 py-100 d-none d-lg-block">
          </div>
        </div>
      </div>
    </main>
  )
}