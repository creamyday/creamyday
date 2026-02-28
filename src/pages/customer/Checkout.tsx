interface Order {
  isPropsUserData: boolean,
  isPropsAddressData: boolean,
  name: string,
  tel: string,
  email: string,
  address: string,
  address_option1: string,
  address_option2: string,
  address_option3: string,
  message: string,
  deliveryMethod: number,
  storeMethod: number,
  paymentMethod: number,
  creditNumber: string,
  creditSafeCode: string,
  creditExpired: string,
  isLinePay: boolean,
  ATM: string,
  billMethod: number,
  bill: '',
}

interface AreaList {
  AreaName: string,
}

interface AddressOptions {
  AreaList: AreaList[],
  CityName: string,
}

interface DeliveryOptions {
  id: number,
  value: string,
  keys: string[],
}

interface PaymentOptions {
  id: number,
  value: string,
  keys: string[],
}

interface StoreOptions {
  id: number,
  value: string,
  keys: string[],
}

interface BillOptions {
  id: number,
  value: string,
  keys:string[],
}

import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { changeShow, initProduct, initFinalTotal, initTotal, initCoupon } from '../../stores/carts';
import { Offcanvas } from 'bootstrap';
import { pushToastAsync } from '../../stores/toasts';

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const deliveryOptions: DeliveryOptions[] = [
  {
    id: 0,
    value: '宅配',
    keys: ['address'],
  },
  {
    id: 1,
    value: '店取',
    keys: ['address'],
  },
  {
    id: 2,
    value: '自取',
    keys: ['address'],
  },
];

const paymentOptions: PaymentOptions[] = [
  {
    id: 0,
    value: '信用卡',
    keys: ['creditNumber', 'creditSafeCode','creditExpired'],
  },
  {
    id: 1,
    value: 'Line ​Pay',
    keys: ['isLinePay'],
  },
  {
    id: 2,
    value: 'AT​M匯款',
    keys: ['ATM'],
  },
];

const storeOptions: StoreOptions[] = [
  {
    id: 0,
    value: '7-11',
    keys: ['address'],
  },
  {
    id: 1,
    value: '全家',
    keys: ['address'],
  },
];

const billOptions: BillOptions[] = [
  {
    id: 0,
    value: '二聯式發票',
    keys: ['bill'],
  },
  {
    id: 1,
    value: '三聯式發票',
    keys: [],
  },
];

