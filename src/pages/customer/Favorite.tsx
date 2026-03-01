import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CustomerSidebar from "./CustomerSideBar";

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

export default function Favorite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* 取得商品 */
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/v2/api/${API_PATH}/products/all`,
        );
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  /* 取得 local 收藏 */
  useEffect(() => {
    const localFav = localStorage.getItem("favorites");
    if (localFav) {
      setFavorites(JSON.parse(localFav));
    }
  }, []);

  /* 切換收藏 */
  const toggleFavorite = (id: string) => {
    let newFav: string[] = [];

    if (favorites.includes(id)) {
      newFav = favorites.filter((item) => item !== id);
    } else {
      newFav = [...favorites, id];
    }

    setFavorites(newFav);
    localStorage.setItem("favorites", JSON.stringify(newFav));
  };

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-4">會員中心 / 我的收藏</h2>

      <div className="row">
        <CustomerSidebar />

        <div className="col-12 col-md-9">
          {/* ================= Skeleton ================= */}
          {loading && (
            <div className="row g-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="col-12 col-md-6 col-lg-4">
                  <div className="placeholder-glow">
                    <div
                      className="placeholder col-12 rounded"
                      style={{ height: "250px" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 有收藏 ================= */}
          {!loading && favoriteProducts.length > 0 && (
            <div className="row g-4">
              {favoriteProducts.map((item) => {
                const isFav = favorites.includes(item.id);

                return (
                  <div key={item.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card border-0 h-100">
                      <div className="position-relative overflow-hidden rounded">
                        {/* 圖片 */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="card-img-top"
                          style={{
                            height: "250px",
                            objectFit: "cover",
                            cursor: "pointer",
                            transition: "0.4s",
                          }}
                          onClick={() => navigate(`/product/${item.id}`)}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />

                        {/* ❤️ 收藏按鈕 (跟 products 一樣) */}
                        <button
                          className={`product-card__favorite-btn ${
                            isFav ? "active" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item.id);
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
                      </div>

                      {/* 文字 */}
                      <div className="mt-3">
                        <h6
                          className="fw-bold"
                          style={{ cursor: "pointer", transition: "0.3s" }}
                          onClick={() => navigate(`/product/${item.id}`)}
                          onMouseOver={(e) =>
                            e.currentTarget.classList.add("text-primary")
                          }
                          onMouseOut={(e) =>
                            e.currentTarget.classList.remove("text-primary")
                          }
                        >
                          {item.title}
                        </h6>

                        <p className="mb-0">NT$ {item.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= 無收藏畫面 ================= */}
          {!loading && favoriteProducts.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: "70px" }}>🤍</div>

              <h4 className="fw-bold mt-3">尚未收藏任何商品</h4>

              <p className="text-muted">
                把喜歡的甜點加入收藏，下次更方便找到它！
              </p>

              <button
                className="btn mt-3 btn-primary"
                style={{
                  padding: "10px 28px",
                  borderRadius: "30px",
                }}
                onClick={() => navigate("./products/new")}
              >
                去逛逛
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
