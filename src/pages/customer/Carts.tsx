import axios from "axios";
import { Link, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { changeQty, removeProduct, addCoupon, initCoupon, initProduct, initFinalTotal, initTotal, addProduct } from '../../stores/carts';
import { pushToastAsync } from '../../stores/toasts';
import type { ToastMsg } from '../../types/toasts';
import type { AddonProducts, LoveProducts, TempLove,Product } from '../../types/carts';
import type { AppDispatch, RootState } from '../../stores/allStores';


const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const addonProducts: AddonProducts[] = [
  {
    id: "a1",
    name: "刀盤蠟燭",
    price: 80,
    img: "./addon-cakeutensil-candle-set.jpeg",
    isSelect: false,
    qty: 1,
  },
  { id: "a2", name: "刀盤", price: 30, img: "./addon-cakeutensil.jpeg", isSelect: false, qty: 1 },
  { id: "a3", name: "蠟燭", price: 10, img: "./addon-candles.jpeg", isSelect: false, qty: 1 },
  { id: "a4", name: "保冷袋", price: 100, img: "./addon-coolerbag.jpeg", isSelect: false, qty: 1 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { products, final_total, total, coupon, isAdd, keyword } = useSelector((state: RootState) => state.carts);
  const productsRef = useRef(products);
  const final_totalRef = useRef(final_total);
  const totalRef = useRef(total);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isToken,setIsToken]= useState(false);
  const [addonList, setAddonList] = useState(addonProducts);
  const [loveList, setLoveList] = useState<LoveProducts[]>([]);
  const [couponId,setCouponId] = useState('');
  
  const initCartFn = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/v2/api/${API_PATH}/cart`,
      );
      dispatch(initProduct(res.data.data.carts));
      dispatch(initFinalTotal(res.data.data.final_total));
      dispatch(initTotal(res.data.data.total));
    } catch (error) {
      dispatch(initProduct(productsRef.current));
      dispatch(initFinalTotal(final_totalRef.current));
      dispatch(initTotal(totalRef.current));
      console.error(error);
    }
  }, [productsRef,dispatch])


  const updateQtyFn = async (id: string, num: number) => {
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
      await initCartFn();
      dispatch(pushToastAsync({ success: res.data.success, message: res.data.message }));
    } catch (error) {
      const err = error as ToastMsg;
      dispatch(pushToastAsync({ success: err.success, message: err.message }));
    }
  };

  const removeCartFn = async (id: string) => {
    const length = products.length;
    dispatch(removeProduct({ id: id }));
    initLoveFn();

    try {
      const res = await axios.delete(`${API_URL}/v2/api/${API_PATH}/cart/${id}`);
      await initCartFn();
      dispatch(pushToastAsync({ success: res.data.success, message: res.data.message }));
      if (length == 1) {
        navigate('/')
      }
    } catch (error) {
      const err = error as ToastMsg;
      dispatch(pushToastAsync({ success: err.success, message: err.message }));
    }
  }

  const addCouponFn = async ()=> {
    if (couponId.trim() === '')return;
    try {
      const res = await axios.post(`${API_URL}/v2/api/${API_PATH}/coupon`, {
        data: {
          code: couponId
        }
      });
      if (!res.data.success) return;
      dispatch(addCoupon(Math.round(totalRef.current - res.data.data.final_total)));
    } catch (error) {
      const err = error as ToastMsg;
      dispatch(pushToastAsync({ success: err.success, message: err.message }));
    }
  }

  const removeCouponFn = () => {
    setCouponId('');
    dispatch(initCoupon());
  }

  const initLoveFn = useCallback(async () => {
    try {
      const res = await axios.get<{ products: Product[] }>(`${API_URL}/v2/api/${API_PATH}/products/all`);
      const allProducts = res?.data?.products || [];
      const filteredList = allProducts.filter((item: Product) => {
        const isSame = productsRef.current.some((item1: Product) => item1.product.title === item.title);
        const category = item.category as string;
        return keyword.includes(category) && !isSame
      }).reduce<TempLove[]>((a, b) => {
        const item: TempLove = {
          ...b,
          isSelect: false,
        };

        const filterItem = a.findIndex((s) => s.title === item.title);
        if (filterItem === -1) {
          a.push(item);
        }
        return a;
      }, []);

      setLoveList(filteredList as unknown as LoveProducts[]);
    } catch (error) {
      const err = error as ToastMsg;
      dispatch(pushToastAsync({ success: err.success, message: err.message }));
    }
  }, [keyword, dispatch]);

  const addLoveFn = async (id:string) => {
    try {
      const res = await axios.post(
        `${API_URL}/v2/api/${API_PATH}/cart`,
        {
          data: {
            product_id: id,
            qty: 1,
          },
        },
      );
      await initCartFn();
      dispatch(addProduct(res.data.data));
      dispatch(pushToastAsync({ success: res.data.success, message: res.data.message }));
    } catch (error) {
      const err = error as ToastMsg;
      dispatch(pushToastAsync({ success: err.success, message: err.message }));
    }
  };


  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    const fetch = () => {
      setIsToken(Boolean(token));
    }
    fetch();
  }, []);

  useEffect(() => {
    if (keyword.length === 0) return;
    const fetch = () => {
      initLoveFn();
    }
    fetch();
  }, [keyword, initLoveFn])

  // 導頁過來的
  useEffect(() => {
    if (isAdd) {
      initCartFn();
    }
  }, [isAdd,initCartFn]);

  useEffect(()=>{
    if (JSON.stringify(products) !== JSON.stringify(productsRef.current)){
      productsRef.current = products
    }

    if (JSON.stringify(final_total) !== JSON.stringify(final_totalRef.current)) {
      final_totalRef.current = final_total
    }

    if (JSON.stringify(total) !== JSON.stringify(totalRef.current)) {
      totalRef.current = total
    }

  }, [products, final_total, total])

  return (
    <main className="container check-wrapper">
      <h4 className="mb-12">購物車商品/訂單確認</h4>
      {/* 電腦版-購物車 */}
      <div className="d-none d-lg-block table-responsive">
        <div className="table-grid table-grid-title">
          <div className="d-none d-lg-block"></div>
          <div className="d-none d-lg-block">商品名稱</div>
          <div className="d-none d-lg-block">單價</div>
          <div className="d-none d-lg-block">數量</div>
          <div className="d-none d-lg-block">小計</div>
          <div className="d-none d-lg-block">刪除商品</div>
        </div>

        {
          products.map((item) => (
            <div className="table-grid table-grid-content" key={item.id}>
              <div className="my-auto">
                <img
                  src={item.product.imageUrl}
                  alt="主圖"
                  className="rounded-1"
                />
              </div>
              <div className="my-auto">
                <h5>{item.product.title}</h5>
                <p className="GenSenRounded2JP-M-Full my-auto">{item.product.unit}</p>
              </div>
              <div className="my-auto">
                <p className="GenSenRounded2JP-M-Full">NT$ {item.product.price}</p>
              </div>
              <div className="my-auto">
                <div className="border p-2 rounded-2 input-group-wrapper">
                  <div className="input-group flex-nowrap">
                    <button
                      className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                      type="button"
                      disabled={item.qty <= 1}
                      onClick={() => updateQtyFn(item.id, item.qty - 1)}>
                      <Icon
                        icon="material-symbols:remove-rounded"
                        width="14px"
                      />
                    </button>
                    <input
                      type="text"
                      className="form-control border-0"
                      value={item.qty}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        if (isNaN(num)) return;
                        updateQtyFn(item.id, num);
                      }}
                    />
                    <button
                      className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                      type="button"
                      disabled={item.qty >= item.product.stock}
                      onClick={() => {
                        const num = item.qty + 1;
                        updateQtyFn(item.id, num)
                      }}>
                      <Icon
                        icon="material-symbols:add-rounded"
                        width="14px"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="my-auto">
                <p className="GenSenRounded2JP-M-Full">NT$ {item.qty * item.product.price}</p>
              </div>
              <div className="my-auto">
                <button
                  type="button"
                  className="btn border-0 px-3"
                  onClick={() => removeCartFn(item.id)}>
                  <Icon
                    icon="carbon:trash-can"
                    width="32px"
                  />
                </button>
              </div>
            </div>
          ))
        }
      </div>
      {/* 手機版-購物車 */}
      <div className="d-block d-lg-none">
        <div className="table-grid-title">
          <div className="d-block d-lg-none text-center">商品明細</div>
        </div>
        <div>
          {
            products.map((item) => (
              <div className="table-grid-content mb-0 px-12" key={item.id}>
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
                          onClick={() => removeCartFn(item.id)}>
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
                            onClick={() => updateQtyFn(item.id, item.qty - 1)}>
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
                              updateQtyFn(item.id, num);
                            }}
                          />
                          <button
                            className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                            type="button"
                            disabled={item.qty >= item.product.stock}
                            onClick={() => {
                              const num = item.qty + 1;
                              updateQtyFn(item.id, num)
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
                        onClick={() => updateQtyFn(item.id, item.qty - 1)}>
                        <Icon
                          icon="material-symbols:remove-rounded"
                          width="14px"
                        />
                      </button>
                      <input
                        type="text"
                        className="form-control border-0"
                        value={item.qty}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          if (isNaN(num)) return;
                          updateQtyFn(item.id, num);
                        }}
                      />
                      <button
                        className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                        type="button"
                        disabled={item.qty >= item.product.stock}
                        onClick={() => {
                          const num = item.qty + 1;
                          updateQtyFn(item.id, num)
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
        </div>
      </div>

      <h6 className="text-end GenSenRounded2JP-M-Full mt-20 mb-80">小計：NT$
        {total}
      </h6>

      {/* 商品加購區 */}
      <div className="table-grid-title">
        <div className="text-center">商品加購區</div>
      </div>

      <div className="addon-wrapper mb-80">
        {
          addonList.map((item) => (
            <div className="table-grid-content mb-0 addon-item" key={item.id}>
              <div className="d-flex">
                <img
                  src={item.img}
                  alt="主圖"
                  className="rounded-1"
                />
                <div className="ps-3 w-100 d-flex align-items-center">
                  <div>
                    <p className="mb-2">{item.name}</p>
                    <p className="mb-0 GenSenRounded2JP-M-Full">NT${item.price}</p>
                  </div>
                </div>
              </div>

              <div className="btn-grid">
                <div className="border p-2 rounded-2 input-group-wrapper mt-0">
                  <div className="input-group flex-nowrap">
                    <button
                      className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                      type="button"
                      disabled={item.qty === 1}
                      onClick={() => {
                        const id = item.id;
                        const num = item.qty;

                        setAddonList(prev =>
                          prev.map(product =>
                            product.id === id ? { ...product, qty: num - 1 } : product
                          )
                        );
                      }}>
                      <Icon
                        icon="material-symbols:remove-rounded"
                        width="14px"
                      />
                    </button>
                    <input
                      type="text"
                      className="form-control border-0"
                      min="0"
                      value={item.qty}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        if (isNaN(num)) return;
                        const id = item.id;
                        setAddonList(prev =>
                          prev.map(product =>
                            product.id === id ? { ...product, qty: num } : product
                          )
                        );
                      }}
                    />
                    <button
                      className="btn btn-orange d-flex justify-content-center align-items-center text-light p-0 rounded-1 input-icon"
                      type="button"
                      onClick={() => {
                        const id = item.id;
                        const num = item.qty;

                        setAddonList(prev =>
                          prev.map(product =>
                            product.id === id ? { ...product, qty: num + 1 } : product
                          )
                        );;
                      }}>
                      <Icon
                        icon="material-symbols:add-rounded"
                        width="14px"
                      />
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-outline-orange rounded-1 w-100 h-100"
                  onClick={() => setAddonList(prev =>
                    prev.map(product =>
                      product.id === item.id ? { ...product, isSelect: !item.isSelect } : product
                    )
                  )}
                  type="button">
                  {item.isSelect ? '已加購' : '加購'}
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* 猜你喜歡 */}
      {
        loveList.length > 0 && <>
          <div className="table-grid-title guess-title">
            <div className="text-center">猜你喜歡</div>
          </div>
          <div className="guess-wapper mb-80">
            <svg width="40" height="40" className="guess-btn" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => swiperRef.current?.slidePrev()}>
              <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" />
              <path d="M24.2785 19.1588C24.6969 19.6825 24.6674 20.4546 24.1892 20.9427L17.6583 27.6095C17.1482 28.1302 16.3213 28.1302 15.8112 27.6095C15.3012 27.0888 15.3012 26.2447 15.8112 25.724L21.4186 20L15.8112 14.276C15.3012 13.7553 15.3012 12.9112 15.8112 12.3905C16.3213 11.8698 17.1482 11.8698 17.6583 12.3905L24.1892 19.0573L24.2785 19.1588Z" fill="#815630" />
            </svg>

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{
                992: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1200: {
                  slidesPerView: 5,
                  spaceBetween: 24,
                },
              }}
            >
              {
                loveList.map((item) => (
                  <SwiperSlide>
                    <div className="guess-item d-flex flex-column justify-content-between" key={item.id}>
                      <img
                        src={item.imageUrl}
                        className="img-fluid rounded-1"
                        alt="猜你喜歡"
                      />
                      <p className="mb-1 mt-1">{item.title}</p>
                      <p className="mb-2">NT${item.price}</p>
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100"
                        onClick={() => {
                          setLoveList(prev =>
                            prev.map(product =>
                              product.id === item.id ? { ...product, isSelect: !item.isSelect } : product
                            )
                          )
                          addLoveFn(item.id)
                        }}>
                        {item.isSelect ? '已加購' : '加購'}
                      </button>
                    </div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
            <svg width="40" height="40" className="guess-btn" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => swiperRef.current?.slideNext()}>
              <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" />
              <path d="M24.2785 19.1588C24.6969 19.6825 24.6674 20.4546 24.1892 20.9427L17.6583 27.6095C17.1482 28.1302 16.3213 28.1302 15.8112 27.6095C15.3012 27.0888 15.3012 26.2447 15.8112 25.724L21.4186 20L15.8112 14.276C15.3012 13.7553 15.3012 12.9112 15.8112 12.3905C16.3213 11.8698 17.1482 11.8698 17.6583 12.3905L24.1892 19.0573L24.2785 19.1588Z" fill="#815630" />
            </svg>
          </div>
        </>
      }

      {/* 折扣碼+金額 */}
      <div className="row row-cols-1 row-cols-lg-2">
        <div className="col col-total-left">
          <h6>折扣碼</h6>
          <div className="d-flex flex-column flex-lg-row mt-24">
            <input type="text"
              className="form-control input-bg me-1 mb-lg-12"
              placeholder="請輸入折扣碼"
              value={couponId}
              onChange={(e) => setCouponId(e.target.value)} />
            <div className="d-flex">
              <button type="submit" className="btn btn-primary me-1 w-100 text-nowrap" onClick={() => addCouponFn()}>使用</button>
              <button type="button" className="btn btn-outline-primary w-100 text-nowrap" onClick={() => removeCouponFn()}>清除</button>
            </div>
          </div>
        </div>
        <div className="col col-total-right">
          <h6>總計</h6>
          <div className="d-flex justify-content-between">
            <p>小計</p>
            <p>NT$ 
              {total}
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p>折扣碼</p>
            <p>{coupon <= 0 ? `NT$${coupon}` : `-NT$ ${coupon}`}</p>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h6>總金額</h6>
            <h6>NT$ 
              {total - coupon}
            </h6>
          </div>
          <div>
            {
              !isToken ? (
                <>
                  <p className="text-center mb-1 text-primary">您尚未登入會員</p>
                  <Link className="btn btn-outline-primary w-100" to="/login">立即登入</Link>
                </>
              ) : <Link className="btn btn-primary w-100" to="/checkout" onClick={() => initCartFn()}>前往結帳</Link>
            }
          </div>
        </div>
      </div>
    </main>
  )
}