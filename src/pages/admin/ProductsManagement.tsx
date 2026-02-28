import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import ManageModal from "./components/ManageModal";
import DeleteModal from "./components/DeleteModal";
import { Modal } from "bootstrap";

const baseUrl = import.meta.env.VITE_API_URL;
const api_path = import.meta.env.VITE_API_PATH;

const getData = async () => {
  try {
    const res = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/products/all`);
    console.log(res);
  } catch (error: any) {
    console.warn("錯誤：", error.response)
  }
}


export default function ProductsManagement() {

  const [loading, setLoading] = useState(false);
  const [groupKey, setGroupKey] = useState<string>("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  // const [products, setProducts] = useState<any[]>([]);
  const [showData, setShowData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [hasPre, setHasPre] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [modalStateIsNew, setModalStateIsNew] = useState<boolean>(true);
  const [openCollapse, setOpenCollapse] = useState<string[]>([...Array(10)]);
  const manageModalRef: any = useRef(null);
  const manageModalInstance: any = useRef(null);
  const deleteModalRef: any = useRef(null);
  const deleteModalInstance: any = useRef(null);
  
  const [product, setProduct] = useState({
    title: "",
    category: "disabled",
    origin_price: 0,
    price: 0,
    unit: "fixed",
    description: "",
    imageUrl: "",
    imagesUrl: [''],
    is_enabled: true,
    isPopular: true,
    isNew: true,
    options: [{ size: "", originPrice: "", price: "" }],
    content: [
      {
      key: "intro",
      title: "商品介紹",
      text:
        "",
      },
      {
        key: "spec",
        title: "商品規格",
        text:
          "規格：\n" +
          "成分：\n" +
          "適合人數：",
      },
      {
        key: "shipping",
        title: "配送方式與訂購須知",
        text:
          "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n" +
          "付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n" +
          "訂購須知\n每日手作，依訂單製作\n下單後 2–3 天出貨\n生鮮食品不接受退換貨（除商品瑕疵）",
      },
      {
        key: "storage",
        title: "保存方式與賞味期限",
        text:
          "保存方式：冷藏保存\n" +
          "食用方式：食用前回溫 10 分鐘風味最佳\n" +
          "賞味期限：冷藏 2 日內最佳\n" ,
      }
    ]
  });

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/products/all`);
      console.log("getAllProducts response:", response);
      setAllProducts(Object.values(response.data.products));
    } catch (error: any) {
      console.warn('取得商品列表失敗', error.response ?? error);
    } finally {
      setLoading(false);
    }
  }

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/products?page=${page}`);
      // setProducts(res.data.products);
      setCurrentPage(res.data.pagination.current_page);
      setTotalPage(res.data.pagination.total_pages);
      setHasPre(res.data.pagination.has_pre);
      setHasNext(res.data.pagination.has_next);
      
      const newData: any[] = [];
      const seed = new Set<string>();
      res.data.products.forEach((i: any) => {
        if(!seed.has(i.groupKey)) {
          seed.add(i.groupKey);
          newData.push(i);
        }
      })
      setShowData(newData);
      setOpenCollapse([...Array(newData.length)]);
    } catch (error: any ) {
      console.warn("錯誤：", error.response)
    }
  }

  const tableExpand = (index: number, collapseId: string) => {
    setOpenCollapse(prev => prev.map((o, i)=> (i === index ? (o ? "" : collapseId) : o )))
  }

  useEffect(() => {
    manageModalInstance.current = new Modal(manageModalRef.current);
    deleteModalInstance.current = new Modal(deleteModalRef.current);
    getProducts();
  },[]);

  return (
    <>
      <div className="container productsManagement bg-white p-4 rounded-3">
        <div className="d-flex justify-content-between">
          <h5 className="h5 tableTitle">商品管理列表({showData.length})</h5>
          <button type="button" className="btn btn-primary addProductBtn"
          onClick={() => {
            setGroupKey(crypto.randomUUID());
            manageModalInstance.current.show();
            setModalStateIsNew(true);
          }}
          >新增商品</button>
        </div>
        <table className="table mt-2">
          <thead>
            <tr>
              <th scope="col">展開</th>
              <th scope="col">圖片</th>
              <th scope="col">商品名稱</th> 
              <th scope="col">分類</th>
              <th scope="col">上架狀態</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody key={currentPage}>
            {showData.map((item: any, index:number) => {
              const collapseId = `coll-${item.id}`;
              return <Fragment key={item.id}>
                <tr>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      onClick={()=>{
                        tableExpand(index, collapseId);
                      }}
                    >
                      { openCollapse[index] ? "▼" : "▶"}
                    </button>
                  </td>
                  <td>
                    <img src={item.imageUrl} alt="主要圖片" className="mainImg" />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={item.is_enabled} />
                    </div>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setModalStateIsNew(false);
                        const newItem = {...item};
                        setGroupKey(item.groupKey);
                        setProduct(newItem);
                        manageModalInstance.current.show();
                      }}
                      >編輯</button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setLoading(true);
                          getAllProducts();
                          const newItem = {...item};
                          setGroupKey(item.groupKey);
                          setProduct(newItem);
                          deleteModalInstance.current.show();
                        }}
                      >刪除</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="p-0 border-0">
                    <div id={collapseId} className={`collapse ${collapseId === openCollapse[index] ? "show" : ""}`}>
                      <div className="p-2 bg-white rounded-3">
                        <table className="table table-sm mb-0">
                          <thead>
                            <tr>
                              <th>規格</th>
                              <th>原價</th>
                              <th>售價</th>
                              <th>附贈</th>
                              <th>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            { item.options?.length ?
                              (item.options.map((option: any, i: number) => {
                                return (
                                    <tr key={`${option.id}-${i}`}>
                                      <td>{option.name}</td>
                                      <td>{option.origin_price}</td>
                                      <td>{option.price}</td>
                                      <td>{option.freebie_note}</td>
                                      <td>
                                        <button className="btn btn-sm btn-outline-danger">刪除</button>
                                      </td>
                                    </tr>
                                )
                              })) : 
                              (<tr>
                                <td colSpan={4}>沒有規格資料</td>
                              </tr>)
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className="page-item"><a className={`page-link ${hasPre? "" : "disabled"}`} href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  if(!hasPre) return
                  getProducts(currentPage - 1);
                }}
              >Previous</a></li>
              {
                [...Array(totalPage)].map((_, p) => {
                  return (
                    <li className="page-item"  key={`page-${p}`}><a className={`page-link ${currentPage === p+1 ? "active" : ""}`} href="#"
                      onClick={(e)=>{
                        e.preventDefault();
                        getProducts(p+1);
                      }}
                    >{p+1}</a></li>
                  )
                })
              }
              <li className={`page-item ${hasNext? "" : "disabled"}`}><a className="page-link" href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  if(!hasNext) return
                  getProducts(currentPage + 1);
                }}
              >Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <ManageModal manageModalRef={manageModalRef} manageModalInstance={manageModalInstance}
        modalStateIsNew={modalStateIsNew} product={product} setProduct={setProduct} groupKey={groupKey} 
        getProducts={getProducts} 
        loading={loading} setLoading={setLoading}/>
      <DeleteModal deleteModalRef={deleteModalRef} deleteModalInstance={deleteModalInstance} groupKey={groupKey}
        product={product} allProducts={allProducts} getProducts={getProducts} 
        loading={loading} setLoading={setLoading}/>
      <button type="button" className="btn btn-primary"
        onClick={() => {
          getData();
        }}
      >取回</button>
    </>
  )
}