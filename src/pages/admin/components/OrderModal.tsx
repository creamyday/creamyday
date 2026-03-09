import { Modal } from "bootstrap";
import type { Order } from "../types/Product";
import type { ProductOfOrder } from "../types/Product";

type OrderModalProps = {
  orderModalRef: React.RefObject<HTMLDivElement | null>,
  orderModalInstance: React.RefObject<Modal | null>,
  singleOrder: Order,
}

export default function OrderModal({orderModalRef, orderModalInstance, singleOrder}: OrderModalProps) {

  const products = Object.values(singleOrder.products);

  return (
    <div className="modal fade" ref={orderModalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              訂單明細-訂購人：{singleOrder?.user?.name} / 電話：{singleOrder?.user?.tel}
            </h5>
            <button type="button" className="btn-close" aria-label="Close"
              onClick={() => {
                if(orderModalInstance.current) orderModalInstance.current.hide();
              }}
            ></button>
          </div>
          <div className="modal-body">
            <p>寄送地址：{singleOrder?.user?.address}</p>
            <table className="table">
              <thead>
                <tr>
                  <th>序</th>
                  <th>品名</th>
                  <th>規格</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小記</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((product: ProductOfOrder, index: number) => {
                    console.log("檢查",singleOrder);
                    return (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{product.product.title}</td>
                        <td>{product.product.unit}</td>
                        <td>{product.product.price}</td>
                        <td>{product.qty}</td>
                        <td>{product.final_total}</td>
                      </tr>
                    )
                  })
                }
                
              </tbody>
              <tfoot>
                <tr>
                  <td className="text-end" colSpan={5}>總計:</td>
                  <td> <u>NT. {singleOrder.total}</u> </td>
                </tr>
                {/* <tr>
                  <td>寄送地址：{singleOrder?.user?.address}</td>
                </tr> */}
              </tfoot>
            </table>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary"
              onClick={() => {
                if(orderModalInstance.current) orderModalInstance.current.hide();
              }}
            >關閉</button>
          </div>
        </div>
      </div>
    </div>
  )
}