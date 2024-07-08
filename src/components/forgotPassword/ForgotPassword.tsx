import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReyaIcon from "../../assets/reya-logo.svg?react";
import { IForgotPassword } from "../../interfaces/UserLogin";
import { resetPasswordThunk } from "../../store/slices/loginSlice";
import { AppDispatch } from "../../store/store";
import {
  MESSAGE,
  PATH_NAME,
  PATTERN,
  RESPONSE,
} from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import "./forgotPassword.css";
import localStorageService from "../../services/localStorageService";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: {} as IForgotPassword });

  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast } = useToast();

  const handleFormSubmit = (data: IForgotPassword) => {
    if (data?.email) {
      dispatch(resetPasswordThunk(data.email)).then((response) => {
        localStorageService.logout();
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          setIsSubmitted(true);
        } else {
          setIsSubmitted(false);
          errorToast("Password Reset Failed", response.payload.message);
        }
      });
    }
  };

  const email = watch("email");

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <div className="header-wrapper relative">
          <div className="logo">
            <ReyaIcon className="block" />
          </div>
          {!isSubmitted ? (
            <>
              <label className="font-primary text-2xl pb-2 pt-5 block">
                Forgot Password
              </label>
              <label className="input-label py-2 block">
                {MESSAGE.PASSOWRD_RESET}
              </label>
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
                        message: "Invalid Email",
                      },
                      required: "Email is required",
                    }}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        id="email"
                        keyfilter="email"
                        className="signup-input"
                        placeholder="Enter Email"
                      />
                    )}
                  />
                  <span className="absolute right-2 top-[0.7rem] pi pi-envelope" />
                  {errors.email && (
                    <ErrorMessage message={errors?.email?.message} />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <label className="font-primary text-2xl py-2 block">
                Check your email
              </label>
              <label className="input-label">
                We have sent you an email at
                <span className="text-lg font-primary px-1"> {email}</span>
                Check your inbox and follow the instructions to reset your
                account password.
              </label>
            </>
          )}

          <div className="flex absolute bottom-[1rem] left-[1.5rem] right-[1rem] items-end h-[5rem] justify-end pb-3">
            {!isSubmitted ? (
              <>
                <Button
                  onClick={() => {
                    navigate(PATH_NAME.HOME);
                  }}
                  type="button"
                  className="button font-primary"
                  label="Cancel"
                />
                <Button
                  disabled={false}
                  type="submit"
                  className="link-button font-primary"
                  label="Request a reset link"
                />
              </>
            ) : (
              <div className="button-wrapper font-primary">
                <Link to={PATH_NAME.HOME}>
                  <Button
                    label="Back to Login"
                    className="text-sm font-secondary"
                  />
                </Link>
                <Button
                  onClick={() => {
                    localStorageService.logout();
                    navigate(PATH_NAME.HOME);
                  }}
                  type="button"
                  className="button font-primary"
                  label="Got it"
                />
              </div>
            )}
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
};
export default ForgotPassword;
