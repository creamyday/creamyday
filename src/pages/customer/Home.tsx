import "../../assets/pages/customer/home.scss";
import { Link } from "react-router";

const slides = [
  {
    image: "/hero1.png",
    title: "CreamyDay",
    desc: "為平凡的日子，添上一點甜",
    buttonText: "立即選購 →",
    link: "/products/cake/1",
  },
  {
    image: "/hero2.png",
    title: "CreamyDay",
    desc: "黑糖珍珠奶茶起司蛋糕",
    buttonText: "立即查看 →",
    link: "/new",
  },
  {
    image: "/hero3.jpg",
    title: "CreamyDay",
    desc: "聖誕限定！派對蛋糕限定登場",
    buttonText: "最新消息 →",
    link: "/hot",
  },
];

export default function HeroCarousel() {
  return (
    <div className="hero-wrapper">
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
                      <h2>{slide.title}</h2>
                      <p>{slide.desc}</p>
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
    </div>
  );
}
