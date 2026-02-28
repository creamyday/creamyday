import axios from "axios";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

const baseUrl = import.meta.env.VITE_API_URL;
const api_path = import.meta.env.VITE_API_PATH;

type Option = {
  optionId?: string;
  name: string;
  origin_price: number;
  price: number;
  stock: number;
  freebie_note: string;
};

type Content = {
  key: string;
  title: string;
  text: string;
};

type ProductForm = {
  is_enabled: boolean;
  isPopular: boolean;
  isNew: boolean;
  groupKey: string;
  title: string;
  description: string;
  content: Content[];
  category: string;
  imageUrl: string;
  unit: string;
  origin_price: number;
  price: number;
  stock: number;
  options: Option[];
};

const emptyContent: Content = {
  key: "",
  title: "",
  text: ""
};

const emptyForm: ProductForm = {
  is_enabled: false,
  isPopular: false,
  isNew: false,
  groupKey: "",
  title: "",
  description: "",
  content: [emptyContent],
  category: "",
  imageUrl: "",
  unit: "",
  origin_price: 0,
  price: 0,
  stock: 10,
  options: [{name:"", origin_price: 0, price: 0, freebie_note: "", stock: 0}],
};

const emptyOption: Option = {
  optionId: "",
  name: "",
  origin_price: 0,
  price: 0,
  stock: 0,
  freebie_note: ""
};


