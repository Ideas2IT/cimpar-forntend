import { Password } from "primereact/password";
import { Controller, useForm } from "react-hook-form";
import { MESSAGE } from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Button } from "primereact/button";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";

const ChangePassword = ({ handleClose }: { handleClose: () => void }) => {
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

  //TODO: Handle Password change API call
  const handlePasswordChange = (data: IChangePassword) => {
    if (data.newPassword !== data.confirmPassword) {
      errorToast(
        MESSAGE.PASSWORD_UPDATE_FAILED_TITLE,
        MESSAGE.PASSWORD_UPDATE_FAILED_MESSAGE
      );
    } else {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  return (
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
      <div className="flex justify-end gap-4 pt-4">
        <Button
          label="Cancel"
          className="text-purple-900 font-primary shadow-none"
          type="button"
          icon="pi pi-times"
          onClick={() => handleClose()}
        />
        <Button
          className="text-white bg-purple-900 rounded-full px-4 py-2"
          label="Change Password"
        />
      </div>
      <Toast ref={toast} />
    </form>
  );
};
export default ChangePassword;
