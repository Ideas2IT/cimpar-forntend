import { InputText } from "primereact/inputtext";
import ReyaIcon from "../../assets/reya-logo.svg?react";
import { MESSAGE, PATTERN } from "../../utils/AppConstants";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Button } from "primereact/button";
import { useState } from "react";
const ForgotPassword = () => {
  interface IForgotPassword {
    email: string;
  }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {} as IForgotPassword });

  const handleFormSubmit = (data: IForgotPassword) => {
    setIsSubmitted(true);
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-full w-full">
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <div className="w-[30rem] h-[25rem] bg-white rounded-lg p-6">
          <div className="flex flex-row justify-center w-full h-[3rem]">
            <ReyaIcon className="block" />
          </div>
          <label className="font-primary text-2xl py-2">Forgot Password</label>
          <label className="input-label py-2 block">
            {MESSAGE.PASSOWRD_RESET}
          </label>
          <div className="col-span-2 w-full my-3">
            <label className="input-label">Email*</label>
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
                    keyfilter="email"
                    className="signup-input"
                    type="email"
                    placeholder="Enter Email"
                  />
                )}
              />
              <span className="absolute right-2 top-[0.7rem] pi pi-envelope" />
              {errors.email && <ErrorMessage message="Invalid Email Id" />}
            </div>
          </div>
          <div className="flex items-end h-[10rem] justify-end pb-3">
            {!isSubmitted ? (
              <>
                <Button
                  onClick={() => {}}
                  type="button"
                  className="text-purple-800 border border-purple-800 h-[2.5rem] mx-3 px-8 py-1 rounded-full font-primary"
                  label="Cancel"
                />
                <Button
                  disabled={false}
                  type="submit"
                  className="bg-purple-800 text-white px-8 py-1 h-[2.5rem] rounded-full font-primary"
                  label="Request a reset link"
                />
              </>
            ) : (
              <>dsds</>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
export default ForgotPassword;
