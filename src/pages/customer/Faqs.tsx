import React, { useState } from "react";

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

type FaqGroup = {
  key: "payment" | "delivery" | "member" | "order";
  label: string;
  items: FaqItem[];
};

const FAQS: FaqGroup[] = [
  {
    key: "payment",
    label: "付款相關",
    items: [
      {
        q: "目前提供哪些付款方式？",
        a: (
          <>
            <p>目前提供以下付款方式（以結帳頁顯示為準）：</p>
            <ol>
              <li>信用卡（VISA / MasterCard / JCB）</li>
              <li>Line Pay / Apple Pay</li>
              <li>ATM 轉帳</li>
              <li>貨到付款</li>
            </ol>
          </>
        ),
      },
      {
        q: "信用卡付款失敗怎麼辦？",
        a: (
          <ul>
            <li>確認卡號 / 到期日 / 安全碼是否輸入正確。</li>
            <li>可能被銀行風控擋下，建議聯繫發卡銀行。</li>
            <li>可改用其他信用卡或改選 ATM / 貨到付款。</li>
          </ul>
        ),
      },
      {
        q: "ATM 轉帳有期限嗎？逾期怎麼辦？",
        a: (
          <p>
            下單後需於指定期限內完成轉帳，逾期訂單可能自動取消；若仍需購買請重新下單。
          </p>
        ),
      },
    ],
  },
  {
    key: "delivery",
    label: "配送相關",
    items: [
      {
        q: "目前提供哪些配送方式？",
        a: (
          <>
            <ul>
              <li>冷藏宅配（台灣本島）</li>
              <li>門市自取（依結帳頁選項為準）</li>
            </ul>
            <p className="faqs__hint">
              ＊實際可選方式會依商品/溫層/地區而有所不同。
            </p>
          </>
        ),
      },
      {
        q: "訂購商品後需幾天的時間才可以收到商品呢？",
        a: (
          <>
            <ul>
              <li>下單後約 1–3 個工作天出貨（不含例假日）</li>
              <li>出貨後約 1–2 天到貨（依物流為準）</li>
            </ul>
            <p className="faqs__hint">
              ＊節慶高峰或天候因素可能延遲，將以通知為準。
            </p>
          </>
        ),
      },
      {
        q: "配送過程中蛋糕損毀，該怎麼處理？",
        a: (
          <p>
            請於 <b>24 小時內</b>{" "}
            聯繫客服，並提供外箱照片、商品受損近照與訂單編號，我們會協助後續處理。
          </p>
        ),
      },
    ],
  },
  {
    key: "member",
    label: "會員相關",
    items: [
      {
        q: "請問要如何成為會員，加入會員有甚麼優惠？",
        a: (
          <>
            <p>點擊右上角「登入 / 註冊」即可加入會員。加入會員後可享：</p>
            <ul>
              <li>更快速結帳（自動帶入收件資訊）</li>
              <li>訂單查詢與配送進度追蹤</li>
              <li>不定期會員專屬活動/優惠（依站內公告）</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    key: "order",
    label: "訂單相關",
    items: [
      {
        q: "如何更改訂購內容、送貨地址或取消訂單？",
        a: (
          <p>
            若訂單尚未出貨，請盡快聯繫客服協助修改或取消。出貨後通常無法取消或改址，建議下單前再次確認收件資訊。
          </p>
        ),
      },
    ],
  },
];

function Faqs() {
  const [activeKey, setActiveKey] = useState<FaqGroup["key"]>(FAQS[0].key);
  const [openIndex, setOpenIndex] = useState<number>(0);

  const activeGroup = FAQS.find((g) => g.key === activeKey);

  const handleChangeCategory = (key: FaqGroup["key"]) => {
    setActiveKey(key);
    setOpenIndex(0);
  };

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <main className="faqs-page">
      {/* ===== Hero ===== */}
      <section className="faqs-hero">
        <div className="layout-container">
          <div className="faqs-hero__heading">
            <img
              className="faqs-hero__animal"
              src="/bear.png"
              alt=""
              aria-hidden="true"
            />

            <div className="faqs-hero__text">
              <p className="faqs-hero__eyebrow">FAQ</p>
              <h1 className="faqs-hero__title">常見問題</h1>
            </div>

            <img
              className="faqs-hero__animal"
              src="/rabbit.png"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <div className="faqs-wave" aria-hidden="true" />

      {/* ===== 內容區 ===== */}
      <section className="faqs-content">
        <div className="layout-container">
          <div className="faqs-card">
            <nav className="faqs-tabs" aria-label="FAQ categories">
              <ul className="faqs-tabs__list">
                {FAQS.map((g) => (
                  <li key={g.key} className="faqs-tabs__item">
                    <button
                      type="button"
                      className={`faqs-tabs__btn ${activeKey === g.key ? "active" : ""}`}
                      onClick={() => handleChangeCategory(g.key)}
                    >
                      {g.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 問題列 + 答案區 */}
            <div className="faqs-block">
              <div className="faqs-questions">
                {activeGroup?.items?.map((item, idx) => {
                  const isOpen = idx === openIndex;

                  return (
                    <div className="faqs-qa" key={item.q}>
                      <button
                        type="button"
                        className={`faqs-qa__q ${isOpen ? "is-open" : ""}`}
                        aria-expanded={isOpen}
                        onClick={() => toggle(idx)}
                      >
                        <span className="faqs-qa__q-text">{item.q}</span>
                        <span className="faqs-qa__toggle" aria-hidden="true">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="faqs-qa__a">
                          <div className="faqs-qa__a-inner">{item.a}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="faqs-help">
                <p className="faqs-help__text">
                  仍有疑問？請聯繫客服：
                  <a
                    className="faqs-help__link"
                    href="mailto:service@creamyday.com.tw"
                  >
                    service@creamyday.com.tw
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Faqs;