export default function ManageModal({manageModalRef, manageModalInstance, modalStateIsNew, product, groupKey, getProducts, loading, setLoading}: any) {

  const getSortData: any = async (sortId: string) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/products/all`);
      return Object.values(res.data.products).filter((p: any) => p.groupKey === sortId);
    } catch (error: any) {
      console.warn("錯誤：", error.response);
    };
  };

  const addSubmit = async (data: object) => {
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${api_path}/admin/product`, {data: data});
      return res.data;
    } catch (error: any) {
      console.warn(error.response);
    }
  };

  const toSubmit = async (data: any) => {
    setLoading(true);
    data.groupKey = groupKey;
    if(modalStateIsNew) {
      // 送出新增商品的 API 請求
      await Promise.all(data.options.map((o: any) => {
        const tempOption = {
          ...data,
          unit: o.name,
          origin_price: Number(o.origin_price),
          price: Number(o.price),
          stock: Number(o.stock),
          freebie_note: o.freebie_note,
          content: data.content
        }
        return addSubmit(tempOption);
      }));

      const groupData = await getSortData(groupKey);
      const groupOptions = groupData.map((p: any) => (
        {
          optionId: p.id,
          name: p.unit,
          origin_price: p.origin_price,
          price: p.price,
          stock: p.stock,
          freebie_note: p.freebie_note ?? "",
        }
      ));
      await Promise.all(groupData.map((p: any) =>
          axios.put(
            `${baseUrl}/v2/api/${api_path}/admin/product/${p.id}`,
            {
              data: {
                ...p,
                options: groupOptions
              }
            }
          )
        )
      );
      await getProducts();
      manageModalInstance.current.hide();
      setLoading(false);
    } else {
      // 送出編輯商品的 API 請求
    }
  };

  const { register, handleSubmit, control, reset, formState, watch } = useForm<ProductForm>({
    defaultValues: emptyForm,
  });
  const { errors } = formState;
  const imageUrlValue = watch("imageUrl");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if(modalStateIsNew) reset(emptyForm)
    else {
      reset({
        groupKey: product?.groupKey ?? "",
        is_enabled: product?.is_enabled ?? false,
        isPopular: product?.isPopular ?? false,
        isNew: product?.isNew ?? false,
        title: product?.title ?? "",
        // description: product?.description ?? "",
        category: product?.category ?? "",
        imageUrl: product?.imageUrl ?? "",
        unit: product?.unit ?? "fixed",
        origin_price: Number(product?.origin_price ?? 0),
        price: Number(product?.price ?? 0),
        stock: Number(product?.stock ?? 10),
        options: ( product?.options?.length ? product.options : emptyForm.options ).map( (o: Option) => ({
          name: o?.name ?? "",
          origin_price: Number(o?.origin_price ?? 0),
          price: Number(o?.price ?? 0),
          stock: Number(o?.stock ?? 0),
          freebie_note: o?.freebie_note ?? ""
        }) )
      })
    }
  },[modalStateIsNew, product, reset]);

  return (
    <>
      <div className="modal fade" ref={manageModalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-fullscreen-md-down">
          <form onSubmit={handleSubmit(toSubmit)}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {modalStateIsNew ? "新增商品" : "編輯商品"}
                  {groupKey}
                </h5>
                <button type="button" className="btn-close" aria-label="Close"
                  onClick={() => {
                    manageModalInstance.current.hide();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-4">
                      {/* 主要圖片輸入區↓ */}
                      <div className="image"> 
                        <img src={imageUrlValue} alt="主要圖片" className="img-fluid" style={{objectFit: "cover"}} />
                        <div className="form-floating">
                          <input type="url" className="form-control my-2" id="mainPicture" placeholder="請輸入主要圖片網址" 
                            {...register("imageUrl", {
                              required: "請輸入主要圖片網址",
                              pattern: {
                                value: /^https?:\/\/.+/,
                                message: "請輸入正確的網址(需包含 http 或 https)"
                              }
                            })}
                          />
                          <label htmlFor="mainPicture">主要圖片網址</label>
                        </div>
                        {errors.imageUrl && (
                          <div className="text-danger small mt-1">{errors.imageUrl.message}</div>
                        )}
                      </div>
                      {/* 主要圖片輸入區↑ */}
                    </div>
                    <div className="col-sm-8 row g-2">
                      {/* 類別選擇區↓ */}
                      <div className="d-flex col-12 col-sm-6">
                        <label htmlFor="category" className="me-2 col-form-label text-nowrap flex-shrink-0">分類</label>
                        <div className="flex-grow-1">
                          <select className="form-select" id="category" defaultValue={"disabled"}
                            {...register("category", {
                              required: "請選擇一個類別"
                            })}
                            >
                            <option value="disabled" disabled>請選擇</option>
                            <option value="生乳捲">生乳捲</option>
                            <option value="提拉米蘇">提拉米蘇</option>
                            <option value="巴斯克">巴斯克</option>
                            <option value="其他甜點">其他甜點</option>
                          </select>
                        </div>
                        {errors.category && (
                          <div className="text-danger small mt-1">{errors.category.message}</div>
                        )}
                      </div>
                      {/* 類別選擇區↑ */}
                      {/* 標題輸入區↓ */}
                      <div className="d-flex col-12 col-sm-6">
                        <label htmlFor="title" className="me-2 col-form-label text-nowrap flex-shrink-0">標題</label>
                        <div className="flex-grow-1">
                          <input id="title" type="text" className="form-control" placeholder="品名" 
                            {...register("title", {
                              required: "請輸入產品標題",
                            })}
                          />
                        </div>
                        {errors.title && (
                            <div className="text-danger small mt-1">{errors.title.message}</div>
                        )}
                      </div>
                      {/* 標題輸入區↑ */}
                      {/* 規格輸入區↓ */}
                      {fields.map((field, i) => {
                        return (
                          <fieldset className="col-6" key={field.id}>
                            <div className="card rounded-4">
                              <div className="card-title m-0 px-2 py-1 bg-primary text-white d-flex justify-content-between align-items-center">
                                <h6 className="h6 m-1">規格{i+1}</h6>
                                <button type="button" className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    remove(i);
                                  }}
                                >刪除規格</button>
                              </div>
                              <div className="card-body m-0 p-2 row g-2">
                                <div className="col-6">
                                  <div className="form-floating">
                                    <input type="text" id={`optionName-${field.id}`} className="form-control" placeholder="規格" 
                                    {...register(`options.${i}.name`,{
                                      required: "規格必填"
                                    })}
                                    />
                                    <label htmlFor={`optionName-${field.id}`} >規格</label>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-floating">
                                    <input type="number" id={`optionStock-${field.id}`} className="form-control" placeholder="庫存量" 
                                    {...register(`options.${i}.stock`,{
                                      required: "庫存量必填",
                                      pattern: {
                                        value: /^[1-9]\d*$/,
                                        message: "庫存量必須是大於0的整數"
                                      }
                                    })}
                                    />
                                    <label htmlFor={`optionStock-${field.id}`} >-庫存量-</label>
                                  </div>
                                </div>
                                <div className="form-floating col-12 col-sm-6">
                                  <input type="number" className="form-control" id={`optionOriginPrice-${field.id}`} placeholder="原價"
                                  {...register(`options.${i}.origin_price`,{
                                    required: "必填",
                                    pattern: {
                                      value: /^[1-9]\d*$/,
                                      message: "原價必須是大於0的整數"
                                    }
                                  })}
                                  />
                                  <label htmlFor={`optionOriginPrice-${field.id}`}>－原價－</label>
                                </div>
                                <div className="form-floating col-12 col-sm-6">
                                  <input type="number" className="form-control" id={`optionPrice-${field.id}`} placeholder="售價" 
                                  {...register(`options.${i}.price`,{
                                    required: "必填",
                                    pattern: {
                                      value: /^[1-9]\d*$/,
                                      message: "售價必須是大於0的整數"
                                    }
                                  })}
                                  />
                                  <label htmlFor={`optionPrice-${field.id}`}>－售價－</label>
                                </div>
                                <div className="col-12">
                                  <div className="form-floating">
                                    <input type="text" id={`optionFreebie-${field.id}`} className="form-control" placeholder="附贈備註" 
                                    {...register(`options.${i}.freebie_note`)}
                                    />
                                    <label htmlFor={`optionFreebie-${field.id}`} >附贈備註</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        )
                      })}
                      {/* 規格輸入區↑ */}
                      <div className="card col-6">
                        <div className="card-body d-flex justify-content-center align-items-center">
                          <button type="button" className="btn btn-lg btn-primary"
                            onClick={() => {
                              append(emptyOption);
                            }}
                          ><i className="bi bi-plus-circle"></i> 新增規格</button>
                        </div>
                      </div>
                    </div>
                    {/* 商品描述區↓ */}
                    <div className="form-floating mt-3">
                      <textarea className="form-control" style={{height:"100px"}} placeholder="商品描述" id="description"
                      {...register("description",{
                        required: "商品描述為必填",
                      })}
                      ></textarea>
                      <label htmlFor="description">商品描述</label>
                    </div>
                    {/* 商品描述區↑ */}
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={() => {
                    manageModalInstance.current.hide();
                  }}
                  >取消</button>
                {loading ? 
                  <button type="button" className="btn btn-primary" disabled>
                    <BeatLoader size={8} color="#fff" />
                  </button>
                  : 
                  <button type="submit" className="btn btn-primary"
                  >送出</button>
                }
                
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}