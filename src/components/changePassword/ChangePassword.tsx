import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IChangePasswordPayload } from "../../interfaces/UserLogin";
import { selectUserProfile } from "../../store/slices/UserSlice";
import {
  changePasswordThunk,
  logoutThunk,
} from "../../store/slices/loginSlice";
import { AppDispatch } from "../../store/store";
import {
  CLIENT_ID,
  MESSAGE,
  PATH_NAME,
  RESPONSE,
} from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import { ErrorResponse } from "../../interfaces/common";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ handleClose }: { handleClose: () => void }) => {
  const profile = useSelector(selectUserProfile);
  interface IChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {} as IChangePassword });
  const { errorToast, toast, successToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handlePasswordChange = (data: IChangePassword) => {
    if (
      data.oldPassword &&
      data.newPassword &&
      data.newPassword !== data.confirmPassword
    ) {
      errorToast(
        MESSAGE.PASSWORD_UPDATE_FAILED_TITLE,
        MESSAGE.PASSWORD_UPDATE_FAILED_MESSAGE
      );
    } else if (
      data.oldPassword &&
      data.newPassword &&
      data.newPassword === data.confirmPassword
    ) {
      const payload: IChangePasswordPayload = {
        client_id: CLIENT_ID,
        grant_type: "password",
        new_password: data.newPassword,
        old_password: data.oldPassword,
        username: profile.email,
      };
      dispatch(changePasswordThunk(payload)).then((response) => {
        if (response?.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Password Changed Successfully",
            "Your password has been changed successfully. Login with new credentials"
          );
          setTimeout(() => {
            dispatch(logoutThunk()).then(() => {
              navigate(PATH_NAME.HOME);
              handleClose();
            });
          }, 1000);
        } else {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Password Updation Failed", errorResponse.message);
        }
      });
    }
  };

  return (
    <div className="relative h-full">
      <form onSubmit={handleSubmit((data) => handlePasswordChange(data))}>
        <label className="font-primary text-2xl">Change Password</label>
        <div className="w-full relative py-3">
          <label className="input-label" htmlFor="oldPassword">
            Enter Current Password*
          </label>
          <div className="h-[2.5rem]">
            <Controller
              name="oldPassword"
              control={control}
              rules={{
                minLength: {
                  value: 8,
                  message: MESSAGE.PASSWORD_LENGTH_ERROR,
                },
                required: "Old Password can't be empty",
              }}
              render={({ field }) => (
                <Password
                  placeholder="Enter Current Password"
                  {...field}
                  inputId="oldPassword"
                  panelStyle={{ display: "none" }}
                  inputClassName="reset-input"
                  className="w-full h-full"
                  toggleMask
                />
              )}
            />
          </div>
          <span className="absolute">
            {errors.oldPassword && (
              <ErrorMessage message={errors.oldPassword.message} />
            )}
          </span>
        </div>
        <div className="w-full relative py-3">
          <label className="input-label" htmlFor="newPassword">
            Set New Password*
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
                  placeholder="Enter New Password"
                  {...field}
                  inputId="newPassword"
                  inputClassName="reset-input"
                  className="w-full h-full"
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
        <div className="w-full relative py-3">
          <label className="input-label" htmlFor="confirmPassword">
            Confirm New Password*
          </label>
          <div className="h-[2.5rem]">
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                minLength: {
                  value: 8,
                  message: MESSAGE.PASSWORD_LENGTH_ERROR,
                },
                required: "Confirm Password can't be empty",
              }}
              render={({ field }) => (
                <Password
                  placeholder="Confirm Password"
                  {...field}
                  inputId="confirmPassword"
                  inputClassName="reset-input"
                  className="w-full h-full"
                  toggleMask
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
        <div className=" absolute w-full bottom-3 flex justify-end gap-10 pt-4">
          <Button
            label="Cancel"
            className="text-purple-900 font-primary shadow-none"
            type="button"
            icon="pi pi-times"
            onClick={() => handleClose()}
          />
          <Button
            className="text-white bg-purple-900 font-primary rounded-full px-4 py-2"
            label="Change Password"
            onClick={() => handleSubmit}
          />
        </div>
        <Toast ref={toast} />
      </form>
    </div>
  );
};
export default ChangePassword;
