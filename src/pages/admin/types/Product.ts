export type Option = {
  optionId: string,
  name: string,
  price: number,
  origin_price: number,
  freebie_note: string,
  stock: number,
}
export type Content = {
  key: string,
  title: string,
  text: string,
}

export type Order = {
  products: Record<string, ProductOfOrder>,
  create_at: number,
  id: string,
  is_paid: boolean,
  message: string,
  total: number,
  user: {
    name: string,
    tel: string,
    address: string
  }
}

export type ProductOfOrder = {
  coupon: string,
  final_total: number,
  id: string,
  product: Product,
  product_id: string,
  qty: number,
  total: number,
}

export type Product = {
  category: string,
  title: string,
  id: string,
  groupKey: string,
  price: number,
  origin_price: number,
  imageUrl: string,
  imagesUrl: string[],
  isNew: boolean,
  is_enabled: boolean,
  isPopular: boolean,
  description: string,
  content: Content[],
  options: Option[],
  stock: number,
  freebie_note: "",
  unit: string,
}