import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import "../../assets/pages/customer/Register.scss";

interface FormRegister {
  name: string;
  email: string;
  isEmailTo: boolean;
  password: string;
  again_password: string;
  gender: string;
  phone: string;
  city: string;
  area: string;
  address: string;
}

interface EyeStatus {
  eye1: boolean;
  eye2: boolean;
}

const cityAreaMap: Record<string, string[]> = {
  台北市: [
    "中正區",
    "大同區",
    "中山區",
    "松山區",
    "大安區",
    "萬華區",
    "信義區",
    "士林區",
    "北投區",
    "內湖區",
    "南港區",
    "文山區",
  ],
  新北市: [
    "板橋區",
    "三重區",
    "中和區",
    "永和區",
    "新莊區",
    "新店區",
    "樹林區",
    "鶯歌區",
    "三峽區",
    "淡水區",
    "汐止區",
    "瑞芳區",
    "土城區",
    "蘆洲區",
    "五股區",
    "泰山區",
    "林口區",
    "深坑區",
    "石碇區",
    "坪林區",
    "三芝區",
    "石門區",
    "八里區",
    "平溪區",
    "雙溪區",
    "貢寮區",
    "金山區",
    "萬里區",
    "烏來區",
  ],
  桃園市: [
    "桃園區",
    "中壢區",
    "平鎮區",
    "八德區",
    "楊梅區",
    "蘆竹區",
    "大溪區",
    "龍潭區",
    "龜山區",
    "大園區",
    "觀音區",
    "新屋區",
    "復興區",
  ],
  台中市: [
    "中區",
    "東區",
    "南區",
    "西區",
    "北區",
    "北屯區",
    "西屯區",
    "南屯區",
    "太平區",
    "大里區",
    "霧峰區",
    "烏日區",
    "豐原區",
    "后里區",
    "石岡區",
    "東勢區",
    "和平區",
    "新社區",
    "潭子區",
    "大雅區",
    "神岡區",
    "大肚區",
    "沙鹿區",
    "龍井區",
    "梧棲區",
    "清水區",
    "大甲區",
    "外埔區",
    "大安區",
  ],
  台南市: [
    "中西區",
    "東區",
    "南區",
    "北區",
    "安平區",
    "安南區",
    "永康區",
    "歸仁區",
    "新化區",
    "左鎮區",
    "玉井區",
    "楠西區",
    "南化區",
    "仁德區",
    "關廟區",
    "龍崎區",
    "官田區",
    "麻豆區",
    "佳里區",
    "西港區",
    "七股區",
    "將軍區",
    "學甲區",
    "北門區",
    "新營區",
    "後壁區",
    "白河區",
    "東山區",
    "六甲區",
    "下營區",
    "柳營區",
    "鹽水區",
    "善化區",
    "大內區",
    "山上區",
    "新市區",
    "安定區",
  ],
  高雄市: [
    "楠梓區",
    "左營區",
    "鼓山區",
    "三民區",
    "鹽埕區",
    "前金區",
    "新興區",
    "苓雅區",
    "前鎮區",
    "旗津區",
    "小港區",
    "鳳山區",
    "大寮區",
    "鳥松區",
    "林園區",
    "仁武區",
    "大樹區",
    "大社區",
    "岡山區",
    "路竹區",
    "橋頭區",
    "梓官區",
    "彌陀區",
    "永安區",
    "燕巢區",
    "田寮區",
    "阿蓮區",
    "茄萣區",
    "湖內區",
    "旗山區",
    "美濃區",
    "內門區",
    "杉林區",
    "甲仙區",
    "六龜區",
    "茂林區",
    "桃源區",
    "那瑪夏區",
  ],
  基隆市: [
    "仁愛區",
    "信義區",
    "中正區",
    "中山區",
    "安樂區",
    "暖暖區",
    "七堵區",
  ],
  新竹市: ["東區", "北區", "香山區"],
  新竹縣: [
    "竹北市",
    "竹東鎮",
    "新埔鎮",
    "關西鎮",
    "湖口鄉",
    "新豐鄉",
    "芎林鄉",
    "橫山鄉",
    "北埔鄉",
    "寶山鄉",
    "峨眉鄉",
    "尖石鄉",
    "五峰鄉",
  ],
  苗栗縣: [
    "苗栗市",
    "苑裡鎮",
    "通霄鎮",
    "竹南鎮",
    "頭份市",
    "後龍鎮",
    "卓蘭鎮",
    "大湖鄉",
    "公館鄉",
    "銅鑼鄉",
    "南庄鄉",
    "頭屋鄉",
    "三義鄉",
    "西湖鄉",
    "造橋鄉",
    "三灣鄉",
    "獅潭鄉",
    "泰安鄉",
  ],
  彰化縣: [
    "彰化市",
    "鹿港鎮",
    "和美鎮",
    "線西鄉",
    "伸港鄉",
    "福興鄉",
    "秀水鄉",
    "花壇鄉",
    "芬園鄉",
    "員林市",
    "溪湖鎮",
    "田中鎮",
    "大村鄉",
    "埔鹽鄉",
    "埔心鄉",
    "永靖鄉",
    "社頭鄉",
    "二水鄉",
    "北斗鎮",
    "二林鎮",
    "田尾鄉",
    "埤頭鄉",
    "芳苑鄉",
    "大城鄉",
    "竹塘鄉",
    "溪州鄉",
  ],
  南投縣: [
    "南投市",
    "埔里鎮",
    "草屯鎮",
    "竹山鎮",
    "集集鎮",
    "名間鄉",
    "鹿谷鄉",
    "中寮鄉",
    "魚池鄉",
    "國姓鄉",
    "水里鄉",
    "信義鄉",
    "仁愛鄉",
  ],
  雲林縣: [
    "斗六市",
    "斗南鎮",
    "虎尾鎮",
    "西螺鎮",
    "土庫鎮",
    "北港鎮",
    "古坑鄉",
    "大埤鄉",
    "莿桐鄉",
    "林內鄉",
    "二崙鄉",
    "崙背鄉",
    "麥寮鄉",
    "東勢鄉",
    "褒忠鄉",
    "臺西鄉",
    "元長鄉",
    "四湖鄉",
    "口湖鄉",
    "水林鄉",
  ],
  嘉義市: ["東區", "西區"],
  嘉義縣: [
    "太保市",
    "朴子市",
    "布袋鎮",
    "大林鎮",
    "民雄鄉",
    "溪口鄉",
    "新港鄉",
    "六腳鄉",
    "東石鄉",
    "義竹鄉",
    "鹿草鄉",
    "水上鄉",
    "中埔鄉",
    "竹崎鄉",
    "梅山鄉",
    "番路鄉",
    "大埔鄉",
    "阿里山鄉",
  ],
  屏東縣: [
    "屏東市",
    "潮州鎮",
    "東港鎮",
    "恆春鎮",
    "萬丹鄉",
    "長治鄉",
    "麟洛鄉",
    "九如鄉",
    "里港鄉",
    "鹽埔鄉",
    "高樹鄉",
    "萬巒鄉",
    "內埔鄉",
    "竹田鄉",
    "新埤鄉",
    "枋寮鄉",
    "新園鄉",
    "崁頂鄉",
    "林邊鄉",
    "南州鄉",
    "佳冬鄉",
    "琉球鄉",
    "車城鄉",
    "滿州鄉",
    "枋山鄉",
    "三地門鄉",
    "霧臺鄉",
    "瑪家鄉",
    "泰武鄉",
    "來義鄉",
    "獅子鄉",
    "牡丹鄉",
  ],
  宜蘭縣: [
    "宜蘭市",
    "羅東鎮",
    "蘇澳鎮",
    "頭城鎮",
    "礁溪鄉",
    "壯圍鄉",
    "員山鄉",
    "冬山鄉",
    "五結鄉",
    "三星鄉",
    "大同鄉",
    "南澳鄉",
  ],
  花蓮縣: [
    "花蓮市",
    "鳳林鎮",
    "玉里鎮",
    "新城鄉",
    "吉安鄉",
    "壽豐鄉",
    "光復鄉",
    "豐濱鄉",
    "瑞穗鄉",
    "富里鄉",
    "秀林鄉",
    "萬榮鄉",
    "卓溪鄉",
  ],
  台東縣: [
    "台東市",
    "成功鎮",
    "關山鎮",
    "卑南鄉",
    "鹿野鄉",
    "池上鄉",
    "東河鄉",
    "長濱鄉",
    "太麻里鄉",
    "大武鄉",
    "綠島鄉",
    "海端鄉",
    "延平鄉",
    "金峰鄉",
    "達仁鄉",
    "蘭嶼鄉",
  ],
  澎湖縣: ["馬公市", "湖西鄉", "白沙鄉", "西嶼鄉", "望安鄉", "七美鄉"],
  金門縣: ["金城鎮", "金湖鎮", "金沙鎮", "金寧鄉", "烈嶼鄉", "烏坵鄉"],
  連江縣: ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"],
};

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<EyeStatus>({
    eye1: false,
    eye2: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormRegister>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      isEmailTo: false,
      password: "",
      again_password: "",
      gender: "male",
      phone: "",
      city: "",
      area: "",
      address: "",
    },
  });

  // useWatch 監聽表單值
  const isEmailVerified = useWatch({ control, name: "isEmailTo" });
  const selectedCity = useWatch({ control, name: "city" });

  const onSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const handlerEmailTo = () =>
    setValue("isEmailTo", true, { shouldValidate: true });

  const toggleEye = (type: keyof EyeStatus) => {
    setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-9 justify-content-center">
          <h2 className="mb-5 text-center">會員註冊</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 姓名 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 姓名：</label>
              </div>
              <div className="col-md-7">
                <input
                  className="form-control"
                  placeholder="請輸入姓名"
                  {...register("name", { required: "姓名為必填" })}
                />
                {errors.name && (
                  <span className="text-danger">{errors.name.message}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 電子郵件：</label>
              </div>
              <div className="col-md-7">
                <div className="input-group border rounded">
                  <input
                    className="form-control border-0"
                    placeholder="請輸入電子郵件"
                    {...register("email", {
                      required: "Email 為必填",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email 格式不正確",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-primary rounded m-2 text-nowrap input-btn"
                    onClick={handlerEmailTo}
                  >
                    {isEmailVerified ? "驗證成功" : "驗證信箱"}
                  </button>
                  <input
                    type="hidden"
                    {...register("isEmailTo", {
                      validate: (value) => value === true || "尚未驗證信箱",
                    })}
                  />
                </div>
                {Array.from([errors.email, errors.isEmailTo])
                  .filter((e) => e?.message)
                  .map((error, idx) => (
                    <span className="text-danger d-inline-block me-1" key={idx}>
                      {error?.message}
                    </span>
                  ))}
                <div className="mt-2 fw-bold">
                  * 電子郵件會是您的帳號，請確實填寫
                </div>
              </div>
            </div>

            {/* 密碼 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 密碼：</label>
              </div>
              <div className="col-md-7">
                <div className="input-group border rounded">
                  <input
                    type={showPassword.eye1 ? "text" : "password"}
                    className="form-control border-0"
                    placeholder="請輸入密碼"
                    {...register("password", {
                      required: "密碼為必填",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/i,
                        message: "密碼需包含大小寫與數字",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="btn py-0"
                    onClick={() => toggleEye("eye1")}
                  >
                    <Icon
                      icon={
                        showPassword.eye1
                          ? "heroicons-solid:eye"
                          : "majesticons:eye-off"
                      }
                      width="24px"
                    />
                  </button>
                </div>
                {errors.password && (
                  <span className="text-danger">{errors.password.message}</span>
                )}
              </div>
            </div>

            {/* 確認密碼 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 確認密碼：</label>
              </div>
              <div className="col-md-7">
                <div className="input-group border rounded">
                  <input
                    type={showPassword.eye2 ? "text" : "password"}
                    className="form-control border-0"
                    placeholder="請輸入密碼"
                    {...register("again_password", {
                      required: "密碼為必填",
                      validate: (value) =>
                        value === getValues("password") || "兩次密碼不一致",
                    })}
                  />
                  <button
                    type="button"
                    className="btn py-0"
                    onClick={() => toggleEye("eye2")}
                  >
                    <Icon
                      icon={
                        showPassword.eye2
                          ? "heroicons-solid:eye"
                          : "majesticons:eye-off"
                      }
                      width="24px"
                    />
                  </button>
                </div>
                {errors.again_password && (
                  <span className="text-danger">
                    {errors.again_password.message}
                  </span>
                )}
              </div>
            </div>

            {/* 性別 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 性別：</label>
              </div>
              <div className="col-md-7">
                <label className="me-4">
                  <input type="radio" value="male" {...register("gender")} /> 男
                </label>
                <label>
                  <input type="radio" value="female" {...register("gender")} />{" "}
                  女
                </label>
              </div>
            </div>

            {/* 手機 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 行動電話：</label>
              </div>
              <div className="col-md-7">
                <input
                  className="form-control"
                  placeholder="請輸入手機號碼"
                  {...register("phone", { required: "手機為必填" })}
                />
                {errors.phone && (
                  <span className="text-danger">{errors.phone.message}</span>
                )}
              </div>
            </div>

            {/* 地址 */}
            <div className="row mb-4 align-items-center">
              <div className="col-md-2">
                <label className="fw-bold">* 地址：</label>
              </div>
              <div className="col-md-10 d-flex gap-2 address-group">
                <select
                  className="form-select"
                  style={{ maxWidth: "140px" }}
                  {...register("city")}
                  onChange={(e) => {
                    setValue("city", e.target.value);
                    setValue("area", "");
                  }}
                >
                  <option value="">選城市</option>
                  {Object.keys(cityAreaMap).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  style={{ maxWidth: "140px" }}
                  {...register("area")}
                  disabled={!selectedCity}
                >
                  <option value="">選地區</option>
                  {(cityAreaMap[selectedCity] || []).map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>

                <input
                  className="form-control"
                  placeholder="請輸入詳細地址"
                  {...register("address")}
                />
              </div>
            </div>

            {/* 送出 */}
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary px-5">
                送出資料
              </button>
            </div>
          </form>

          {showSuccess && (
            <div className="success-wrapper">
              <div className="success-box">
                註冊成功 !! 將返回登入畫面重新登入
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
