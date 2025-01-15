import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ReyaIcon from "../../assets/reya-logo.svg?react";
import { ILogin, ILoginPayload } from "../../interfaces/UserLogin";
import { ErrorResponse } from "../../interfaces/common";
import { getUserProfileThunk } from "../../store/slices/UserSlice";
import { loginUserThunk } from "../../store/slices/loginSlice";
import { AppDispatch } from "../../store/store";
import {
  CLIENT_ID,
  GRANT_TYPE,
  MESSAGE,
  PATH_NAME,
  PATTERN,
  RESPONSE,
} from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import { getServiceCategoriesThunk } from "../../store/slices/masterTableSlice";

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const handleLogin = (data: ILogin) => {
    const payload: ILoginPayload = {
      client_id: CLIENT_ID,
      grant_type: GRANT_TYPE,
      password: data.password,
      username: data.email,
    };
    dispatch(loginUserThunk(payload)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        dispatch(getUserProfileThunk()).then(({ meta }) => {
          if (meta?.requestStatus === RESPONSE.REJECTED) {
            errorToast("Failed To Fetch", "Failed to retrieve user profile");
          }
        });
        dispatch(getServiceCategoriesThunk()).then((response) => {
          if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          } else {
            errorToast("Failed to fetch", "Failed to fetch service categories");
          }
        });
      } else if (response?.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response?.payload as ErrorResponse;
        errorToast("Login Failed", errorResponse?.message);
      }
    });
  };
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-300">
      <form
        onSubmit={handleSubmit((data) => handleLogin(data))}
        className="flex justify-center w-full"
      >
        <div className="rounded-xl bg-white md:w-[30rem] md:min-h-[25rem] w-[90%] p-6">
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
                  pattern: {
                    value: PATTERN.EMAIL,
                    message: "Invalid Email Address",
                  },
                  required: "Email is required",
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="email"
                    keyfilter="email"
                    className="signup-input"
                    placeholder="Enter Email Address"
                  />
                )}
              />
              <span className="absolute right-2 top-[0.8rem] pi pi-envelope" />
              {errors.email && (
                <ErrorMessage message={errors?.email?.message} />
              )}
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
                  required: "Password is required",
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
            <label className="text-purple-800 font-primary text-sm cursor-pointer">
              Forgot Password?
            </label>
          </Link>
          <div className="col-span-2 flex justify-end items-center pt-2">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-customPurple text-white px-8 py-2 rounded-full font-primary"
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
