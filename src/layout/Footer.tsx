// import { Link } from "react-router";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-primary footer-scope">
      <div className="container">
        <div
          className="d-flex
  flex-column flex-sm-row
  justify-content-center
  justify-content-sm-between
  align-items-center mb-36 "
        >
          <div className="mb-40">
            <h2 className="text-white footer-text-24 mb-12">CreamyDay</h2>
            <ul className="social-list list-unstyled ">
              <li className="">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  className="social-link"
                  rel="noreferrer"
                >
                  <Icon icon="mdi:facebook" className="social-icon" />
                </a>
              </li>

              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="social-link"
                  rel="noreferrer"
                >
                  <Icon icon="mage:instagram-circle" className="social-icon" />
                </a>
              </li>
              <li>
                <a
                  href="https://line.me"
                  target="_blank"
                  className="social-link"
                  rel="noreferrer"
                >
                  <Icon icon="simple-icons:line" className="social-icon" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <ul className="list-unstyled d-block footer-scope">
              <li className="link-padding">
                <a
                  className="text-white text-decoration-none footer-text-18 jp-zh"
                  href="#"
                >
                  關於我們
                </a>
              </li>
              <li className="link-padding">
                <a
                  className="text-white text-decoration-none footer-text-18  jp-zh"
                  href="#"
                >
                  品牌介紹
                </a>
              </li>
              <li className="link-padding">
                <a
                  className="text-white text-decoration-none footer-text-18  jp-zh"
                  href="#"
                >
                  常見問題
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 下半部：版權 */}
        <div className="footer-wrapper footer-scope">
          <div className="footer-info white-space mb-60">
            <span className="text-white footer-item footer-text-16 jp-zh">
              營業時間 10 AM - 10 PM
            </span>

            <span className="footer-item footer-text-16 jp-zh">
              <a className="text-decoration-none text-white" href="#">
                訂購資訊
              </a>
            </span>

            <a
              href="mailto:service@creamyday.com.tw"
              className="footer-item footer-text-16 jp-en text-white mb-0"
            >
              service@creamyday.com.tw
            </a>
          </div>

          <span className="footer-copy footer-text-14 jp-en text-white">
            Copyright © CreamyDay All Rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
