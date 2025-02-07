import ReyaIcon from "../../assets/reya-logo.svg?react";
import CheckMark from "../../assets/icons/bluetick.svg?react";
import { MESSAGE, PATH_NAME, RESPONSE } from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import useToast from "../useToast/UseToast";
import "./SetPassword.css";
import { ISetPassword } from "../../interfaces/UserLogin";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setPasswordThunk } from "../../store/slices/loginSlice";
import { ISetPasswordPayload } from "../../interfaces/User";
import localStorageService from "../../services/localStorageService";

const SetPassword = () => {
  const { errorToast, toast, successToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {} as ISetPassword });
  const { id } = useParams();

  const handleSetPassowrd = (data: ISetPassword) => {
    if (!id) {
      return;
    }
    if (data.confirmPassword !== data.newPassword) {
      errorToast(
        "Set password failed",
        "Error: The password and confirm password do not match."
      );
      return;
    }
    const payload: ISetPasswordPayload = {
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
      token: id || "",
    };
    dispatch(setPasswordThunk(payload)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        successToast(
          "Password Reset Successful",
          "Your password has been successfully reset"
        );
        localStorageService.logout();
        setTimeout(() => {
          navigate(PATH_NAME.HOME);
        }, 1500);
      } else {
        errorToast("Unable To Reset Password", response?.payload?.message);
      }
    });
  };
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-300">
      <form onSubmit={handleSubmit((data) => handleSetPassowrd(data))}>
        <div className="rounded-lg bg-white md:w-[30rem] md:h-[25rem] p-6">
          <div className="flex flex-row justify-center w-full h-[3rem]">
            <ReyaIcon className="block" data-testid="reya-icon" />
          </div>
          <div className="w-full flex flex-row">
            <CheckMark data-testid="check-mark" />
            <label className="color-success font-primary px-2">
              Email Verified
            </label>
          </div>
          <label className="input-label">{MESSAGE.PASSWORD_VERIFIED}</label>
          <div className="font-primary text-2xl py-3">Set Password</div>
          <div className="w-full relative">
            <label className="input-label" htmlFor="newPassword">
              New Password*
            </label>
            <div className="h-[2.5rem]">
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  minLength: {
                    value: 8,
                    message: MESSAGE.PASSWORD_LENGTH_ERROR,
                  },
                  required: "New Password can't be empty",
                }}
                render={({ field }) => (
                  <Password
                    {...field}
                    inputId="newPassword"
                    inputClassName="reset-input"
                    className="w-full h-full"
                    alt="newPassword"
                    toggleMask
                  />
                )}
              />
            </div>
            <span className="absolute">
              {errors.newPassword && (
                <ErrorMessage message={errors.newPassword.message} />
              )}
            </span>
          </div>
          <div className="w-full py-4 relative">
            <label className="input-label pt-3 block" htmlFor="confirmPassword">
              Confirm Password*
            </label>
            <div className="card justify-center h-[2.5rem]">
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  minLength: {
                    value: 8,
                    message: MESSAGE.PASSWORD_LENGTH_ERROR,
                  },
                  required: "Confirm Password can't be empty",
                }}
                render={({ field }) => (
                  <Password
                    {...field}
                    inputId="confirmPassword"
                    inputClassName="reset-input"
                    className="w-full h-full"
                    toggleMask
                    aria-label="confirmPassword"
                  />
                )}
              />
            </div>
            <span className="absolute">
              {errors.confirmPassword && (
                <ErrorMessage message={errors.confirmPassword.message} />
              )}
            </span>
          </div>
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              className="bg-purple-800 text-white px-4 py-2 rounded-full font-primary"
              label="Set Password"
            />
          </div>
        </div>
        <Toast ref={toast} />
      </form>
    </div>
  );
};
export default SetPassword;
