import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router";
import { Link as ScrollLink, Element } from "react-scroll";
import { useDispatch } from "react-redux";
import { addProduct } from "../../stores/carts";
import { pushToastAsync } from "../../stores/toasts";
import type { AppDispatch } from "../../stores/allStores";

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

type ProductOption = {
  name: string;
  freebie_note: string;
};

type ProductContent = {
  key: string;
  title: string;
  text: string;
};

type Product = {
  id: string;
  title: string;
  category: string;
  origin_price: number;
  price: number;
  unit: string;
  options: ProductOption[];
  description: string;
  content: ProductContent[];
  is_enabled: boolean;
  isPopular: boolean;
  isNew: boolean;
  imageUrl: string;
  imagesUrl: string[];
  groupKey: string;
  stock: number;
};

type AddonProduct = {
  id: string;
  name: string;
  price: number;
  img: string;
};

const addonProducts: AddonProduct[] = [
  {
    id: "a1",
    name: "刀盤蠟燭",
    price: 80,
    img: "./addon-cakeutensil-candle-set.jpeg",
  },
  { id: "a2", name: "刀盤", price: 30, img: "./addon-cakeutensil.jpeg" },
  { id: "a3", name: "蠟燭", price: 10, img: "./addon-candles.jpeg" },
  { id: "a4", name: "保冷袋", price: 100, img: "./addon-coolerbag.jpeg" },
];

const ICON = {
  switch: "./icon-switch.svg",
  plus: "./icon-plus.svg",
  minus: "./icon-minus.svg",
  cart: "./icon-cart.svg",
  heart: "./icon-heart.svg",
} as const;

type RouteParams = {
  category?: string;
  productId?: string;
};