export default function Checkout() {
  const dispatch = useDispatch() as any;
  const navigate = useNavigate();
  const { products, final_total, total, coupon } = useSelector((state: any) => state.carts);
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Offcanvas | null>(null);
  const [offcanvasShow, setOffcanvasShow] = useState(false);
  const [addressOptions, setAddressOptions] = useState<AddressOptions[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Order>({
    mode: 'onTouched',
    defaultValues: {
      isPropsUserData: false,
      isPropsAddressData: false,
      name: "",
      tel: "",
      email: "",
      address_option1: "臺北市",
      address_option2: "中正區",
      address_option3: "",
      message: "",
      deliveryMethod: 0,
      storeMethod: 0,
      address: "", //配送地址
      paymentMethod: 0,
      creditNumber: '',
      creditSafeCode: '',
      creditExpired: '',
      isLinePay: false,
      ATM: '',
      billMethod: 0,
      bill: '',
    }
  });
  const deliveryMethodVal = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const isLinePay = watch('isLinePay');
  const billMethod = watch('billMethod');

  const handlerPropsUserData = () => {
    const isPropsUserData = getValues("isPropsUserData");
    if (isPropsUserData) {
      setValue("name", "Claire", { shouldValidate: true });
      setValue("tel", "0912345678", { shouldValidate: true });
      setValue("email", "user@gmail.com", { shouldValidate: true });
      setValue("address_option1", "臺北市");
      setValue("address_option2", "信義區");
      setValue("address_option3", "101大樓的3樓");
      setValue("message", "無");
    } else {
      setValue("name", "", { shouldValidate: true });
      setValue("tel", "", { shouldValidate: true });
      setValue("email", "", { shouldValidate: true });
      setValue("address_option1", "臺北市");
      setValue("address_option2", "中正區");
      setValue("address_option3", "");
      setValue("message", "");
    }
  };

  const handlerPropsAddress = (e: any) => {
    const isChecked = e.target.checked;
    const address_option1 = getValues("address_option1");
    const address_option2 = getValues("address_option2");
    const address_option3 = getValues("address_option3");
    const isSuccess = address_option1 && address_option2 && address_option3;
    if (isChecked && !isSuccess) {
      dispatch(pushToastAsync({ success: false, message: '請先填地址' }));
      setValue("isPropsAddressData", false);
      return;
    }
    if (isChecked) {
      setValue("deliveryMethod", 0);
      setValue("address", address_option1 + address_option2 + address_option3, { shouldValidate: true });
    } else {
      setValue("address", '', { shouldValidate: true });
    }
  };

  const changeLinePay = () => {
    const isLinePay = getValues("isLinePay");
    setValue("isLinePay", !isLinePay);
  }

  useEffect(() => {
    taiwanAddress();
    if (offcanvasRef.current) {
      instanceRef.current = new Offcanvas(offcanvasRef.current, { backdrop: true });
    }

    return () => {
      instanceRef.current?.dispose();
    };
  }, []);

  const taiwanAddress = async () => {
    const res = await fetch('/public/address.json').then(res => res.json());
    setAddressOptions(res);
  }

  const toggleOffcanvas = () => {
    instanceRef.current?.toggle();
    setOffcanvasShow(prev => !prev);
  }

  const pay = async (id: string, request:any)=>{
    try {
      const res = await axios.post(`${API_URL}/v2/api/${API_PATH}/pay/${id}`);
      dispatch(pushToastAsync({ success: res.data.success, message: res.data.message }));
      if (res.data.success){
        navigate('/order', { state: { id, success: res.data.success, request } });
        dispatch(initProduct([]))
        dispatch(initFinalTotal(0))
        dispatch(initTotal(0))
        dispatch(initCoupon(0))
      }
    } catch (error: any) {
      dispatch(pushToastAsync({ success: error.success, message: error.message }));
    }
  }
  const check= async (request:any) => {
    try {
      const res = await axios.post(`${API_URL}/v2/api/${API_PATH}/order`, request);
      if (!res.data.success) return dispatch(pushToastAsync({ success: res.data.success, message: res.data.message }));
      pay(res.data.orderId, request.data);
    } catch (error: any) {
      dispatch(pushToastAsync({ success: error.success, message: error.message }));
    }
  }

  const onSubmit =(data:any) => {
    if (data.paymentMethod === 1 && !data.isLinePay) return dispatch(pushToastAsync({ success: false, message: '先綁定LINE PAY' }));
    const request = {
      data: {
        user: {
          name: data.name,
          email: data.email,
          tel: data.tel,
          address: data.address_option1 + data.address_option2 + data.address_option3,
        },
        message: data.message,
        deliveryMethod:data.deliveryMethod,
        storeMethod:data.storeMethod,
        paymentMethod: data.paymentMethod,
        address: data.address,
        creditNumber:data.creditNumber ,
        creditSafeCode:data.creditSafeCode,
        creditExpired:data.creditExpired,
        isLinePay:data.isLinePay,
        ATM:data.ATM,
        billMethod:data.billMethod,
        bill:data.bill,
        deliveryOptions,
        paymentOptions,
        storeOptions,
        billOptions,
      }
    }
    check(request);
  };

  return (
    <main className="order-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div className="row">

            <div className="col col-left col-lg-8 py-100">
              <div className="d-flex justify-content-between align-items-center py-12 title">
                <h5 className="text-primary mb-0">
                  <img src="./leaf-2.png" alt="標題裝飾" width="32" className="me-1" />
                  收件者資料
                </h5>
                <label className="form-check-label" htmlFor="propsUserData">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="propsUserData"
                    {...register('isPropsUserData', {
                      onChange: () => handlerPropsUserData()
                    })} />
                  <span className="display-7 ms-2">同會員資料</span>
                </label>
              </div>
              <div className="rounded-2 order-write-content">
                <div className="row g-2 write-wrapper">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="name" className="w-100">
                      *姓名
                      <input
                        type="text"
                        id="name"
                        className={`form-control input-bg mt-1 ${errors["name"] && 'is-invalid'}`}
                        placeholder="請填寫姓名"
                        {...register('name', {
                          required: {
                            value: true,
                            message: '姓名為必填'
                          },
                        })} />
                    </label>
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="tel" className="w-100">
                      *手機
                      <input
                        type="tel"
                        id="tel"
                        className={`form-control input-bg mt-1 ${errors["tel"] && 'is-invalid'}`}
                        placeholder="請填寫手機"
                        {...register('tel', {
                          required: {
                            value: true,
                            message: '手機為必填'
                          },
                          minLength: {
                            value: 6,
                            message: '電話不少於 6 碼',
                          },
                          maxLength: {
                            value: 12,
                            message: '電話不大於 12 碼',
                          },
                          onChange: () => setValue("isPropsUserData", false)
                        })} />
                    </label>
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="w-100">
                      *Email
                      <input
                        type="email"
                        id="email"
                        className={`form-control input-bg mt-1 ${errors["email"] && 'is-invalid'}`}
                        placeholder="請填寫Email"
                        {...register('email', {
                          required: {
                            value: true,
                            message: 'Email 為必填'
                          },
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Email 格式不正確'
                          },
                          onChange: () => setValue("isPropsUserData", false)
                        })} />
                    </label>
                  </div>
                  <div className="col-12">
                    <label htmlFor="address_option1" className="w-100">
                      地址
                      <div className="row g-2">
                        <div className="col-6 col-lg-4">
                          <select
                            id="address_option1"
                            className="form-select input-bg mt-1"
                            {...register('address_option1', {
                              onChange: () => setValue("isPropsUserData", false)
                            })}>
                            <option disabled>請選擇縣市</option>
                            {
                              addressOptions.map(item => (
                                <option key={item.CityName} value={item.CityName}>{item.CityName}</option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="col-6 col-lg-4">
                          <select
                            className="form-select input-bg mt-1"
                            {...register('address_option2', {
                              onChange: () => setValue("isPropsUserData", false)
                            })}>
                            <option disabled>請選擇區域</option>
                            {
                              addressOptions.map(item =>
                                item.AreaList.map(item1 =>
                                  <option key={item1.AreaName} value={item1.AreaName}>{item1.AreaName}</option>
                                ))
                            }
                          </select>
                        </div>
                        <div className="col-12 col-lg-4">
                          <input
                            type="text"
                            className="form-control input-bg mt-1"
                            placeholder="鄉鎮里/街道/門號/樓層"
                            {...register('address_option3', {
                              onChange: () => setValue("isPropsUserData", false)
                            })} />
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="col-12">
                    <label htmlFor="message" className="w-100">
                      備註
                      <input
                        type="text"
                        id="message"
                        className="form-control input-bg mt-1"
                        placeholder="請填寫備註"
                        {...register('message', { onChange: () => setValue("isPropsUserData", false) })} />
                    </label>
                  </div>
                </div>
              </div>


              <div className="d-flex justify-content-between align-items-center py-12 title">
                <h5 className="text-primary mb-0">
                  <img src="./leaf-2.png" alt="標題裝飾" width="32" className="me-1" />
                  配送方式
                </h5>
                <label className="form-check-label" htmlFor="isPropsAddressData">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPropsAddressData"
                    {...register('isPropsAddressData', {
                      onChange: (e) => handlerPropsAddress(e)
                    })} />
                  <span className="display-7 ms-2">同收件者地址</span>
                </label>
              </div>
              <div className="rounded-2 order-write-content">
                <div className="row write-wrapper">
                  <div className="col-12">
                    <select
                      className="form-select input-bg mt-1 w-100"
                      {...register('deliveryMethod', {
                        valueAsNumber: true,
                        onChange: (e) => {
                          setValue("isPropsAddressData", false)
                          if (e.target.value === 2){
                            setValue("address", '店裡')
                          }else{
                            setValue("address", '')
                          }
                        }
                      }
                      )}>
                      {
                        deliveryOptions.map(item =>
                          <option key={item.id} value={item.id}>{item.value}</option>
                        )
                      }
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="row g-2">
                      <div className={deliveryMethodVal === 1 ? "col-3" : "col-12 d-none"}>
                        <select
                          className="form-select input-bg mt-1"
                          {...register('storeMethod', { valueAsNumber: true })}>
                          {
                            storeOptions.map(item => (
                              <option key={item.id} value={item.id}>{item.value}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div className={deliveryMethodVal === 1 ? "col-9" : deliveryMethodVal === 2 ?"d-none":"col-12"}>
                        <input
                          type="text"
                          className={`form-control input-bg mt-1 ${errors["address"] && 'is-invalid'}`}
                          placeholder={deliveryMethodVal === 1 ? "請填寫配送門市" : "請填寫配送地址"}
                          {...register('address', {
                            required: {
                              value: true,
                              message: deliveryMethodVal === 1 ? '配送門市為必填' : '配送地址為必填'
                            },
                            onChange: () => setValue("isPropsAddressData", false)
                          })} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <ul className="mb-0">
                      <li>宅配​到​貨日​建議​指定​週​一​至​週六。</li>
                      <li className="mt-1">如​有＂​急​需＂​請勿網路​下單，​請電洽​各​門市​或​網路​客服​為​您​服務唷！​</li>
                      <li className="mt-1">物​流寄​送時間將​依物流​公司​通知​為準，​如​造成​不​便​請見諒。​​</li>
                      <li className="mt-1">平日​非​節慶​檔期時，​至少​一​周前​做​預定​ ; 如​是​節慶​檔期，​建議​至少​半個月​以前​做​預定。​</li>
                      <li className="mt-1">ATM​匯​款期​限請於​購​買日​的​7天 。​​</li>
                    </ul>
                  </div>
                </div>
              </div>


              <div className="py-12 title">
                <h5 className="text-primary mb-0">
                  <img src="./leaf-2.png" alt="標題裝飾" width="32" className="me-1" />
                  付款方式
                </h5>
              </div>
              <div className="rounded-2 order-write-content">
                <div className="row write-wrapper">
                  <div className="col-12">
                    <select className="form-select input-bg mt-1 w-100"
                      {...register('paymentMethod', {
                        valueAsNumber: true,
                        onChange: () => {
                          setValue("creditNumber", '')
                          setValue("creditSafeCode", '')
                          setValue("creditExpired", '')
                          setValue("isLinePay", false)
                          setValue("ATM", '')
                        }
                      })}>
                      {
                        paymentOptions.map(item =>
                          <option key={item.id} value={item.id}>{item.value}</option>
                        )
                      }
                    </select>
                  </div>
                  <div className={paymentMethod === 0 ? "col-12 d-block" : 'd-none'}>
                    <div className="row g-2">
                      <div className="col-12">
                        <input
                          type="text"
                          className={`form-control input-bg mt-1 ${errors["creditNumber"] && 'is-invalid'}`}
                          placeholder="請填寫信用卡號"
                          {...register('creditNumber', {
                            required: {
                              value: paymentMethod === 0,
                              message: '信用卡號為必填'
                            },
                          })} />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className={`form-control input-bg mt-1 ${errors["creditSafeCode"] && 'is-invalid'}`}
                          placeholder="請填寫安全碼"
                          {...register('creditSafeCode', {
                            required: {
                              value: paymentMethod === 0,
                              message: '安全碼為必填'
                            },
                          })} />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className={`form-control input-bg mt-1 ${errors["creditExpired"] && 'is-invalid'}`}
                          placeholder="請填寫到期日"
                          {...register('creditExpired', {
                            required: {
                              value: paymentMethod === 0,
                              message: '到期日為必填'
                            },
                          })} />
                      </div>
                    </div>
                  </div>
                  <div className={paymentMethod === 1 ? "col-12 d-block" : 'd-none'}>
                    <button type="button" className="btn w-100 btn-primary py-3" onClick={() => changeLinePay()}>{!isLinePay ? '綁定LINE PAY' : '已綁定LINE PAY'}</button>
                  </div>
                  <div className={paymentMethod === 2 ? "col-12 d-block" : 'd-none'}>
                    <input
                      type="text"
                      className={`form-control input-bg mt-1 ${errors["bill"] && 'is-invalid'}`}
                      placeholder="請填寫帳戶"
                      {...register('ATM', {
                        required: {
                          value: paymentMethod === 2,
                          message: '帳戶為必填'
                        },
                      })} />
                  </div>
                </div>
              </div>

              <div className="py-12 title">
                <h5 className="text-primary mb-0">
                  <img src="./leaf-2.png" alt="標題裝飾" width="32" className="me-1" />
                  發票方式
                </h5>
              </div>
              <div className="rounded-2 order-write-content">
                <div className="row g-2 write-wrapper">
                  <div className={`${billMethod === 0 ? "col-6" : 'col-12'}`}>
                    <select className="form-select input-bg mt-1 w-100"
                      {...register('billMethod', {
                        valueAsNumber: true,
                        onChange: () => {
                          setValue("bill", '')
                        }
                      })}>
                      {
                        billOptions.map(item =>
                          <option key={item.id} value={item.id}>{item.value}</option>
                        )
                      }
                    </select>
                  </div>
                  <div className={`col-6 ${billMethod === 0 ? "d-block" : 'd-none'}`}>
                    <input
                      type="text"
                      className={`form-control input-bg mt-1 ${errors["bill"] && 'is-invalid'}`}
                      placeholder="請填寫載具號碼"
                      {...register('bill', {
                        required: {
                          value: billMethod === 0,
                          message: '發票為必填'
                        },
                      })} />
                  </div>
                </div>
              </div>

              <div className="py-12 title">
                <h5 className="text-primary mb-0">
                  <img src="./leaf-2.png" alt="標題裝飾" width="32" className="me-1" />
                  注意事項
                </h5>
              </div>
              <div className="rounded-2 order-write-content">
                <ul>
                  <li>在​25度​以下，蛋糕​可​安心​存放6-8​小時，而且​出貨前​都​會冷​凍定型，​確保​不​論​自取​或​配送，​但​超過2​8度​高溫​可能​導致蛋​糕融化​或​搖晃​變形。​</li>
                  <li>取貨​後請盡​快​食用​或​放入​冷藏​或​冷凍​保存。</li>
                  <li>如果​需要​帶出國​或​路途​遙遠，​搭配​保冷​袋會​更​穩妥。​</li>
                </ul>
              </div>

            </div>
            {/* 電腦版-訂單明細 */}
            <div className="col col-right col-lg-4 py-100 d-none d-lg-block">
              <h4>訂單明細</h4>
              {
                products.map((item: any) => (
                  <div className="table-grid-content border-0 p-0" key={item.id}>
                    <div className="d-flex">
                      <img
                        src={item.product.imageUrl}
                        alt="主圖"
                        className="rounded-1"
                      />
                      <div className="ps-3 w-100 d-flex flex-column justify-content-between">
                        <div>
                          <h6>{item.product.title}</h6>
                          <p className="mb-0 GenSenRounded2JP-M-Full">x{item.qty}</p>
                        </div>
                        <h6>NT$ {item.total}</h6>
                      </div>
                    </div>
                  </div>
                ))
              }
              <hr />
              <div className="d-flex justify-content-between">
                <p>小計</p>
                <p>NT$ {total}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>折扣碼</p>
                <p>{coupon <= 0 ? `NT$${coupon}` : `-NT$ ${coupon}`}</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h6>總金額</h6>
                <h6>NT$ {final_total}</h6>
              </div>
              <button type="submit" className="btn btn-primary w-100">前往付款</button>
            </div>
          </div>
        </div>

        {/* 手機板-訂單明細 */}
        <div className="offcanvas offcanvas-bottom offcanvas-order" ref={offcanvasRef}>
          <div className="offcanvas-header p-0">
            <h4 className="pb-24">訂單明細</h4>
          </div>
          <div className="offcanvas-body p-0">
            {
              products.map((item: any) => (
                <div className="table-grid-content border-0 p-0" key={item.id}>
                  <div className="d-flex">
                    <img
                      src={item.product.imageUrl}
                      alt="主圖"
                      className="rounded-1"
                    />
                    <div className="ps-3 w-100 d-flex flex-column justify-content-between">
                      <div>
                        <h6>{item.product.title}</h6>
                        <p className="mb-0 GenSenRounded2JP-M-Full">x{item.qty}</p>
                      </div>
                      <p className="mb-0">NT$ {item.total}</p>
                    </div>
                  </div>
                </div>
              ))
            }
            <hr />
            <div className="d-flex justify-content-between">
              <p>小計</p>
              <p>NT$ {total}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>運費</p>
              <p>NT$ {total}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>折扣碼</p>
              <p>{coupon <= 0 ? `NT$${coupon}` : `-NT$ ${coupon}`}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <h6>總金額</h6>
              <h6>NT$ {final_total}</h6>
            </div>
            <button type="submit" className="btn btn-primary w-100">前往付款</button>
          </div>
        </div>

        <button
          className="btn w-100 d-flex justify-content-between align-items-center offcanvas-order-btn border-top border-2 fixed-bottom d-block d-lg-none"
          type="button"
          onClick={() => {
            toggleOffcanvas()
            dispatch(changeShow(false))
          }}>
          <span>{offcanvasShow ? '收合' : '展開'}訂單明細</span>
          <span>
            {offcanvasShow ? (
              <svg width="40" height="40" className="offcanvas-order-svg-up" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" />
                <path d="M24.2785 19.1588C24.6969 19.6825 24.6674 20.4546 24.1892 20.9427L17.6583 27.6095C17.1482 28.1302 16.3213 28.1302 15.8112 27.6095C15.3012 27.0888 15.3012 26.2447 15.8112 25.724L21.4186 20L15.8112 14.276C15.3012 13.7553 15.3012 12.9112 15.8112 12.3905C16.3213 11.8698 17.1482 11.8698 17.6583 12.3905L24.1892 19.0573L24.2785 19.1588Z" fill="#815630" />
              </svg>
            ) : (
              <svg width="40" height="40" className="offcanvas-order-svg-down" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" />
                <path d="M24.2785 19.1588C24.6969 19.6825 24.6674 20.4546 24.1892 20.9427L17.6583 27.6095C17.1482 28.1302 16.3213 28.1302 15.8112 27.6095C15.3012 27.0888 15.3012 26.2447 15.8112 25.724L21.4186 20L15.8112 14.276C15.3012 13.7553 15.3012 12.9112 15.8112 12.3905C16.3213 11.8698 17.1482 11.8698 17.6583 12.3905L24.1892 19.0573L24.2785 19.1588Z" fill="#815630" />
              </svg>
            )}
          </span>
        </button>
      </form>
    </main>
  )
}