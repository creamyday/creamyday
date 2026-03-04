import axios from "axios";
import { useEffect, useRef } from "react";
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
  imagesUrl: string[];
  unit: string;
  origin_price: number;
  price: number;
  stock: number;
  options: Option[];
};

const emptyContents: Content[] = [
  { key: "intro", title: "商品介紹", text: "" },
  { key: "spec", title: "商品規格", text: "規格：\n成分：\n適合人數：" },
  { key: "storage", title: "保存方式與賞味期限", text: "保存方式：\n食用方式：\n賞味期限：" },
  { key: "shipping", title: "配送方式與訂購須知", text: "配送方式\n冷藏宅配\n門市自取（請於備註填寫取貨日期）\n\n付款方式\n信用卡 / Line Pay / Apple Pay\nATM 轉帳\n\n訂購須知\n每日手作，依訂單製作\n下單後 2–3 天出貨\n生鮮食品不接受退換貨（除商品瑕疵）" },
];

const emptyForm: ProductForm = {
  is_enabled: false,
  isPopular: false,
  isNew: false,
  groupKey: "",
  title: "",
  description: "",
  content: [ ...emptyContents ],
  category: "",
  imageUrl: "",
  imagesUrl: [""],
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


export default function ManageModal({modalStateIsNew, product, groupKey, getProducts, loading, setLoading, manageModalRef, manageModalInstance}: any) {


  const { register, handleSubmit, control, reset, formState, watch, setValue } = useForm<ProductForm>({
    defaultValues: emptyForm,
  });
  const { errors, isDirty } = formState;
  const imageUrlValue = watch("imageUrl");
  const imagesUrlValue = watch("imagesUrl");
  const originalIds = useRef<string[]>([]); // 儲存原本的 optionId 用於編輯時辨識哪些是原本就有的規格
  const { fields: optionFields, append: optionAppend, remove: optionRemove } = useFieldArray({
    control,
    name: "options",
  });

  // 取得特定 groupKey 的商品資料（用於新增後重新整理該組資料）
  const getSortData: any = async (sortId: string) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/products/all`);
      return Object.values(res.data.products).filter((p: any) => p.groupKey === sortId);
    } catch (error: any) {
      console.warn("錯誤：", error.response);
    };
  };

  // 新增商品 API 請求
  const addSubmit = async (data: object) => {
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${api_path}/admin/product`, {data: data});
      return res.data;
    } catch (error: any) {
      console.warn(error.response);
    }
  };

  // 同步options
  const optionsSync = async (data: any) => {
    // 重新取得該 groupKey 的商品資料，更新畫面
    const groupData = await getSortData(groupKey);
    if (!Array.isArray(groupData)) return;
    // 將所有相同groupKey的商品的id、unit、origin_price、price、stock、freebie_note組成新的options陣列
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
    // 將上面組成的options陣列送出編輯商品的 API 請求，更新該組資料的options
    await Promise.all(groupData.map((p: any) =>
        axios.put(
          `${baseUrl}/v2/api/${api_path}/admin/product/${p.id}`,
          {
            data: {
              ...data,
              unit: p.unit,
              price: p.price,
              origin_price: p.origin_price,
              stock: p.stock,
              freebie_note: p.freebie_note ?? "",
              options: groupOptions
            }
          }
        )
      )
    );
  }

  const toSubmit = async (data: any) => {
    setLoading(true);
    data.groupKey = groupKey;
    if(modalStateIsNew) {
      // 送出新增商品的 API 請求
      await Promise.all(data.options.map((o: any) => {
        const tempOption = {
          ...data,
          unit: o.name,
          origin_price: o.origin_price,
          price: o.price,
          stock: o.stock,
          freebie_note: o.freebie_note,
          content: data.content
        }
        return addSubmit(tempOption);
      }));
      await optionsSync(data);
      await getProducts();
      manageModalInstance.current.hide();
      setLoading(false);
    } else {
      const existingOptions = data.options.filter((o: any) => o.optionId); // 有 id 的都是既有規格
      await Promise.all(
        existingOptions.map((o: any) =>
          axios.put(`${baseUrl}/v2/api/${api_path}/admin/product/${o.optionId}`, {
            data: {
              ...data,
              unit: o.name,
              origin_price: o.origin_price,
              price: o.price,
              stock: o.stock,
              freebie_note: o.freebie_note ?? "",
            },
          })
        )
      );
      const currentId = data.options.map((o: any) => o.optionId).filter(Boolean) as string[];
      const optionIdsToBeDeleted = originalIds.current.filter((id: string) => !currentId.includes(id));
      const optionsToBeAdded = data.options.filter((o: any) => o.optionId === "");
      if(data.options.filter((o: any) => !originalIds.current.includes(o.optionId)).length === 0 &&
        optionIdsToBeDeleted.length === 0
      ) {
        // 若資料規格無新增也無刪除，僅編輯欄位資訊
        const groupOptions = data.options.map((p: any) => (
          {
            optionId: p.optionId,
            name: p.name,
            origin_price: p.origin_price,
            price: p.price,
            stock: p.stock,
            freebie_note: p.freebie_note ?? "",
          }
        ));
        await Promise.all(data.options.map((o: any) => {
          return axios.put(`${baseUrl}/v2/api/${api_path}/admin/product/${o.optionId}`, {
            data: {
              ...data,
              unit: o.name,
              origin_price: o.origin_price,
              price: o.price,
              stock: o.stock,
              freebie_note: o.freebie_note ?? "",
              content: data.content,
              options: groupOptions
            }
          })
        }))
      } else {
        if(optionsToBeAdded.length !== 0) {
          await Promise.all(optionsToBeAdded.map((o: any) => {
            const newData = {
              ...data,
              unit: o.name,
              origin_price: o.origin_price,
              price: o.price,
              stock: o.stock,
              freebie_note: o.freebie_note,
            }
            return addSubmit(newData);
          }))
        }
        if(optionIdsToBeDeleted.length !== 0) {
          await Promise.all(optionIdsToBeDeleted.map((id: string) => {
            return axios.delete(`${baseUrl}/v2/api/${api_path}/admin/product/${id}`);
          }))
        }
        await optionsSync(data);
      }
      await getProducts();
      manageModalInstance.current.hide();
      setLoading(false);
    }
  };

  useEffect(() => {
    if(modalStateIsNew) reset(emptyForm)
    else {
      originalIds.current = product.options.map((o: any) => o.optionId).filter(Boolean);
      reset({
        groupKey: product.groupKey ?? "",
        is_enabled: product.is_enabled ?? false,
        isPopular: product.isPopular ?? false,
        isNew: product.isNew ?? false,
        title: product.title ?? "",
        category: product.category ?? "",
        imageUrl: product.imageUrl ?? "",
        imagesUrl: product.imagesUrl ?? [""],
        description: product.description ?? "",
        content: product.content?.length ? product.content : emptyForm.content,
        unit: product.unit,
        origin_price: Number(product.origin_price ?? 0),
        price: Number(product.price ?? 0),
        stock: Number(product.stock ?? 10),
        options: ( product.options?.length ? product.options : emptyForm.options ).map( (o: Option) => ({
          optionId: o?.optionId ?? "",
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
      <div className="modal fade manageModal" ref={manageModalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-fullscreen-md-down">
          <form onSubmit={handleSubmit(toSubmit)}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  商品管理表單－
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
                <div className="row g-3">
                  {/* 圖片輸入區↓ */}
                  <div className="image col-md-6 rounded-3">
                    <div className="card px-3 py-1">
                        <h6 className="h6 my-3">圖片</h6>
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
                        <div className="preview rounded-1 d-flex justify-content-center align-items-center">
                          {
                            imageUrlValue 
                            ? (<img src={imageUrlValue} alt="主要圖片" className="img-fluid w-100 h-100" style={{objectFit: "contain"}} />) 
                            : (<div className="text-muted">圖片預覽</div>)
                          }
                        </div>
                        {errors.imageUrl && (
                          <div className="text-danger small mt-1">{errors.imageUrl.message}</div>
                        )}
                      <div className="subImages mt-3">
                        {
                          imagesUrlValue.map((image: string, index: number) => {
                            return (
                              <div key={index}>
                                <div>
                                  <label className="text-muted" htmlFor="subImage">副圖片網址</label>
                                  <div className="d-flex gap-2">
                                    <input type="url" className="form-control my-2" id="subImage" placeholder="請輸入副圖片網址https://...."
                                      {...register(`imagesUrl.${index}`, {
                                        required: "請輸入副圖片網址",
                                        pattern: {
                                          value: /^https?:\/\/.+/,
                                          message: "請輸入正確的網址(需包含 http 或 https)"
                                        }
                                      })}
                                    />
                                    <button className="btn btn-sm btn-outline-danger flex-shrink-0 text-nowrap my-2" type="button"
                                      onClick={() => {
                                        const newImages = [...imagesUrlValue];
                                        newImages.splice(index, 1);
                                        setValue("imagesUrl", newImages, { shouldDirty: true });
                                      }}
                                    >
                                      刪除
                                    </button>
                                  </div>
                                </div>
                                <div className="preview d-flex justify-content-center align-items-center rounded-1">
                                  {
                                    image !== "" ? 
                                    (<img src={image} alt="副圖片預覽" className="img-fluid w-100 h-100" style={{objectFit: "contain"}} />) :
                                    (<div className="text-muted">圖片預覽</div>)
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                        <button className="btn btn-sm btn-outline-primary form-control" type="button"
                          onClick={() => {
                            setValue("imagesUrl", [...imagesUrlValue, ""], { shouldDirty: true });
                          }}
                        >新增副圖</button>
                      </div>
                    </div>
                  </div>
                  {/* 圖片輸入區↑ */}
                  {/* 基本資料區↓ */}
                  <div className="basicInfo col-md-6 rounded-3">
                    <div className="card px-3 py-1" style={{height: "100%"}}>
                      <h6 className="h6 my-3">基本資料</h6>
                      <div className="row g-2">
                        <div className="block col-6">
                          <label htmlFor="category" className="mb-2 text-muted">分類 Category</label>
                          <select className="form-select rounded-3" id="category" defaultValue={"disabled"}
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
                          {errors.category && (
                            <div className="text-danger small mt-1">{errors.category.message}</div>
                          )}
                        </div>
                        <div className="block col-6">
                          <label htmlFor="title" className="mb-2 text-muted">標題 Title</label>
                            <div className="flex-grow-1">
                              <input id="title" type="text" className="form-control rounded-3" placeholder="品名" 
                                {...register("title", {
                                  required: "請輸入產品標題",
                                })}
                              />
                            </div>
                            {errors.title && (
                              <div className="text-danger small mt-1">{errors.title.message}</div>
                            )}
                        </div>
                        <div className="block col-12">
                          <label className="label text-muted my-2">狀態</label>
                          <div className="row row-cols-3 g-2">
                            <div className="col">
                              <div className="form-check form-switch">
                                <input type="checkbox" className="form-check-input" id="isNew"
                                  {...register("isNew")}
                                />
                                <label htmlFor="isNew" className="form-check-label">新品</label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-switch">
                                <input type="checkbox" className="form-check-input" id="isPopular"
                                  {...register("isPopular")}
                                />
                                <label htmlFor="isPopular" className="form-check-label">熱銷</label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-check form-switch">
                                <input type="checkbox" className="form-check-input" id="is_enabled"
                                  {...register("is_enabled")}
                                />
                                <label htmlFor="is_enabled" className="form-check-label">上架</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* 商品描述區↓ */}
                        <div className="block col-12">
                          <div className="form-floating mt-3">
                            <textarea className="form-control" style={{height:"100px"}} placeholder="商品描述" id="description"
                            {...register("description",{
                              required: "商品描述為必填",
                            })}
                            ></textarea>
                            <label htmlFor="description">商品描述</label>
                          </div>
                        </div>
                        {/* 商品描述區↑ */}
                      </div>
                    </div>
                  </div>
                  {/* 基本資料區↑ */}
                  {/* 商品內容區↓ */}
                  <div className="content col-12 rounded-3">
                    <div className="card px-3 py-1">
                      <h6 className="h6 my-3">商品內容</h6>
                      <div className="row row-cols-md-2 g-3">
                        <div className="col form-floating">
                          <textarea className="form-control" style={{height:"200px"}} placeholder="商品介紹" id="contentIntro"
                          {...register("content.0.text",{
                            required: "商品介紹為必填",
                          })}
                          ></textarea>
                          <label htmlFor="contentIntro">商品介紹</label>
                        </div>
                        <div className="col form-floating">
                          <textarea className="form-control" style={{height:"200px"}} placeholder="商品規格" id="contentSpec"
                          {...register("content.1.text",{
                            required: "商品規格為必填",
                          })}
                          ></textarea>
                          <label htmlFor="contentSpec">商品規格</label>
                        </div>
                        <div className="col form-floating">
                          <textarea className="form-control" style={{height:"200px"}} placeholder="保存方式與賞味期限" id="contentStorage"
                          {...register("content.2.text",{
                            required: "保存方式與賞味期限為必填",
                          })}
                          ></textarea>
                          <label htmlFor="contentStorage">保存方式與賞味期限</label>
                        </div>
                        <div className="col form-floating">
                          <textarea className="form-control" style={{height:"200px"}} placeholder="配送方式與訂購須知" id="contentShipping"
                          {...register("content.3.text",{
                            required: "配送方式與訂購須知為必填",
                          })}
                          ></textarea>
                          <label htmlFor="contentShipping">配送方式與訂購須知</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 商品內容區↑ */}
                  {/* 商品規格區↓ */}
                  <div className="options col-12 rounded-3">
                    <div className="card px-3 py-1">
                      <h6 className="h6 my-3">商品規格</h6>
                      <div className="row row-cols-2 row-cols-md-4 g-3">
                        {
                          optionFields.map((field, i) => {
                            return (
                              <div className="col option" key={field.id}>
                                <div className="card">
                                  <div className="card-title px-2 py-1 bg-primary text-white d-flex justify-content-between align-items-center">
                                    <p className="p m-1">規格{i+1}</p>
                                    {
                                      optionFields.length > 1 && (
                                        <button type="button" className="btn btn-sm btn-outline-danger"
                                          onClick={() => {
                                            optionRemove(i);
                                          }}
                                        >刪除規格</button>
                                      )
                                    }
                                  </div>
                                  <div className="card-body m-0 p-2 row g-2">
                                    <div className="col-6">
                                      <div className="form-floating">
                                        <input type="text" id={`optionName-${field.id}`} className="form-control" placeholder="規格" 
                                        {...register(`options.${i}.name`,{
                                          required: "規格名稱必填"
                                        })}
                                        />
                                        <label htmlFor={`optionName-${field.id}`} >規格</label>
                                      </div>
                                      {errors.options && errors.options[i] && errors.options[i].name && (
                                        <div className="text-danger small mt-1">{errors.options[i].name.message}</div>
                                      )}
                                    </div>
                                    <div className="col-6">
                                      <div className="form-floating">
                                        <input type="number" id={`optionStock-${field.id}`} className="form-control" placeholder="庫存量" 
                                        {...register(`options.${i}.stock`,{
                                          valueAsNumber: true,
                                          required: "庫存量必填",
                                          min: { value: 0, message: "庫存量必須是 0 或以上的整數" },
                                          validate: (v) => Number.isInteger(v) || "庫存量必須是整數",
                                        })}
                                        />
                                        <label htmlFor={`optionStock-${field.id}`} >-庫存量-</label>
                                      </div>
                                      {errors.options && errors.options[i] && errors.options[i].stock && (
                                        <div className="text-danger small mt-1">{errors.options[i].stock.message}</div>
                                      )}
                                    </div>
                                    <div className="form-floating col-12 col-sm-6">
                                      <input type="number" className="form-control" id={`optionOriginPrice-${field.id}`} placeholder="原價"
                                      {...register(`options.${i}.origin_price`,{
                                        valueAsNumber: true,
                                        required: "必填",
                                        min: { value: 1, message: "原價必須大於 0" },
                                        validate: (v) => Number.isInteger(v) || "原價必須是整數",
                                      })}
                                      />
                                      <label htmlFor={`optionOriginPrice-${field.id}`}>－原價－</label>
                                    </div>
                                    {errors.options && errors.options[i] && errors.options[i].origin_price && (
                                      <div className="text-danger small mt-1">{errors.options[i].origin_price.message}</div>
                                    )}
                                    <div className="form-floating col-12 col-sm-6">
                                      <input type="number" className="form-control" id={`optionPrice-${field.id}`} placeholder="售價" 
                                      {...register(`options.${i}.price`,{
                                        valueAsNumber: true,
                                        required: "必填",
                                        min: { value: 1, message: "售價必須大於 0" },
                                        validate: (v) => Number.isInteger(v) || "售價必須是整數",
                                      })}
                                      />
                                      <label htmlFor={`optionPrice-${field.id}`}>－售價－</label>
                                    </div>
                                    {errors.options && errors.options[i] && errors.options[i].price && (
                                      <div className="text-danger small mt-1">{errors.options[i].price.message}</div>
                                    )}
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
                              </div>
                            )
                          })
                        }
                        {
                          optionFields.length <= 3 && (
                            <div className="card col-6">
                              <div className="card-body d-flex justify-content-center align-items-center">
                                <button type="button" className="btn btn-lg btn-primary"
                                  onClick={() => {
                                    optionAppend(emptyOption);
                                  }}
                                  ><i className="bi bi-plus-circle"></i> 新增規格</button>
                              </div>
                            </div>
                          ) 
                        }
                      </div>
                    </div>
                  </div>
                  {/* 商品規格區↑ */}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={() => {
                    manageModalInstance.current.hide();
                  }}
                >取消</button>
                <button type="submit" className="btn btn-primary"
                  disabled={!isDirty || loading}>
                  { loading ? <BeatLoader size={8} color="#fff" /> : "送出"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}