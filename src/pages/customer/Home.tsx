import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";

import "../../assets/pages/customer/home.scss";

import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";

const slides = [
  {
    image: "./public/hero1.png",
    title: "CreamyDay",
    desc: "為平凡的日子, 添上一點甜",
    buttonText: "立即選購 →",
    link: "/products/hot",
  },
  {
    image: "./public/hero2.png",
    title: "CreamyDay",
    desc: "黑糖珍珠奶茶起司蛋糕",
    buttonText: "立即查看 →",
    link: "/products/new",
  },
  {
    image: "./public/hero3.jpg",
    title: "CreamyDay",
    desc: "聖誕限定！派對蛋糕限定登場",
    buttonText: "最新消息 →",
    link: "/hot",
  },
];

const moment = [
  {
    image: "./misshuang.png",
    name: "黃小姐",
    star: 5,
    date: "2025.12.10",
    moment:
      "蛋​糕入口​即化​的​奶油​讓人​驚艷，​甜度​剛好，​吃完​一​口​再​來​一口！​",
  },
  {
    image: "./mrchen.png",
    name: "陳先生",
    star: 5,
    date: "2025.12.08",
    moment: "甜度剛剛好，不膩口，吃完還想再切一塊。",
  },
  {
    image: "./mrlee.png",
    name: "李​先生​",
    star: 5,
    date: "2025.12.07",
    moment: "不​會​太​油​太甜，​味道​跟​材料​很​乾淨，​讓​人​吃​得​很​舒服。​",
  },
  {
    image: "./mrchen.png",
    name: "黃先生",
    star: 5,
    date: "2025.12.07",
    moment: "好​吃​到​忘記​拍照系列…​​還好​有​最​後​一​塊​",
  },
  {
    image: "./misslee.png",
    name: "陳​小姐",
    star: 5,
    date: "2025.12.05",
    moment:
      "吃​一口​就​冒愛心​泡泡，​鬆鬆​軟軟​超療​癒​根本​小​天​使​蛋糕​來​治愈​我​的​心情​♡​",
  },
  {
    image: "./misshuang.png",
    name: "郭​小姐",
    star: 5,
    date: "2025.12.03",
    moment:
      "甜點控必​吃!入口​即化​的​奶油​太​犯規，​輕​盈卻​超​有​存在​感，​整點甜而​不膩",
  },
];

