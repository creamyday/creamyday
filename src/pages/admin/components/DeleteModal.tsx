import axios from "axios";
import { BeatLoader } from "react-spinners";

const baseUrl = import.meta.env.VITE_API_URL;
const api_path = import.meta.env.VITE_API_PATH;



export default function DeleteModal({deleteModalRef, deleteModalInstance, groupKey, product, allProducts, getProducts, loading, setLoading}: any) {

  const findIdByGroupKey = (products: any[], groupKey: string) => {
    const productIds = products.filter(item => item.groupKey === groupKey).map(item => (item.id));
    return productIds;
  }

  const deleteProductsByIds = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id: string) =>  
        axios.delete(`${baseUrl}/v2/api/${api_path}/admin/product/${id}`)))
    } catch (error: any) {
      console.warn('刪除商品失敗', error.response ?? error);
    }
  }
  

  return (
    <div className="modal" tabIndex={-1} ref={deleteModalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">刪除商品組別：{groupKey}</h5>
            <button type="button" className="btn-close" aria-label="Close"
              onClick={() => deleteModalInstance.current.hide()}
            ></button>
          </div>
          <div className="modal-body">
            <p>確認是否要刪除商品組別： <strong><u>{product.title}</u></strong>？</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary"
              onClick={() => deleteModalInstance.current.hide()}
            >Close</button>
            {loading ? 
              <button type="button" className="btn btn-primary" disabled>
                <BeatLoader size={8} color="#fff" />
              </button>
              :
              <button type="button" className="btn btn-primary"
                onClick={async () => {
                  setLoading(true);
                  const ids = findIdByGroupKey(allProducts, groupKey);
                  await deleteProductsByIds(ids);
                  await getProducts();
                  setLoading(false);
                  deleteModalInstance.current.hide();
                }}
              >確認</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}