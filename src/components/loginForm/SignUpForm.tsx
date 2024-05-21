import { InputText } from "primereact/inputtext";
import ReyaIcon from "../../assets/reya-logo.svg?react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { PATH_NAME, PATTERN } from "../../utils/AppConstants";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./SignUp.css";

const SignUpForm = () => {
  interface ISignUp {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {} as ISignUp });
  const navigate = useNavigate();

  const handleSignUp = (data: ISignUp) => {
    navigate(PATH_NAME.SET_PASSWORD);
  };
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit((data) => handleSignUp(data))}>
        <div className="bg-white md:w-[30rem] md:h-[27rem] rounded-lg p-6">
          <div className="flex flex-row justify-center w-full h-[3rem]">
            <ReyaIcon className="block" />
          </div>
          <div className="block font-primary text-xl">Signup</div>
          <div className="md:grid grid-cols-2 gap-4">
            <div className="pt-4">
              <label className="input-label">First Name*</label>
              <div className=" h-[2.5rem] relative">
                <Controller
                  name="firstName"
                  control={control}
                  rules={{
                    pattern: PATTERN.NAME,
                    required: "First name can't be empty",
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      className="signup-input"
                      placeholder="First Name"
                    />
                  )}
                />
                <span className="absolute right-2 top-[0.7rem] pi pi-user" />
                {errors.firstName && (
                  <ErrorMessage message="Invalid First Name" />
                )}
              </div>
            </div>
            <div className="pt-4">
              <label className="input-label">Last Name*</label>
              <div className=" h-[2.5rem] relative">
                <Controller
                  name="lastName"
                  control={control}
                  rules={{
                    required: "Last name can't be empty",
                    pattern: PATTERN.NAME,
                  }}
                  render={({ field }) => (
                    <InputText
                      tooltip="Name should contain only space and letters"
                      {...field}
                      className="signup-input"
                      placeholder="Last Name"
                    />
                  )}
                />
                <span className="absolute right-2 top-[0.7rem] pi pi-user" />
                {errors.lastName && (
                  <ErrorMessage message="Invalid Last Name" />
                )}
              </div>
            </div>
            <div className="col-span-2 w-full my-1">
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
                      placeholder="Email Address"
                    />
                  )}
                />
                <span className="absolute right-2 top-[0.7rem] pi pi-envelope" />
                {errors.email && <ErrorMessage message="Invalid Email Id" />}
              </div>
            </div>
            <div className="col-span-2 w-full">
              <label className="input-label">Contact Number*</label>
              <div className="relative h-[2.5rem]">
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    pattern: PATTERN.PHONE,
                    required: "Phone number can't be empty",
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      className="signup-input"
                      placeholder="Contact Number"
                    />
                  )}
                />
                <span className="absolute right-2 top-[0.7rem] pi pi-phone" />
                {errors.phoneNumber && (
                  <ErrorMessage message="Invalid Phone Number" />
                )}
              </div>
            </div>
            <div className="col-span-2 flex justify-between items-center pt-2">
              <label className="text-sm">
                Have an account already?{" "}
                <Link to={PATH_NAME.LOGIN} className="text-purple-800">
                  Login
                </Link>
              </label>
              <Button
                type="submit"
                className="bg-purple-800 text-white md:px-4 px-1 py-1 rounded-full font-primary"
                label="Sign Up"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SignUpForm;