export default function HeroCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      <section className="hero-wrapper">
        <img
          src="./carousel_hero_bg.png"
          className="hero-bg"
          alt="background"
        />

        <div className="container">
          <div
            id="carouselExample"
            className="carousel slide hero-carousel"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                />
              ))}
            </div>

            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img src={slide.image} alt={slide.title} />

                  <div className="carousel-caption custom-caption">
                    <div className="caption-content">
                      <div className="caption-text">
                        <h2 className="hero-subtitle">{slide.title}</h2>
                        <div className="hero-line"></div>
                        <p className="hero-title">{slide.desc}</p>
                        <div className="hero-line"></div>
                      </div>

                      <Link to={slide.link} className="hero-btn">
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="recommed-wrapper">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-32">
            <img className="title-img" src="./recommend1.png" alt="左邊的圖" />
            <div className="title-header d-flex flex-column align-items-center justify-content-center">
              <h2 className="mb-2 title-text">Recommend</h2>
              <p className="mb-0 subtitle-text">Creamyday 推薦口味</p>
            </div>
            <img className="title-img" src="./recommend2.png" alt="右邊的圖" />
          </div>
        </div>
      </section>

      <section className="news-wrapper">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-32">
            <img className="title-img" src="./recommend1.png" alt="左邊的圖" />
            <div className="title-header d-flex flex-column align-items-center justify-content-center">
              <h2 className="mb-2 title-text">Recommend</h2>
              <p className="mb-0 subtitle-text">Creamyday 推薦口味</p>
            </div>
            <img className="title-img" src="./recommend2.png" alt="右邊的圖" />
          </div>
        </div>
      </section>

      <section className="about-wrapper">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-32">
            <img className="title-img" src="./about1.png" alt="左邊的圖" />
            <div className="title-header d-flex flex-column align-items-center justify-content-center">
              <h2 className="mb-2 title-text">About Creamyday</h2>
              <p className="mb-0 subtitle-text">為平凡的日子，添上一點甜</p>
            </div>
            <img className="title-img" src="./about2.png" alt="右邊的圖" />
          </div>

          <div className="about-row">
            <img
              className="d-none d-lg-block"
              src="./about3.png"
              alt="左邊葉子的圖"
              width="86"
              height="135"
            />

            <p className="about-text ">
              在 CreamyDay， <br />
              每一份甜點都承載著一點柔軟、一絲幸福。
              <br />
              我們精選每一口入口的甜，
              <br />
              為的是在忙碌與壓力堆疊的日子裡，
              <br />
              替你留下一個能深呼吸的片刻。
            </p>

            <img
              className="cake-img"
              src="./about-cake-1.png"
              alt="右邊的圖"
              width="416"
              height="400"
            />
          </div>



          <div className="about-row mb-0">
         <p className="about-text d-lg-none">
            無論是一塊蛋糕、一杯奶香濃郁的布丁，
            <br />
            或是為自己準備的小獎賞，
            <br />
            都能在這裡找到屬於你的溫度與慰藉
            <br />讓 CreamyDay 陪你，把日常過成期待的模樣。
          </p>
          
          <img
              className="cake-img"
              src="./about-cake-2.png"
              alt="左邊的蛋糕"
              width="416"
              height="400"
            />

            <p className="about-text d-none d-lg-block">
              無論是一塊蛋糕、一杯奶香濃郁的布丁， <br />
              或是為自己準備的小獎賞，
              <br />
              都能在這裡找到屬於你的溫度與慰藉
              <br />讓 CreamyDay 陪你，把日常過成期待的模樣。
            </p>

            <img
              className="leaf-img"
              src="./about4.png"
              alt="右邊葉子的圖"
            />
          </div>

        </div>
      </section>

      <section className="moment-wrapper">
        <div className="moment-bg">
          <div className="container">
            <div className="d-flex align-items-center justify-content-center mb-32">
              <img className="title-img" src="./comment1.png" alt="左邊的圖" />
              <div className="title-header d-flex flex-column align-items-center justify-content-center">
                <h2 className="mb-2 title-text">Creamyday Ｍoments</h2>
                <p className="mb-0 subtitle-text">暖心推薦</p>
              </div>
              <img className="title-img" src="./comment2.png" alt="右邊的圖" />
            </div>

            <div className="moment-slider">
              {/* 左箭頭 */}
              <button
                className="moment-arrow moment-arrow--prev"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Prev"
                type="button"
              >
                ‹
              </button>

              <Swiper
                onSwiper={(s) => (swiperRef.current = s)}
                spaceBetween={16}
                slidesPerView={"auto"}
              >
                {moment.map((item) => (
                  <SwiperSlide key={item.name}>
                    {/* ⭐ 你的原本結構，完全保留 */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="moment-list d-flex gap-4">
                        <div className="moment-card">
                          <div className="moment-header mb-12">
                            <img
                              src={item.image}
                              className="avatar"
                              alt="人像"
                            />
                            <p className="moment-name mb-0">{item.name}</p>
                          </div>

                          <div className="comment-data d-flex mb-12">
                            <div className="stars">
                              {[...Array(item.star)].map((_, i) => (
                                <svg key={i} viewBox="0 0 24 24" width="16">
                                  <path d="M12 2.5l2.9 6.1 6.7.9-4.8 4.6 1.2 6.6L12 17.8 6 20.7l1.2-6.6-4.8-4.6 6.7-.9L12 2.5z" />
                                </svg>
                              ))}
                            </div>

                            <div className="moment-date">{item.date}</div>
                          </div>

                          <div className="moment-content">{item.moment}</div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* 右箭頭 */}
              <button
                className="moment-arrow moment-arrow--next"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next"
                type="button"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
