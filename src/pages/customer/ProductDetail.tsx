import { useParams } from "react-router";

export default function ProductDetail() {
  const { category, productId } = useParams();

  return (
    <main className="container py-4">
      <h2>商品詳情頁</h2>
      <p>category: {category}</p>
      <p>id: {productId}</p>
    </main>
  );
}
