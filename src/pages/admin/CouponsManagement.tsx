import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { PulseLoader } from "react-spinners";
import { BarLoader } from "react-spinners";
import { PacmanLoader } from "react-spinners";
import { BeatLoader } from "react-spinners";
import { format } from "date-fns";

const baseUrl = import.meta.env.VITE_API_URL;
const api_path = import.meta.env.VITE_API_PATH;

type couponForm = {
  title: string;
  code: string;
  percent: number;
  due_date: number;
  is_enabled: number;
  id?: string;
}
const emptyCoupon = {
  title: "",
  code: "",
  percent: 0,
  due_date: 0,
  is_enabled: 0,
  id: "",
}

export default function CouponsManagement() {

  const {register, handleSubmit, formState, reset} = useForm<couponForm>();
  const {errors} = formState;
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<couponForm>(emptyCoupon)
  const now = new Date().toISOString().slice(0,16);

  const getCoupons = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${api_path}/admin/coupons`);
      setCoupons(res.data.coupons);
    } catch (error: any) {
      console.warn(error.response);
    }
  }
  const addCoupon = async (data: any) =>{
    const newData = {
      ...data,
      percent: Number(data.percent),
      is_enabled: (data.is_enabled ? 1 : 0),
      due_date: Math.floor(new Date(data.due_date).getTime() / 1000),
    }
    setAdding(true);
    console.log(newData);
    try {
      await axios.post(`${baseUrl}/v2/api/${api_path}/admin/coupon`,{data: newData});
      await getCoupons();
      reset();
      setAdding(false);
      setIsAdded(false);
    } catch (errors: any) {
      console.warn(errors.response);
    } finally {
      setAdding(false);
    }
  }
  const toEnable = async (coupon: any) => {
    const newCoupon = {
      ...coupon,
      is_enabled: coupon.is_enabled ? 0 : 1,
    }
    try {
      await axios.put(`${baseUrl}/v2/api/${api_path}/admin/coupon/${coupon.id}`, {data: newCoupon});
      await getCoupons();
    } catch (error: any) {
      console.log(error.response);
    } finally {
      setLoadingId(null);
    }
  }
  const deleteCoupon = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/v2/api/${api_path}/admin/coupon/${id}`);
      await getCoupons();
    } catch (error: any) {
      console.warn(error.response);
    } finally {
      setDeleteId(null);
    }
  }
  const editCoupon = async (coupon: any) => {
    try {
      await axios.put(`${baseUrl}/v2/api/${api_path}/admin/coupon/${coupon.id}`, {data: coupon});
      await getCoupons();
    } catch (error: any) {
      console.warn(error.response);
    } finally {
      setEditItem(emptyCoupon);
      setEditingId(null);
    }
  }

  useEffect(() => {
    getCoupons();
  },[])

  return (
    <div className="container coupon bg-white rounded-3 p-4">
      <div className="d-flex"></div>
      <form onSubmit={handleSubmit(addCoupon)}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>序</th>
              <th>優惠碼</th>
              <th>優惠券標題</th>
              <th style={{width: "120px"}}>折扣</th>
              <th>啟用</th>
              <th style={{width: "50px"}}>到期日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {
              // 編輯優惠券
              coupons.map((coupon: any, index: number) => {
                return ( (editItem?.id === coupon.id)?
                  <tr key={coupon.id}>
                    <td>{index+1}</td>
                    <td>
                      <input type="text" className="form-control" value={editItem?.code}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setEditItem({...editItem, code: newCode});
                        }}
                      />
                    </td>
                    <td>
                      <input type="text" className="form-control" value={editItem?.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setEditItem({...editItem, title: newTitle});
                        }}
                      />
                    </td>
                    <td>
                      <input type="number" className="form-control" value={editItem?.percent} min={0}
                        onChange={(e) => {
                          const newPercent = Number(e.target.value);
                          setEditItem({...editItem, percent: newPercent});
                        }}
                      />
                    </td>
                    <td>
                      <div className="form-check form-switch">
                        <input type="checkbox" className="form-check-input"
                        checked={editItem?.is_enabled ? true : false}
                          onChange={(e) => {
                            setEditItem({...editItem, is_enabled: (e.target.checked? 1 : 0 )});
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <input type="datetime-local" className="form-control" 
                        value={format(new Date(editItem.due_date * 1000), "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => {
                          const newDueDate = Math.floor(new Date(e.target.value).getTime() / 1000);
                          setEditItem({...editItem, due_date: newDueDate});
                        }}
                      />
                    </td>
                    <td>
                      {
                        (editingId === coupon.id)?
                        <BeatLoader color="#815631" />
                        :
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-success" type="button"
                            onClick={() => {
                              setEditingId(coupon.id);
                              editCoupon(editItem);
                            }}
                          >確定</button>
                          <button className="btn btn-sm btn-outline-secondary" type="button"
                            onClick={() =>{
                              setEditItem(emptyCoupon);
                            }}
                          >取消</button>
                        </div>
                      }
                    </td>
                  </tr>
                :
                // 顯示優惠券
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.title}</td>
                    <td>{coupon.percent}%</td>
                    <td>
                      {
                        (loadingId === coupon.id) ? <PulseLoader size={9.5} color="#815631" /> :
                        <div className="form-check form-switch">
                          <input type="checkbox" className="form-check-input" id={`isEnabled${index}`} 
                          checked={coupon.is_enabled ? true : false}
                            onChange={() => {
                              setLoadingId(String(coupon.id));
                              toEnable(coupon);
                            }}
                          />
                        </div>
                      }
                    </td>
                    <td>{(new Date(coupon.due_date*1000)).toLocaleString("zh-TW",
                      {hour12: false, year: "2-digit", month: "2-digit", day: "2-digit", 
                      hour: "2-digit", minute: "2-digit"})}</td>
                    <td>
                      {
                        (deleteId === coupon.id)?
                        <PacmanLoader color="red" size={15} speedMultiplier={2} />
                        :
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" type="button"
                            onClick={() => {
                              setEditItem({...coupon});
                            }}
                          >編輯</button>
                          <button className="btn btn-sm btn-outline-danger" type="button"
                            onClick={() => {
                              setDeleteId(String(coupon.id));
                              deleteCoupon(coupon.id);
                            }}
                          >刪除</button>
                        </div>
                      }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
          <tfoot>
            {
              isAdded ?
              <>
                {adding ?
                <tr>
                  <td colSpan={7} className="text-center">
                    <div className="d-inline-block w-100">
                      <BarLoader width="100%" />
                    </div>
                  </td>
                </tr>
                :
                <tr>
                  <td></td>
                  <td>
                    <input type="text" className="form-control" placeholder="請輸入優惠代碼"
                      {...register("code", {
                        required: "請輸入優惠券代碼",
                      })}
                    />
                    {errors.code && (<p className="text-danger text-sm">{errors.code.message}</p>) }
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="請輸入優惠標題"
                      {...register("title", {
                        required: "請輸入優惠券標題",
                      })}
                    />
                    {errors.title && (<p className="text-danger text-sm">{errors.title.message}</p>)}
                  </td>
                  <td>
                    <input type="number" className="form-control" placeholder="例：8折請輸入20" min={0}
                      {...register("percent", {
                        required: "請輸入折扣數",
                      })}
                    />
                    {errors.percent && (<p className="text-danger text-sm">{errors.percent.message}</p>)}
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input type="checkbox" className="form-check-input"
                        {...register("is_enabled")}
                      />
                    </div>
                  </td>
                  <td>
                    <input type="datetime-local" className="form-control" min={now}
                      {...register("due_date", {
                        required: "請選擇到期日",
                      })}
                    />
                    {errors.due_date && (<p className="text-danger text-sm">{errors.due_date.message}</p>)}
                  </td>
                  <td></td>
                </tr>
                }
                <tr className="text-center">
                  <td colSpan={7}>
                    <button className="btn btn-secondary"
                      onClick={() => {
                        reset();
                        setIsAdded(false);
                      }}
                    >取消</button>
                    <button className="btn btn-primary ms-2" type="submit">確認</button>
                  </td>
                </tr>
              </>
              :
              <tr className="text-center">
                <td colSpan={7}>
                  <button className="btn btn-primary" type="button"
                    onClick={() => {
                      setIsAdded(true);
                    }}
                  >新增優惠券</button>
                </td>
              </tr>
            }
          </tfoot>
        </table>
      </form>
    </div>
  )
}