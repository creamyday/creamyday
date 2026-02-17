import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";

// API 設定
const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

type CategorySlug = "new" | "hot" | "basque" | "tiramisu" | "roll" | "other";

const categoryLabel: Record<CategorySlug, string> = {
  new: "新品推薦",
  hot: "熱門商品",
  basque: "巴斯克乳酪蛋糕",
  tiramisu: "提拉米蘇",
  roll: "生乳捲",
  other: "其他甜點",
};

const labelToSlug: Record<string, CategorySlug> = {
  新品推薦: "new",
  熱門商品: "hot",
  巴斯克: "basque",
  提拉米蘇: "tiramisu",
  生乳捲: "roll",
  其他甜點: "other",
};

type ProductOption = {
  name: string;
  origin_price: number;
  price: number;
  stock: number;
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
};

const isCategorySlug = (value: unknown): value is CategorySlug => {
  return (
    value === "new" ||
    value === "hot" ||
    value === "basque" ||
    value === "tiramisu" ||
    value === "roll" ||
    value === "other"
  );
};

type SortKey = "default" | "low" | "high";

export default function Products() {
  const { category } = useParams();
  let activeSlug: CategorySlug;
  if (isCategorySlug(category)) {
    activeSlug = category;
  } else {
    activeSlug = "new";
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [favoriteSet, setFavoriteSet] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("default");

  let filtered = products.filter((p) => {
    const slug = labelToSlug[p.category] ?? "other";

    if (activeSlug === "new") return p.isNew;
    if (activeSlug === "hot") return p.isPopular;

    return slug === activeSlug;
  });

  if (sortKey === "low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortKey === "high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  const toggleFavorite = (productKey: string) => {
    setFavoriteSet((prev) => {
      const next = new Set(prev);
      if (next.has(productKey)) next.delete(productKey);
      else next.add(productKey);
      return next;
    });
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const response = await axios.get(
          `${API_URL}/v2/api/${API_PATH}/products/all`,
        );
        // console.log("取得商品成功：", response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // console.log(error.response);
          // console.log(error.response?.data);
          setErrorMsg(error.response?.data?.message ?? "取得商品失敗");
        } else {
          // console.log(error);
          setErrorMsg("取得商品失敗");
        }
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <main className="product-page">
      <section className="product-hero d-flex align-items-end">
        <div className="layout-container mb-3 mb-lg-6">
          <nav className="category-nav">
            <ul className="category-nav__list">
              {(Object.keys(categoryLabel) as CategorySlug[]).map((slug) => (
                <li key={slug} className="category-nav__item">
                  <NavLink
                    to={`/products/${slug}`}
                    className={({ isActive }) =>
                      `category-nav__btn ${isActive ? "active" : ""}`
                    }
                  >
                    {categoryLabel[slug]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="product-content">
        <div className="layout-container">
          <div className="product-filter">
            <div className="product-filter__group">
              <select
                className="product-filter__select"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
              >
                <option value="default">價格排序</option>
                <option value="low">價格：由低到高</option>
                <option value="high">價格：由高到低</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-5 text-center">載入中...</div>
          ) : errorMsg ? (
            <div className="py-5 text-center text-danger">{errorMsg}</div>
          ) : (
            <>
              <div className="row product-grid">
                {filtered.map((product) => {
                  const key = product.id;
                  const isFav = favoriteSet.has(key);

                  return (
                    <div className="col-6 col-lg-4" key={key}>
                      <NavLink
                        to={`/products/${activeSlug}/${product.id}`}
                        className="product-card"
                      >
                        <div className="product-card__media">
                          <button
                            className={`product-card__favorite-btn ${
                              isFav ? "active" : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(key);
                            }}
                            type="button"
                            aria-label={isFav ? "取消收藏" : "加入收藏"}
                          >
                            <img
                              src={
                                isFav
                                  ? "./icon-heart-liked.svg"
                                  : "./icon-heart.svg"
                              }
                              alt=""
                              className="product-card__icon"
                            />
                          </button>

                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="product-card__img"
                          />
                        </div>

                        <div className="product-card__body">
                          <h5 className="product-card__title">
                            {product.title}
                          </h5>
                          <div className="product-card__price">
                            <span className="product-card__currency">NT$</span>
                            <span className="product-card__amount">
                              {product.price}
                            </span>
                          </div>
                        </div>
                      </NavLink>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="py-5 text-center">
                  目前沒有符合「{categoryLabel[activeSlug]}」的商品
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
