import { Link } from "react-router";

function About() {
  return (
    <main className="about-page">
      {/* ===== Hero ===== */}
      <section className="about-hero">
        <div className="layout-container">
          <div className="about-hero__heading">
            <img
              src="./bear.png"
              alt=""
              className="about-hero__animal"
              aria-hidden="true"
            />

            <div className="about-hero__text">
              <p className="about-hero__eyebrow">About CreamyDay</p>
              <h1 className="about-hero__title">為平凡的日子，添上一塊甜</h1>
            </div>

            <img
              src="./cat.png"
              alt=""
              className="about-hero__animal"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
      <div className="about-wave" aria-hidden="true"></div>

      {/* ===== Opening ===== */}
      <section className="about-opening">
        <div className="layout-container">
          <div className="about-opening__inner">
            <div className="about-opening__block about-opening__block--top">
              <div className="about-opening__leaf-col" aria-hidden="true">
                <img
                  src="/leaf.png"
                  alt="葉子插圖"
                  className="about-opening__leaf"
                  aria-hidden="true"
                />
              </div>

              <div className="about-opening__text">
                <p className="about-opening__p">在 CreamyDay，</p>
                <p className="about-opening__p">
                  每一份甜點都承載著一點柔軟、一絲幸福。
                </p>
                <p className="about-opening__p">我們精選每一口入口的甜，</p>
                <p className="about-opening__p">
                  為的是在忙碌與壓力堆疊的日子裡，
                </p>
                <p className="about-opening__p">替你留下一個能深呼吸的片刻。</p>
              </div>

              <div className="about-opening__media">
                <img
                  src="/about-cake-1.png"
                  alt="CreamyDay甜點照片"
                  className="about-opening__img"
                />
              </div>
            </div>

            <div className="about-opening__block about-opening__block--bottom ">
              <div className="about-opening__media">
                <img
                  src="/about-cake-2.png"
                  alt="CreamyDay 甜點照片"
                  className="about-opening__img"
                />
              </div>

              <div className="about-opening__text">
                <p className="about-opening__p">
                  無論是一塊蛋糕、一杯奶香濃郁的布丁，
                </p>
                <p className="about-opening__p">或是為自己準備的小獎賞，</p>
                <p className="about-opening__p">
                  都能在這裡找到屬於你的溫度與慰藉。
                </p>
                <p className="about-opening__p">
                  讓 CreamyDay 陪你，把日常過成期待的模樣。
                </p>
              </div>

              <div className="about-opening__leaf-col" aria-hidden="true">
                <img
                  src="/leaf-2.png"
                  alt="葉子插圖"
                  className="about-opening__leaf"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="about-wave about-wave--bottom" aria-hidden="true"></div>

      {/* ===== Promise ===== */}
      <section className="about-promises">
        <div className="layout-container">
          <h2 className="about-section-title">我們的三個小小承諾</h2>

          <div className="about-promises__grid">
            <article className="about-card">
              <span className="about-card__tag">Ingredients</span>
              <h3 className="about-card__title">真材實料</h3>
              <p className="about-card__text">
                選用安心食材，減少不必要的添加，甜甜更純粹。
              </p>
            </article>

            <article className="about-card">
              <span className="about-card__tag">Balance</span>
              <h3 className="about-card__title">剛剛好的甜</h3>
              <p className="about-card__text">
                甜度不搶味，讓每一口都耐吃、舒服。
              </p>
            </article>

            <article className="about-card">
              <span className="about-card__tag">Fresh</span>
              <h3 className="about-card__title">新鮮製作</h3>
              <p className="about-card__text">
                依訂單製作與低溫配送，把最佳狀態交到你手上。
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== Craft ===== */}
      <section className="about-craft">
        <div className="layout-container">
          <h2 className="about-craft__title">每一口的背後，是我們的堅持。</h2>

          <div className="about-craft__inner">
            <div className="about-craft__media">
              <img
                className="about-craft__img"
                src="./about-make.png"
                alt="製作甜點的過程"
              />
            </div>

            <div className="about-craft__content">
              <p className="about-craft__p">
                從打發奶油開始，
                <br />
                到最後一層淋醬與裝飾，
                <br />
                每一步都在廚房裡反覆調整。
              </p>

              <p className="about-craft__p">
                我們不追求浮誇的甜，
                <br />
                只在意那種
                <br />
                吃完會覺得安心的味道。
              </p>

              <p className="about-craft__p about-craft__p--em">
                CreamyDay 的甜，
                <br />
                來自慢慢製作的節奏。
              </p>

              <div className="about-craft__deco" aria-hidden="true" />
            </div>
          </div>

          <p className="about-craft__quote">
            不只是甜點，更是一份生活裡的溫柔。
          </p>
        </div>
      </section>

      {/* ===== Cta ===== */}
      <section className="about-cta-section">
        <div className="layout-container">
          <div className="about-cta">
            <div className="about-cta__inner">
              <div className="about-cta__content">
                <p className="about-cta__title">今天的你，也想來點甜嗎？</p>
                <p className="about-cta__desc">
                  從經典巴斯克到季節限定，用一口甜把今天過得更溫柔。
                </p>
                <Link to="/products/new" className="about-cta__btn">
                  <span>查看所有商品</span>
                  <span className="about-cta__arrow">→</span>
                </Link>
              </div>
              <img
                className="about-cta__animal"
                src="./mouse.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
