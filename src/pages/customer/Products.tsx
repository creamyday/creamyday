import { useState } from "react";
import { NavLink, useParams } from "react-router";

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

const products: Product[] = [
  {
    title: "草莓奶油蛋糕",
    category: "其他甜點",
    origin_price: 180,
    price: 160,
    unit: "切片",
    options: [
      {
        name: "切片",
        origin_price: 180,
        price: 160,
        stock: 10,
        freebie_note: "附叉子 1 支",
      },
      {
        name: "4吋",
        origin_price: 720,
        price: 680,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
      {
        name: "8吋",
        origin_price: 1280,
        price: 1200,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
    ],
    description:
      "柔軟蛋糕體搭配清爽鮮奶油與新鮮草莓，酸甜平衡、經典耐吃。\n奶油輕盈不膩，是春季最受歡迎的草莓甜點。",
    content: [
      {
        key: "intro",
        title: "商品介紹",
        text: "以鬆軟細緻的蛋糕體為基底，搭配清爽不膩的鮮奶油，夾入新鮮草莓，帶出自然果香與微酸甜感。\n奶油口感輕盈，不搶走草莓本身的風味，整體甜度適中、層次乾淨。\n是一款大人小孩都會喜歡的經典草莓奶油蛋糕。",
      },
      {
        key: "spec",
        title: "商品規格",
        text: "規格：切片 / 4 吋 / 8 吋\n成分：雞蛋、鮮奶油、砂糖、低筋麵粉、新鮮草莓\n適合人數：切片 1 人 / 4 吋 2–4 人 / 8 吋 6–8 人",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text: "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n訂購須知\n每日手作，依訂單製作\n下單後 2–3 天出貨\n生鮮食品不接受退換貨（除商品瑕疵）\n草莓為生鮮水果，顏色與大小依季節略有差異",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text: "保存方式：冷藏保存\n食用方式：食用前回溫 10 分鐘風味最佳\n賞味期限：冷藏 2 日內最佳\n不建議冷凍（會影響奶油與草莓口感）",
      },
    ],
    is_enabled: true,
    isPopular: true,
    isNew: true,
    imageUrl:
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444056/seasonalStrawberryCreamCake-3_d9hxxp.png",
    imagesUrl: [
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444054/seasonalStrawberryCreamCake-main_sxycnz.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444053/seasonalStrawberryCreamCake-1_tqe7vj.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444053/seasonalStrawberryCreamCake-1_tqe7vj.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444053/seasonalStrawberryCreamCake-1_tqe7vj.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444034/seasonalStrawberryCreamCake-2_goeqnx.png",
    ],
  },
  {
    title: "杜拜巧克力棉花糖麻糬",
    category: "其他甜點",
    origin_price: 160,
    price: 140,
    unit: "顆",
    options: [
      {
        name: "單顆",
        origin_price: 160,
        price: 140,
        stock: 10,
        freebie_note: "",
      },
      {
        name: "3 入",
        origin_price: 480,
        price: 420,
        stock: 10,
        freebie_note: "",
      },
      {
        name: "6 入",
        origin_price: 960,
        price: 840,
        stock: 10,
        freebie_note: "附保冷袋 1 個",
      },
    ],
    description:
      "外層巧克力棉花糖麻糬Q彈牽絲，內餡包入酥脆卡達伊夫與開心果。\n外Q內脆，一口就讓人暈倒的杜拜系甜點。",
    content: [
      {
        key: "intro",
        title: "商品介紹",
        text: "靈感來自中東與韓國近期爆紅的杜拜系甜點，外層以巧克力棉花糖製成Q彈麻糬，內餡包入酥脆卡達伊夫絲與濃郁開心果醬。\n一口咬下，外層柔軟牽絲，內餡酥脆作響，形成強烈卻迷人的口感對比。\n外Q內脆，是讓人忍不住一顆接一顆的話題系甜點。",
      },
      {
        key: "spec",
        title: "商品規格",
        text: "規格：單顆 / 3 入 / 6 入\n成分：棉花糖、巧克力、無鹽奶油、卡達伊夫絲（Kadaif）、開心果醬、可可粉\n適合人數：單顆 1 人 / 3 入 2–3 人 / 6 入 4–6 人",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text: "配送方式\n冷藏配送\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n訂購須知\n每日手作，數量有限\n全程低溫配送，避免高溫環境",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text: "保存方式：冷藏保存\n口感說明：冷藏後口感更Q彈、較不牽絲，呈現不同風味層次\n賞味期限：冷藏 3 日內最佳\n食用前可稍微回溫，口感更柔軟",
      },
    ],
    is_enabled: true,
    isPopular: true,
    isNew: true,
    imageUrl:
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444052/Mochi-3_hpympk.png",
    imagesUrl: [
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444044/Mochi-main_x0ueqa.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444044/Mochi-2_sdzfdm.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444037/Mochi-5_fc7jfe.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444024/Mochi-1_hgpi9e.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444024/Mochi-4_v54xar.png",
    ],
  },
  {
    title: "開心果覆盆子生乳酪蛋糕",
    category: "其他甜點",
    origin_price: 190,
    price: 170,
    unit: "切片",
    options: [
      {
        name: "切片",
        origin_price: 190,
        price: 170,
        stock: 10,
        freebie_note: "附叉子 1 支",
      },
      {
        name: "4吋",
        origin_price: 760,
        price: 700,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
      {
        name: "8吋",
        origin_price: 1360,
        price: 1240,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
    ],
    description:
      "濃郁開心果生乳酪搭配覆盆子酸甜果香。\n 風味清新平衡，口感滑順細緻。",
    content: [
      {
        key: "intro",
        title: "商品介紹",
        text: "以濃郁開心果生乳酪為基底，搭配覆盆子果醬，呈現自然果酸與堅果香氣的平衡。\n乳酪口感滑順細緻，覆盆子的微酸讓整體風味更加清爽不膩。\n是一款兼具高級感與清新感的季節限定生乳酪蛋糕。",
      },
      {
        key: "spec",
        title: "商品規格",
        text: "規格：切片 / 4 吋 / 8 吋\n成分：奶油乳酪、鮮奶油、砂糖、開心果、覆盆子、餅乾底\n適合人數：切片 1 人 / 4 吋 2–4 人 / 8 吋 6–8 人",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text: "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text: "保存方式：冷藏保存\n賞味期限：冷藏 3 日內最佳\n不建議冷凍（會影響生乳酪口感）",
      },
    ],
    is_enabled: true,
    isPopular: true,
    isNew: true,
    imageUrl:
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444058/Pistachio_Raspberry_No-Bake_Cheesecake-3_usyylx.png",
    imagesUrl: [
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444047/Pistachio_Raspberry_No-Bake_Cheesecake-4_cqhszs.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444047/Pistachio_Raspberry_No-Bake_Cheesecake-1_io8xey.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444039/Pistachio_Raspberry_No-Bake_Cheesecake-main_qhzxrw.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769444039/Pistachio_Raspberry_No-Bake_Cheesecake-2_pjzsqq.png",
    ],
  },
  {
    title: "經典原味巴斯克乳酪蛋糕",
    category: "巴斯克",
    origin_price: 180,
    price: 160,
    unit: "切片",
    options: [
      {
        name: "切片",
        origin_price: 180,
        price: 160,
        stock: 10,
        freebie_note: "附叉子 1 支",
      },
      {
        name: "4吋",
        origin_price: 720,
        price: 680,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
      {
        name: "8吋",
        origin_price: 1280,
        price: 1200,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
    ],
    description:
      "選用高比例乳酪製作，呈現巴斯克最純粹、濃郁的乳酪香氣。\n外層微焦、內餡滑順細緻，甜度低卻耐吃。",
    content: [
      {
        key: "intro",
        title: "商品介紹",
        text: "選用高比例乳酪製作，不添加多餘風味，呈現巴斯克最純粹、濃郁的乳酪香氣。\n外層微焦帶有淡淡苦香，內餡柔軟滑順、入口即化。\n甜度低卻耐吃，是一款能細細品嚐、越吃越順口的經典巴斯克。",
      },
      {
        key: "spec",
        title: "商品規格",
        text: "規格：切片 / 4 吋 / 8 吋\n成分：乳酪、鮮奶油、雞蛋、砂糖\n適合人數：切片 1 人 / 4 吋 2–4 人 / 8 吋 6–8 人",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text: "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n訂購須知\n每日手作，下單後 2–3 天出貨\n生鮮食品不接受退換貨（除商品瑕疵）\n巴斯克蛋糕表面自然焦色屬正常現象",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text: "保存方式：冷藏保存\n食用方式：食用前回溫 10–15 分鐘風味最佳\n賞味期限：冷藏 3 日內最佳\n不建議冷凍（會影響口感與濕潤度）",
      },
    ],
    is_enabled: true,
    isPopular: true,
    isNew: false,
    imageUrl:
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443968/basqueClassic-2_puwpty.png",
    imagesUrl: [
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443968/basqueClassic-main_gqztz3.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443964/basqueClassic-3_w6n1t4.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443964/basqueClassic-4_vycdrm.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443963/basqueClassic-1_tvssez.png",
    ],
  },
  {
    title: "開心果巴斯克乳酪蛋糕",
    category: "巴斯克",
    origin_price: 220,
    price: 200,
    unit: "切片",
    options: [
      {
        name: "切片",
        origin_price: 220,
        price: 200,
        stock: 10,
        freebie_note: "附叉子 1 支",
      },
      {
        name: "4吋",
        origin_price: 880,
        price: 820,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
      {
        name: "8吋",
        origin_price: 1580,
        price: 1480,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
    ],
    description:
      "濃郁開心果堅果香融入乳酪，香氣飽滿卻不甜膩。\n口感滑順細緻，尾韻清爽耐吃。",
    content: [
      {
        key: "intro",
        title: "商品介紹",
        text: "以香氣濃郁的開心果融入乳酪基底，帶出自然堅果香與柔和奶甜。\n入口滑順細緻，開心果香氣在尾韻慢慢浮現，層次飽滿卻不厚重。\n適合喜歡堅果風味、想吃得更濃郁一點的你。",
      },
      {
        key: "spec",
        title: "商品規格",
        text: "規格：切片 / 4 吋 / 8 吋\n成分：乳酪、鮮奶油、雞蛋、砂糖、開心果\n適合人數：切片 1 人 / 4 吋 2–4 人 / 8 吋 6–8 人",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text: "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n訂購須知\n每日手作，下單後 2–3 天出貨\n生鮮食品不接受退換貨（除商品瑕疵）\n巴斯克蛋糕表面自然焦色屬正常現象",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text: "保存方式：冷藏保存\n食用方式：食用前回溫 10–15 分鐘風味最佳\n賞味期限：冷藏 3 日內最佳\n不建議冷凍（會影響口感與濕潤度）",
      },
    ],
    is_enabled: true,
    isPopular: false,
    isNew: false,
    imageUrl:
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443951/basquePistachio-4_zhaoxc.png",
    imagesUrl: [
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443950/basquePistachio-5_fqwf4f.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443949/basquePistachio-2_hkkeak.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443949/basquePistachio-main_cosdzz.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443948/basquePistachio-3_vsxkse.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443947/basquePistachio-1_ghbp44.png",
    ],
  },
  {
    title: "黑芝麻巴斯克乳酪蛋糕",
    category: "巴斯克",
    origin_price: 200,
    price: 180,
    unit: "切片",
    options: [
      {
        name: "切片",
        origin_price: 200,
        price: 180,
        stock: 10,
        freebie_note: "附叉子 1 支",
      },
      {
        name: "4吋",
        origin_price: 800,
        price: 750,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
      {
        name: "8吋",
        origin_price: 1420,
        price: 1320,
        stock: 10,
        freebie_note: "附塑膠刀 1 支、叉盤 6 組、蠟燭 1 支、保冷袋 1 個",
      },
    ],
    description:
      "濃厚黑芝麻香氣與乳酪融合，風味沈穩不苦澀。\n口感細緻滑順，是一款越吃越耐吃的大人系巴斯克。",
    content: [
      {
        key: "intro",
        title: "商品介紹",
        text: "嚴選黑芝麻低溫研磨，保留芝麻原有的香氣與厚實風味，與乳酪融合成濃郁滑順的口感。\n芝麻香氣明顯卻不苦澀，入口細緻、尾韻溫潤。\n是一款成熟、耐吃的黑芝麻系巴斯克。",
      },
      {
        key: "spec",
        title: "商品規格",
        text: "規格：切片 / 4 吋 / 8 吋\n成分：乳酪、鮮奶油、雞蛋、砂糖、黑芝麻\n適合人數：切片 1 人 / 4 吋 2–4 人 / 8 吋 6–8 人",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text: "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n訂購須知\n每日手作，下單後 2–3 天出貨\n生鮮食品不接受退換貨（除商品瑕疵）\n巴斯克蛋糕表面自然焦色屬正常現象",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text: "保存方式：冷藏保存\n食用方式：食用前回溫 10–15 分鐘風味最佳\n賞味期限：冷藏 3 日內最佳\n不建議冷凍（會影響口感與濕潤度）",
      },
    ],
    is_enabled: true,
    isPopular: false,
    isNew: false,
    imageUrl:
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443970/basqueBlackSesame-main_s4phb6.png",
    imagesUrl: [
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443967/basqueBlackSesame-1_qxprim.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443966/basqueBlackSesame-3_gc6cfa.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443965/basqueBlackSesame-2_b4jmhh.png",
      "https://res.cloudinary.com/diagvxbmg/image/upload/v1769443961/basqueBlackSesame-4_lhr7ee.png",
    ],
  },
];

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

          <div className="row product-grid">
            {filtered.map((product) => {
              const key = product.title;
              const isFav = favoriteSet.has(key);

              return (
                <div className="col-6 col-lg-4" key={key}>
                  {/* 詳情頁可改成 <NavLink to={`/products/${activeSlug}/${id}`}> */}
                  <article className="product-card">
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
                      <h5 className="product-card__title">{product.title}</h5>
                      <div className="product-card__price">
                        <span className="product-card__currency">NT$</span>
                        <span className="product-card__amount">
                          {product.price}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* 沒商品時的提示 */}
          {filtered.length === 0 && (
            <div className="py-5 text-center">
              目前沒有符合「{categoryLabel[activeSlug]}」的商品
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
