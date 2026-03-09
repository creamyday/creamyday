/* 購物車 start */
export interface Product {//購物車store產品細項
  id: string ;
  title: string ;
  product_id: string | number;
  qty: number;
  total: number;
  product: {
    unit: string;
    category: string;
    title: string;
    imageUrl: string;
    price: number;
    stock: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface CartProps {//購物車store
  isShow: boolean;
  isAdd: boolean;
  products: Product[];
  keyword: string[];
  final_total: number;
  total: number;
  coupon: number;
}

export interface AddonProducts {// 加購商品
  id: string;
  name: string;
  price: number;
  img: string;
  isSelect: boolean;
  qty: number;
};

export interface TempLove extends Product {// 猜你喜歡
  [key: string]: unknown;
  isSelect: boolean;
};

export interface LoveProducts {// 猜你喜歡
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  category: string;
  isSelect: boolean;
};

/* 購物車 end */


/* 結帳流程 start */
export interface FormOrder {//填寫資料
  isPropsUserData: boolean;
  isPropsAddressData: boolean;
  name: string;
  tel: string;
  email: string;
  address: string;
  address_option1: string;
  address_option2: string;
  address_option3: string;
  message: string;
  deliveryMethod: number;
  storeMethod: number;
  paymentMethod: number;
  creditNumber: string;
  creditSafeCode: string;
  creditExpired: string;
  isLinePay: boolean;
  ATM: string;
  billMethod: number;
  bill: '';
}


export interface AreaList {// 縣市>區域選項
  AreaName: string;
}

export interface AddressOptions {// 縣市選項
  AreaList: AreaList[];
  CityName: string;
}

export interface DeliveryOptions {// 配送方式
  id: number;
  value: string;
  keys: string[];
}

export interface PaymentOptions {// 付款方式
  id: number;
  value: string;
  keys: string[];
}

export interface StoreOptions {// 門市方式
  id: number;
  value: string;
  keys: string[];
}

export interface BillOptions {// 發票方式
  id: number;
  value: string;
  keys:string[];
}

export interface User {
  name: string;
  email: string;
  tel: string;
  address: string;
}

export interface CheckData {
  user: User;
  message: string;
  deliveryMethod: number;
  storeMethod: number;
  paymentMethod: number;
  address: string;
  creditNumber: string;
  creditSafeCode: string;
  creditExpired: string;
  isLinePay: boolean;
  ATM: string;
  billMethod: number;
  bill: string;
  deliveryOptions: DeliveryOptions[];
  paymentOptions: PaymentOptions[];
  storeOptions: StoreOptions[];
  billOptions: BillOptions[];
}

export interface CheckProps {
  data: CheckData;
}

export interface OrderInfo {
  name?: string;
  tel?: string;
  email?: string;
  address?: string;
  message?: string;
  billMethod?: string;
  bill?: string;
  deliveryMethod?: string;
  delivery?: string;
  paymentMethod?: string;
  payment?: string;
}

export interface LocationState {
  id: string;
  success: boolean;
  request: CheckData;
}

/* 結帳流程 end */