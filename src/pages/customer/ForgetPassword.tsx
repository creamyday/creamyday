import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

interface FormForgetPassword {
  email: string,
  isEmailTo:boolean,
  password: string,
  again_password: string,
}

interface EyeStatus {
  eye1: boolean;
  eye2: boolean;
}

export default function ForgetPassword(){
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<EyeStatus>({
    eye1: false,
    eye2: false
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormForgetPassword>({
    mode: 'onTouched',
    defaultValues: {
      email: "",
      isEmailTo: false,
      password: "",
      again_password: ""
    }
  });
  const isEmailVerified = watch("isEmailTo");

  const onSubmit = () => {
    navigate('/login');
  };

  const handlerEmailTo = () => setValue("isEmailTo", true,{ shouldValidate: true });
  const toggleEye = (type: keyof EyeStatus) => {
    setShowPassword(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return(
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">忘記​密碼​了​嗎 ​?</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 input-group border rounded">
              <input
                className="form-control border-0"
                placeholder="請輸入信箱"
                {...register("email",
                  {
                    required: {
                      value: true,
                      message: 'Email 為必填'
                    }, 
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email 格式不正確'
                    }
                  }
                )}
              />
              <button type="button" className="btn btn-primary rounded m-2 text-nowrap input-btn" onClick={() => handlerEmailTo()}>{isEmailVerified ? '驗證成功' : '驗證信箱'}</button>
              <input
                type="hidden"
                {...register("isEmailTo",
                  {
                    validate: (value) => value === true || "尚未驗證信箱"
                  }
                )}
              />
            </div>
            {
              Array.from([errors.email, errors.isEmailTo])
                .filter(item => Boolean(item?.message))
                .map((error, index) => (
                  <span className="text-danger" key={index}>{index > 0 ? '、' : ''}{error?.message}</span>
                ))
            }
            <div className="mb-2 input-group border rounded">
              <input
                type={showPassword.eye1 ? "text" : "password"}
                className="form-control border-0"
                placeholder="請輸入新密碼"
                {...register("password",
                  {
                    required: {
                      value: true,
                      message: '密碼為必填'
                    }, 
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/i,
                      message: 'Email 格式不正確'
                    } 
                  }
                )}
              />
              <button type="button" className="btn py-0" onClick={() => toggleEye('eye1')}>
                <i className={`bi ${showPassword.eye1 ? 'bi-eye-fill' :'bi-eye-slash-fill'} input-icon`}></i>
              </button>
            </div>
            {errors.password && <span className="text-danger">{errors.password?.message}</span>}
            <div className="mb-2 input-group border rounded">
              <input
                type={showPassword.eye2 ? "text" : "password"}
                className="form-control border-0"
                placeholder="再次輸入新密碼"
                {...register("again_password",
                  {
                    required: {
                      value: true,
                      message: '密碼為必填'
                    }, 
                    validate: (value) => value === watch('password') || "兩次密碼不一致"
                  }
                )}
              />
              <button type="button" className="btn py-0" onClick={() => toggleEye('eye2')}>
                <i className={`bi ${showPassword.eye2 ? 'bi-eye-fill' : 'bi-eye-slash-fill'} input-icon`}></i>
              </button>
            </div>
            {errors.again_password && <span className="text-danger">{errors.again_password?.message}</span>}
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary text-center mb-2">更新密碼</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}