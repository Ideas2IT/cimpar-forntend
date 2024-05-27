import ReyaIcon from "../../assets/reya-logo.svg?react";
import { MESSAGE, PATH_NAME, PATTERN, ROLE } from "../../utils/AppConstants";
import { InputText } from "primereact/inputtext";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  selectedRole,
  setIsLoggedIn,
  setUserRole,
} from "../../store/slices/commonSlice";
import { useEffect } from "react";
import { ILogin } from "../../interfaces/UserLogin";
import { loginUserThunk } from "../../store/slices/loginSlice";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const role = useSelector(selectedRole);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: {} as ILogin });

  const handleLogin = (data: ILogin) => {
    if (
      (data.email && data.email.split("@")[0].toLowerCase() === "patient") ||
      data.email.split("@")[0].toLowerCase() === "admin"
    ) {
      dispatch(setUserRole(data.email));
    } else {
      errorToast("Login Failed", "Invalid Username or Password");
      return;
    }
    setTimeout(() => {
      dispatch(
        setIsLoggedIn({ status: true, email: data.email.toLowerCase() })
      );
      dispatch(
        loginUserThunk({ username: data.email, password: data.password })
      );
    }, 300);
  };

  const { toast, errorToast } = useToast();

  useEffect(() => {
    if (role === ROLE.ADMIN) {
      navigate(PATH_NAME.APPOINTMENTS);
    } else if (role === ROLE.PATIENT) {
      navigate(PATH_NAME.HOME);
    } else {
      errorToast("Login Failed", "Invalid Email or Password");
    }
  }, [role]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-300">
      <form onSubmit={handleSubmit((data) => handleLogin(data))}>
        <div className="rounded-xl bg-white md:w-[30rem] md:min-h-[25rem] p-6">
          <div className="flex flex-row justify-center w-full h-[3rem]">
            <ReyaIcon className="block" />
          </div>
          <div className="font-primary text-2xl py-3">Login</div>
          <div className="col-span-2 w-full my-3">
            <label className="input-label" htmlFor="email">
              Email*
            </label>
            <div className="relative h-[2.5rem] my-1">
              <Controller
                name="email"
                control={control}
                rules={{
                  pattern: PATTERN.EMAIL,
                  required: true,
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="email"
                    keyfilter="email"
                    className="signup-input"
                    placeholder="Enter Email Address"
                    aria-label="Enter Email Address"
                  />
                )}
              />
              <span className="absolute right-2 top-[0.7rem] pi pi-envelope" />
              {errors.email && <ErrorMessage message="Invalid Email Id" />}
            </div>
          </div>
          <div className="w-full py-4 relative">
            <label className="input-label" htmlFor="password">
              Password*
            </label>
            <div className="h-[2.5rem] relative">
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password can't be empty",
                  minLength: {
                    value: 8,
                    message: MESSAGE.PASSWORD_LENGTH_ERROR,
                  },
                }}
                render={({ field }) => (
                  <Password
                    {...field}
                    panelStyle={{ display: "none" }}
                    inputId="password"
                    inputClassName="signup-input h-full"
                    className="h-full w-full"
                    placeholder="Enter Password"
                    toggleMask
                  />
                )}
              />
            </div>
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
          </div>
          <Link to={PATH_NAME.FORGOT_PASSWORD}>
            <label className="text-purple-800 font-primary cursor-pointer">
              Forgot Password?
            </label>
          </Link>
          <div className="col-span-2 flex justify-between items-center pt-2">
            <label className="text-sm">
              Don't have an account?
              <Link to={PATH_NAME.SIGNUP} className="text-purple-800 ps-1">
                Signup
              </Link>
            </label>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-purple-800 text-white px-8 py-1 rounded-full font-primary"
              label="Login"
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
};
export default LoginForm;