export default function ProductDetail() {
  const { category, productId } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/v2/api/${API_PATH}/products/all`,
        );
        // console.log("取得全部商品成功：", res.data.products);
        setAllProducts(res.data.products);
      } catch (error) {
        console.error("取得全部商品失敗:", error);
      }
    };

    getAllProducts();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      if (!productId) {
        setErrorMsg("缺少商品 ID");
        return;
      }

      const localProduct = allProducts.find((p) => p.id === productId);

      if (localProduct) {
        setProduct(localProduct);
        setActiveImgIndex(0);
        setQuantity(1);
        setErrorMsg(null);
      } else {
        setLoading(true);
        setErrorMsg(null);

        try {
          const response = await axios.get(
            `${API_URL}/v2/api/${API_PATH}/product/${productId}`,
          );
          // console.log(response.data);

          if (!response.data.product) {
            setErrorMsg("找不到商品資料");
            setProduct(null);
            return;
          }
          setProduct(response.data.product);
          // console.log(
          //   "default option name:",
          //   response.data.product.options?.[0]?.name,
          // );
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            setErrorMsg(error.response?.data?.message ?? "取得商品失敗");
          } else {
            setErrorMsg("取得商品失敗");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    getProduct();
  }, [productId, allProducts]);

  if (loading) {
    return (
      <main className="product-detail">
        <div className="layout-container py-5 text-center">載入中...</div>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="product-detail">
        <div className="layout-container py-5 text-center">{errorMsg}</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail">
        <div className="layout-container py-5 text-center">找不到商品資料</div>
      </main>
    );
  }

  const optionStock = product.stock ?? 0;
  const isSoldOut = optionStock <= 0;
  const maxQty = optionStock > 0 ? optionStock : 1;

  const currentOption = product.options.find(
    (opt) => opt.name === product.unit,
  );

  const sameGroupProducts = allProducts.filter(
    (p) => p.groupKey === product.groupKey,
  );

  const imgCount = product.imagesUrl?.length ?? 0;

  const handlePrev = () => {
    if (imgCount === 0) return;
    setActiveImgIndex((prev) => (prev === 0 ? imgCount - 1 : prev - 1));
  };

  const handleNext = () => {
    if (imgCount === 0) return;
    setActiveImgIndex((prev) => (prev === imgCount - 1 ? 0 : prev + 1));
  };

  const increment = () => {
    if (isSoldOut) return;
    setQuantity((prev) => (prev >= maxQty ? prev : prev + 1));
  };

  const decrement = () => {
    if (isSoldOut) return;
    setQuantity((prev) => (prev <= 1 ? 1 : prev - 1));
  };

  // 加入購物車
  const handleAddToCart = async () => {
    if (!product || isSoldOut || quantity < 1 || quantity > maxQty) return;
    setIsAddingToCart(true);
    try {
      const payload = {
        data: {
          product_id: product.id,
          qty: quantity,
        },
      };

      const res = await axios.post(
        `${API_URL}/v2/api/${API_PATH}/cart`,
        payload,
      );
      dispatch(pushToastAsync({ success: true, message: res.data.message }));
      dispatch(addProduct(res.data.data));
    } catch (error: unknown) {
      let message = "加入購物車失敗";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      dispatch(pushToastAsync({ success: false, message }));
    } finally {
      setIsAddingToCart(false);
    }
  };

  // 立即購買
  const handleBuyNow = async () => {
    if (!product || isSoldOut || quantity < 1 || quantity > maxQty) return;
    setIsAddingToCart(true);
    try {
      const payload = {
        data: {
          product_id: product.id,
          qty: quantity,
        },
      };
      const res = await axios.post(
        `${API_URL}/v2/api/${API_PATH}/cart`,
        payload,
      );
      dispatch(pushToastAsync({ success: true, message: res.data.message }));
      // 成功後直接導向結帳頁面
      dispatch(addProduct(res.data.data));
      navigate("/carts");
    } catch (error: unknown) {
      let message = "立即購買失敗";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      dispatch(pushToastAsync({ success: false, message }));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleChangeUnit = (newUnit: string) => {
    if (!product) return;
    const targetProduct = sameGroupProducts.find((p) => p.unit === newUnit);
    if (!targetProduct) return;
    navigate(`/products/${category}/${targetProduct.id}`);
  };

  return (
    <>
      <main className="product-detail">
        <div className="layout-container">
          <section className="product-main">
            <div className="product-main__gallery">
              <div className="product-main__viewer">
                {imgCount > 0 && (
                  <img
                    src={product.imagesUrl[activeImgIndex]}
                    alt={product.title}
                    className="product-main__img--main"
                  />
                )}

                <button
                  type="button"
                  className="product-main__arrow product-main__arrow--prev"
                  onClick={handlePrev}
                >
                  <img src={ICON.switch} alt="Previous" />
                </button>

                <button
                  type="button"
                  className="product-main__arrow product-main__arrow--next"
                  onClick={handleNext}
                >
                  <img src={ICON.switch} alt="Next" />
                </button>

                <div className="product-main__indicators">
                  {product.imagesUrl.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`product-main__indicator-dot ${
                        index === activeImgIndex ? "is-active" : ""
                      }`}
                      onClick={() => setActiveImgIndex(index)}
                    ></button>
                  ))}
                </div>
              </div>

              <ul className="product-main__thumbs">
                {product.imagesUrl.map((url, index) => (
                  <li
                    key={index}
                    className={`product-main__thumb-item ${
                      index === activeImgIndex ? "is-active" : ""
                    }`}
                    onClick={() => setActiveImgIndex(index)}
                  >
                    <img src={url} alt={`thumbnail ${index + 1}`} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-main__info">
              <nav className="product-main__breadcrumb" aria-label="breadcrumb">
                商品介紹
                <span> / </span>
                <NavLink
                  to={`/products/${category}`}
                  className="product-main__breadcrumb-link"
                >
                  {product.category}
                </NavLink>
                <span> / </span>
                <span className="product-main__breadcrumb-current">
                  {product.title}
                </span>
              </nav>

              <header className="product-main__header">
                <h2 className="product-main__title">{product.title}</h2>
                <p className="product-main__description">
                  {product.description}
                </p>

                {currentOption?.freebie_note && (
                  <p className="product-main__freebienote">
                    **{currentOption.freebie_note}
                  </p>
                )}

                <p className="product-main__price">NT${product.price}</p>
              </header>

              <div className="product-main__options-group">
                <div className="product-main__field">
                  <label className="product-main__label">尺寸</label>
                  <div className="product-main__select-wrapper">
                    <select
                      className="product-main__select"
                      value={product.unit}
                      onChange={(e) => handleChangeUnit(e.target.value)}
                      disabled={isAddingToCart}
                    >
                      {sameGroupProducts.length > 0 &&
                        sameGroupProducts.map((p) => (
                          <option key={p.id} value={p.unit}>
                            {p.unit}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="product-main__field">
                  <label className="product-main__label">數量</label>
                  <div className="product-main__quantity">
                    <button
                      type="button"
                      className="product-main__qty-btn"
                      onClick={decrement}
                      disabled={quantity <= 1 || isSoldOut || isAddingToCart}
                    >
                      <img src={ICON.minus} alt="減少" />
                    </button>

                    <input
                      type="number"
                      className="product-main__qty-input"
                      value={quantity}
                      readOnly
                    />

                    <button
                      type="button"
                      className="product-main__qty-btn"
                      onClick={increment}
                      disabled={
                        isSoldOut || isAddingToCart || quantity >= maxQty
                      }
                    >
                      <img src={ICON.plus} alt="增加" />
                    </button>
                  </div>
                </div>
              </div>

              {isSoldOut ? (
                <div className="product-main__soldout">
                  <button
                    type="button"
                    className="product-main__btn product-main__btn--soldout"
                    disabled
                  >
                    商品已售完
                  </button>
                </div>
              ) : (
                <>
                  <div className="product-main__action">
                    <button
                      type="button"
                      className="product-main__btn product-main__btn--cart"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? "加入中..." : "加入購物車"}
                      <img
                        src={ICON.cart}
                        alt="cart"
                        className="product-main__btn-icon"
                      />
                    </button>

                    <button
                      type="button"
                      className="product-main__btn product-main__btn--buy"
                      onClick={handleBuyNow}
                      disabled={isAddingToCart}
                    >
                      立即購買
                    </button>
                  </div>
                </>
              )}

              <div className="product-main__wishlist">
                <button type="button" className="product-main__wishlist-btn">
                  <img
                    src={ICON.heart}
                    alt="wishlist"
                    className="product-main__wishlist-icon"
                  />
                  加入追蹤清單
                </button>
              </div>
            </div>
          </section>

          <section className="product-addon">
            <h3 className="product-addon__title">加購商品</h3>
            <ul className="product-addon__list">
              {addonProducts.map((item) => (
                <li key={item.id} className="product-addon__item">
                  <div className="product-addon__header-info">
                    <div className="product-addon__img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="product-addon__text">
                      <span className="product-addon__name">{item.name}</span>
                      <span className="product-addon__price">
                        NT${item.price}
                      </span>
                    </div>
                  </div>

                  <div className="product-addon__control">
                    <div className="product-addon__qty">
                      <button type="button" className="product-addon__qty-btn">
                        <img src={ICON.minus} alt="減少" />
                      </button>
                      <span className="product-addon__qty-num">1</span>
                      <button type="button" className="product-addon__qty-btn">
                        <img src={ICON.plus} alt="增加" />
                      </button>
                    </div>
                    <button type="button" className="product-addon__add-btn">
                      加購
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="product-details-wave" aria-hidden="true" />

        <section className="product-details">
          <div className="detail-container">
            <nav className="product-details__nav">
              <ul className="product-details__nav-list">
                {product.content.map((item) => (
                  <li key={item.key} className="product-details__nav-item">
                    <ScrollLink
                      to={item.key}
                      smooth={true}
                      duration={250}
                      offset={-150}
                      className="product-details__nav-btn"
                      activeClass="active"
                      spy={true}
                    >
                      {item.title}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="product-details__content">
              {product.content.map((item) => (
                <Element name={item.key} key={item.key}>
                  <article className="product-section">
                    <div
                      className={`product-section__card ${
                        item.key === "shipping"
                          ? "product-section__card--shipping"
                          : ""
                      }`}
                    >
                      <div className="product-section__info">
                        <h3 className="product-section__title">{item.title}</h3>

                        <div className="product-section__body">
                          {item.key === "shipping"
                            ? item.text.split("\n").map((line, idx) => {
                                const isHeading = [
                                  "配送方式",
                                  "付款方式",
                                  "訂購須知",
                                ].includes(line.trim());
                                const isEmpty = line.trim() === "";
                                if (isEmpty) return <br key={idx} />;

                                return (
                                  <div
                                    key={idx}
                                    className={
                                      isHeading
                                        ? "product-section__subheading"
                                        : "product-section__line"
                                    }
                                  >
                                    {line}
                                  </div>
                                );
                              })
                            : item.text}
                        </div>
                      </div>

                      {item.key === "intro" && (
                        <div className="product-section__img">
                          <img src={product.imageUrl} alt="商品介紹" />
                        </div>
                      )}

                      {item.key === "spec" && product.imagesUrl[1] && (
                        <div className="product-section__img">
                          <img src={product.imagesUrl[1]} alt="商品規格" />
                        </div>
                      )}

                      {item.key === "shipping" && (
                        <div className="product-section__img product-section__img--shipping">
                          <picture>
                            <source
                              media="(max-width: 991px)"
                              srcSet="./illustration-cat-mobile.png"
                            />
                            <img src="./illustration-cat.png" alt="裝飾圖" />
                          </picture>
                        </div>
                      )}
                    </div>
                  </article>
                </Element>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
