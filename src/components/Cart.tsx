import axios from "axios";
import { Icon } from "@iconify/react";
import { useSelector,useDispatch } from 'react-redux';
import { useEffect } from "react";
import { changeQty, initProduct, initFinalTotal, initTotal, removeProduct,changeShow } from '../stores/carts';
import { pushToastAsync } from '../stores/toasts';

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Cart() {
  const dispatch = useDispatch();
  const dispatch1 = useDispatch() as any;
  const { isShow,products, final_total, total } = useSelector((state: any) => state.carts);

  const initCart =async()=>{
    try {
      const res = await axios.get(
        `${API_URL}/v2/api/${API_PATH}/cart`,
      );
      dispatch(initProduct(res.data.data.carts));
      dispatch(initFinalTotal(res.data.data.final_total));
      dispatch(initTotal(res.data.data.total));
    } catch (error) {
      dispatch(initProduct(products));
      dispatch(initFinalTotal(final_total));
      dispatch(initTotal(total));
    }
  }
  
  useEffect(()=>{
    if (isShow){
      initCart();
    }
  }, [isShow]);

  const updateQty = async (id: string, num: number) => {
    dispatch(changeQty({ qty: num, id: id }));
    try {
      const res = await axios.put(
        `${API_URL}/v2/api/${API_PATH}/cart/${id}`,
        {
          "data": {
            "product_id": id,
            "qty": num
          }
        }
      );
      dispatch1(pushToastAsync({ success: res.data.success, message: res.data.message }));
    } catch (error:any) {
      dispatch1(pushToastAsync({ success: error.success, message: error.message }));
    }
  };

  const removeCart = async(id:string)=>{
    dispatch(removeProduct({ id: id }))
    try {
      const res = await axios.delete(
        `${API_URL}/v2/api/${API_PATH}/cart/${id}`);
      dispatch1(pushToastAsync({ success: res.data.success, message: res.data.message }));
    } catch (error: any) {
      dispatch1(pushToastAsync({ success: error.success, message: error.message }));
    }
  }


  if (products.length === 0){
    return(
      <div className={`bg-white cart-wrapper ${isShow ? 'd-block' : 'd-none'}`}>
        <h4 className="text-center mb-40">購物車商品</h4>
        <p className="text-center">您的購物車尚未有商品</p>
      </div>
    )
  }

  return (
    <div className={`bg-white cart-wrapper ${isShow ?'d-block':'d-none'}`}>
      <h4 className="text-center mb-40">購物車商品</h4>
      {
        products.map((item:any)=>(
          <div className="mb-40" key={item.id}>
            <div className="d-flex">
              <img
                src={item.product.imageUrl}
                alt="主圖"
                className="rounded-1"
              />
              <div className="ps-3 w-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6>{item.product.title}</h6>
                    <button
                      type="button"
                      className="btn border-0 px-3"
                      onClick={() => removeCart(item.id)}>
                      <Icon
                        icon="carbon:trash-can"
                        width="32px"
                      />
                    </button>
                  </div>
                  <p className="mb-0 GenSenRounded2JP-M-Full">{item.product.unit}</p>
                </div>
                
                <div className="d-none d-lg-flex justify-content-between align-items-center">
                  <div className="border p-2 rounded-2 input-group-wrapper">
                    <div className="input-group">
                      <button
                        className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                        type="button"
                        disabled={item.qty <= 1}
                        onClick={() => updateQty(item.id, item.qty - 1)}>
                        <Icon
                          icon="material-symbols:remove-rounded"
                          width="14px"
                        />
                      </button>
                      <input
                        type="text"
                        className="form-control bg-white border-0"
                        value={item.qty}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          if (isNaN(num)) return;
                          updateQty(item.id, num);
                        }}
                      />
                      <button
                        className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                        type="button"
                        disabled={item.qty >= item.product.stock}
                        onClick={() => {
                          const num = item.qty + 1;
                          updateQty(item.id, num)
                        }}>
                        <Icon
                          icon="material-symbols:add-rounded"
                          width="14px"
                        />
                      </button>
                    </div>
                  </div>

                  <h6 className="mb-0 ms-auto GenSenRounded2JP-M-Full">NT$ {item.qty * item.product.price}</h6>
                </div>
              </div>
            </div>

            <div className="d-flex d-lg-none justify-content-between align-items-center mt-12">
              <div className="border p-2 rounded-2 input-group-wrapper">
                <div className="input-group">
                  <button
                    className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                    type="button"
                    disabled={item.qty <= 0}
                    onClick={() => updateQty(item.id, item.qty - 1)}>
                    <Icon
                      icon="material-symbols:remove-rounded"
                      width="14px"
                    />
                  </button>
                  <input
                    type="text"
                    className="form-control bg-white border-0"
                    value={item.qty}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      if (isNaN(num)) return;
                      updateQty(item.id, num);
                    }}
                  />
                  <button
                    className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                    type="button"
                    disabled={item.qty >= item.product.stock}
                    onClick={() => {
                      const num = item.qty + 1;
                      updateQty(item.id, num)
                    }}>
                    <Icon
                      icon="material-symbols:add-rounded"
                      width="14px"
                    />
                  </button>
                </div>
              </div>

              <h6 className="mb-0 ms-auto  GenSenRounded2JP-M-Full">NT$ {item.qty * item.product.price}</h6>
            </div>
          </div>
        ))
      }

      <hr className="mt-0 mb-40" />
      <div className="d-flex justify-content-between mb-40">
        <h5 className="mb-0">總金額</h5>
        <h5 className="mb-0  GenSenRounded2JP-M-Full">NT$ {products.reduce((a: number, b: any)=>{
          a +=b.qty * b.product.price;
          return a;
        },0)}</h5>
      </div>

      <div className="d-block d-lg-flex justify-content-lg-between btns">
        <button type="button" className="d-flex justify-content-center btn btn-outline-primary rounded-1 w-100" onClick={() => dispatch(changeShow(false))}>
          <h6 className="mb-0">繼續購買</h6>
          <Icon
            icon="pajamas:long-arrow"
            width="24px"
          />
        </button>
        <button type="button" className="d-flex justify-content-center btn btn-primary rounded-1 w-100">
          <h6 className="mb-0">立即結帳</h6>
          <Icon
            icon="pajamas:long-arrow"
            width="24px"
          />
        </button>
      </div>
    </div>
  )
}