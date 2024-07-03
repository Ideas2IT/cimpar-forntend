import { InputText } from "primereact/inputtext";
import ReyaIcon from "../../assets/reya-logo.svg?react";
import { PATH_NAME, PATTERN } from "../../utils/AppConstants";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./SignUp.css";
import { ISignUp } from "../../interfaces/UserLogin";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { signupThunk } from "../../store/slices/loginSlice";

const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {} as ISignUp });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignUp = (data: ISignUp) => {
    dispatch(signupThunk(data));
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
              <label className="input-label" htmlFor="firstName">
                First Name*
              </label>
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
                      id="firstName"
                      className="signup-input"
                      placeholder="Enter First Name"
                      aria-label="First Name"
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
              <label className="input-label" htmlFor="lastName">
                Last Name*
              </label>
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
                      id="lastName"
                      tooltip="Name should contain only space and letters"
                      {...field}
                      className="signup-input"
                      placeholder="Enter Last Name"
                      aria-label="Last Name"
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
                      id="email"
                      {...field}
                      keyfilter="email"
                      className="signup-input"
                      placeholder="Enter Email Address"
                      arial-label="Email Address"
                    />
                  )}
                />
                <span className="absolute right-2 top-[0.7rem] pi pi-envelope" />
                {errors.email && <ErrorMessage message="Invalid Email Id" />}
              </div>
            </div>
            <div className="col-span-2 w-full">
              <label className="input-label" htmlFor="phoneNumber">
                Contact Number*
              </label>
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
                      id="phoneNumber"
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
                <Link to={PATH_NAME.HOME} className="text-purple-800">
                  Login
                </Link>
              </label>
              <Button
                type="submit"
                className="bg-purple-800 text-white md:px-4 px-1 py-2 rounded-full font-primary"
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
