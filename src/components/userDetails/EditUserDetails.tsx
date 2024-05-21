import { Controller, useForm } from "react-hook-form";
import { IUser } from "../../interfaces/User";
import "./EditUserDetails.css";
import {
  countries,
  countryCodes,
  ethnicities,
  genders,
  raceList,
  states,
} from "../../assets/MockData";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import { Button as PrimeButton } from "primereact/button";
import { ERROR, PATH_NAME, PATTERN } from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

const EditUserDetails = ({ user }: { user: IUser }) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  const { toast, successToast } = useToast();
  const navigate = useNavigate();
  const handleFormSubmit = (data: IUser) => {
    successToast("Data Updated", "Profile updated successfully");
    setTimeout(() => {
      navigate(PATH_NAME.PROFILE);
    }, 1500);
  };
  return (
    <div className="px-6 ">
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <div className="flex flex-row justify-between pb-6">
          <BackButton
            previousPage="Personal"
            currentPage="Edit Profile"
            backLink={PATH_NAME.PROFILE}
          />
          <div>
            <div className="flex py-2 justify-between items-center">
              <Link to={PATH_NAME.PROFILE}>
                <Button
                  className="ml-3 font-primary text-purple-800"
                  variant="primary"
                  type="reset"
                  style="link"
                >
                  <i className="p" />
                  <i className="pi pi-times me-2"></i>Cancel
                </Button>
              </Link>
              <PrimeButton
                onClick={() => handleSubmit}
                className="ml-3 submit-button"
                outlined
                type="submit"
              >
                <i className="pi pi-check me-2"></i>Save
              </PrimeButton>
            </div>
          </div>
        </div>
        <div className="bg-white py-4 px-6 rounded-xl">
          <div className="font-primary text-xl">Basic Details</div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <div className="pt-4 relative">
              <label className="block input-label" htmlFor="firstName">
                First Name*
              </label>
              <input
                {...register("firstName", {
                  required: "First name can not be empty.",
                  pattern: {
                    value: PATTERN.NAME,
                    message: ERROR.NAME_ERROR,
                  },
                })}
                name={`firstName`}
                onChange={(event) =>
                  setValue("firstName", event?.target?.value || "")
                }
                className="cimpar-input focus:outline-none"
                type="text"
                id="firstName"
                placeholder="First name"
              />
              {errors.firstName && (
                <span className="text-red-700 text-xs">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label className="block input-label" htmlFor="middleName">
                Middle Name
              </label>
              <input
                {...register("middleName", {
                  pattern: {
                    value: PATTERN.NAME,
                    message: ERROR.NAME_ERROR,
                  },
                })}
                name={`middleName`}
                onChange={(event) =>
                  setValue("middleName", event?.target?.value || "")
                }
                className="cimpar-input focus:outline-none"
                type="text"
                id="middleName"
                placeholder="Middle Name"
              />
              {errors.middleName && (
                <span className="text-red-700 text-xs">
                  {errors.middleName.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label className="block input-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                {...register("lastName", {
                  pattern: {
                    value: PATTERN.NAME,
                    message: ERROR.NAME_ERROR,
                  },
                })}
                name={`lastName`}
                onChange={(event) =>
                  setValue("lastName", event?.target?.value || "")
                }
                className="cimpar-input focus:outline-none"
                type="text"
                id="lastName"
                placeholder="Last name"
              />
              {errors.lastName && (
                <span className="text-red-700 text-xs">
                  {errors.lastName.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label className="block input-label" htmlFor="gender">
                Gender*
              </label>
              <Controller
                name="gender"
                control={control}
                defaultValue={user.gender}
                rules={{
                  required: "Gender is required",
                }}
                render={({ field }) => (
                  <Dropdown
                    inputId="gender"
                    {...field}
                    onChange={(e) => setValue("gender", e.target.value)}
                    options={genders}
                    optionLabel="name"
                    placeholder="Select a City"
                    className="dropdown w-full md:w-[14rem] gender"
                  />
                )}
              />
              {errors.gender && (
                <span className="text-red-700 text-xs">
                  {errors.gender.message}
                </span>
              )}
            </div>
            <div className="pt-4 d-flex relative">
              <label htmlFor="dob" className="block input-label">
                Date of Birth*
              </label>
              <div className="absolute left-0 right-0">
                <Controller
                  name="dob"
                  control={control}
                  defaultValue={user.dob}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      placeholder="Select date of birth"
                      showIcon
                      icon="pi pi-calendar-minus"
                      value={new Date(field.value)}
                      dateFormat="dd MM, yy"
                      className="calander border rounded-lg h-[2.5rem]"
                    />
                  )}
                />
              </div>
              {errors.dob && (
                <span className="text-red-700 text-xs">
                  {errors.dob.message}
                </span>
              )}
            </div>
            <div className="pt-4 relative">
              <label htmlFor="height" className="block input-label pb-1">
                Height*
              </label>
              <div className="p-inputgroup flex-1 border h-[2.5rem] rounded-lg border border-gray-300">
                <span className="relative !w-[50%] border-r relative px-1 border-gray-300">
                  <Controller
                    name="height.feet"
                    control={control}
                    defaultValue={user.height.feet}
                    rules={{
                      required: "Height is required",
                      min: {
                        value: 1,
                        message: "Invalid height",
                      },
                      max: {
                        value: 10,
                        message: "Invalid height",
                      },
                    }}
                    render={({ field }) => (
                      <InputNumber
                        onChange={(event: any) =>
                          event.value && setValue("height.feet", event.value)
                        }
                        placeholder="Feet"
                        value={field.value}
                        className="w-full h-full"
                      />
                    )}
                  />
                  <span className="absolute top-[.5rem] right-5">ft</span>
                </span>
                <span className="p-inputgroup-addon w-[48%] px-1 relative">
                  <Controller
                    name="height.inches"
                    control={control}
                    defaultValue={user.height.inches}
                    rules={{
                      min: {
                        value: 0,
                        message: "Invalid height",
                      },
                      max: {
                        value: 11,
                        message: "invalid height",
                      },
                    }}
                    render={({ field }) => (
                      <InputNumber
                        onChange={(e) => {
                          e.value && setValue("height.inches", e.value);
                        }}
                        value={field.value}
                        placeholder="inches"
                      />
                    )}
                  />
                  <span className="absolute top-[.5rem] text-black right-3">
                    in
                  </span>
                </span>
              </div>
              {errors.height?.feet ? (
                <span className="text-red-700 text-xs">
                  {errors.height.feet.message}
                </span>
              ) : (
                errors.height?.inches && (
                  <span className="text-red-700 text-xs">
                    {errors.height.inches.message}
                  </span>
                )
              )}
            </div>
            <div className="pt-4  relative">
              <label className="block input-label pb-1" htmlFor="weight">
                Weight*
              </label>
              <input
                {...register("weight")}
                name={`weight`}
                onChange={(event) =>
                  setValue("weight", Number(event?.target?.value) || 0)
                }
                className="cimpar-input focus:outline-none"
                type="number"
                id="weight"
                placeholder="weight"
              />
              <span className="absolute right-2 top-[3rem] z-100">Lbs</span>
            </div>
            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="race">
                Race*
              </label>
              <Controller
                name="race"
                control={control}
                defaultValue={user.race}
                rules={{
                  required: "Race can not be empty",
                }}
                render={({ field }) => (
                  <Dropdown
                    id="race"
                    value={field.value}
                    onChange={(e: any) => e.value && setValue("race", e.value)}
                    options={raceList}
                    optionLabel="name"
                    placeholder="Select"
                    className="race-dropdown"
                  />
                )}
              />
              {errors.race && (
                <span className="text-red-700 text-xs">
                  {errors.race.message}
                </span>
              )}
            </div>
            <div className="pt-4  relative">
              <label className="block input-label pb-1" htmlFor="ethnicity">
                Ethnicity*
              </label>
              <Controller
                name="ethnicity"
                control={control}
                defaultValue={user.ethnicity}
                rules={{
                  required: "Ethnicity is required",
                }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    value={field.value}
                    options={ethnicities}
                    placeholder="Select"
                    className="border p-0 w-full border-border-gray-300 rounded-lg h-[2.5rem] text-xs px-0 shadow-none"
                  />
                )}
              />
              {errors.ethnicity && (
                <span className="text-red-700 text-xs">
                  {errors.ethnicity.message}
                </span>
              )}
            </div>
          </div>
          <div className="py-6 font-primary text-xl">Contact Details</div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 pb-[5rem]">
            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="phoneNumber">
                Phone Number*
              </label>
              <div className="p-inputgroup buttonGroup px-2">
                <span className="country-code w-[50%] h-[2.5rem] align-middle">
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue={user.countryCode}
                    rules={{
                      required: "Country code is required",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        inputId="phoneNumber"
                        value={field.value}
                        options={countryCodes}
                        optionLabel="name"
                        placeholder="Select"
                        className="border p-0 w-full h-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                      />
                    )}
                  />
                </span>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue={user.phoneNumber}
                  rules={{
                    required: "Phone number is required",
                    minLength: {
                      value: 6,
                      message: "Phone number can't be less than 6 digits",
                    },
                  }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      inputId="phoneNumber"
                      onChange={(e) =>
                        e.value && setValue("phoneNumber", e.value)
                      }
                      placeholder="Phone Number"
                      useGrouping={false}
                      className="border custom-input border-gray-300 rounded-r-lg w-[50%]"
                    />
                  )}
                />
              </div>
              {errors.phoneNumber && (
                <span className="text-red-700 text-xs">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label
                className="block input-label pb-1"
                htmlFor="alternateNumberCode"
              >
                Alternate Number
              </label>
              <div className="p-inputgroup buttonGroup  flex-1 w-full h-[2.5rem]">
                <span className="country-code w-[50%] p-inputgroup-addon">
                  <Controller
                    name="alternateNumberCode"
                    control={control}
                    defaultValue={user.alternateNumberCode}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        onChange={(e: any) =>
                          e.value && setValue("alternateNumberCode", e.value)
                        }
                        options={countryCodes}
                        optionLabel="name"
                        placeholder="Select"
                        className="border rounded-r-lg p-0 h-full w-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                      />
                    )}
                  />
                </span>
                <Controller
                  name="alternativeNumber"
                  control={control}
                  defaultValue={user.alternativeNumber}
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => (
                    <InputNumber
                      value={Number(field.value)}
                      onChange={(e) =>
                        e.value && setValue("alternativeNumber", e.value)
                      }
                      placeholder="Phone Number"
                      useGrouping={false}
                      className="border custom-input rounded-r-lg border-gray-300 w-[50%]"
                    />
                  )}
                />
              </div>
            </div>

            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="city">
                City*
              </label>
              <input
                {...register("city", {
                  required: "City can not be empty.",
                })}
                name={`city`}
                onChange={(event) => setValue("city", event?.target?.value)}
                className="cimpar-input focus:outline-none"
                type="text"
                id="city"
                placeholder="City"
              />
              {errors.city && (
                <span className="text-red-700 text-xs">
                  {errors.city.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="zipCode">
                Zip code*
              </label>
              <Controller
                name="zipCode"
                control={control}
                defaultValue={user.zipCode}
                rules={{
                  required: "ZipCode can not be empty",
                }}
                render={({ field }) => (
                  <InputText {...field} className="input-field w-full" />
                )}
              />
              {errors.zipCode && (
                <span className="text-red-700 text-xs">
                  {errors.zipCode.message}
                </span>
              )}
            </div>
            <div className="pt-4 col-span-2">
              <label className="block input-label pb-1" htmlFor="fullAddress">
                Full Address*
              </label>
              <input
                {...register("fullAddress", {
                  required: "Address can not be empty.",
                })}
                name={`fullAddress`}
                onChange={(event) =>
                  setValue("fullAddress", event?.target?.value)
                }
                className="cimpar-input focus:outline-none"
                type="text"
                id="fullAddress"
                placeholder="Full address"
              />
              {errors.fullAddress && (
                <span className="text-red-700 text-xs">
                  {errors.fullAddress.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="state">
                State*
              </label>
              <Controller
                name="state"
                control={control}
                defaultValue={user.state}
                rules={{
                  required: "State can not be empty",
                }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    onChange={(e) => setValue("state", e.target.value)}
                    options={states}
                    optionLabel="value"
                    placeholder="Select a State"
                    className="dropdown w-full md:w-14rem border border-gray-300 rounded-lg !py-[0.4rem]"
                  />
                )}
              />
              {errors.state && (
                <span className="text-red-700 text-xs">
                  {errors.state.message}
                </span>
              )}
            </div>
            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="country">
                Country*
              </label>
              <Controller
                name="country"
                control={control}
                defaultValue={user.country}
                rules={{
                  required: "Country can not be empty",
                }}
                render={({ field }) => (
                  <Dropdown
                    onChange={(e) => setValue("country", e.target.value)}
                    options={countries}
                    optionLabel="name"
                    placeholder="Select a Country"
                    className="dropdown w-full md:w-14rem border border-gray-300  rounded-lg !py-[0.4rem]"
                    value={field.value}
                  />
                )}
              />
              {errors.country && (
                <span className="text-red-700 text-xs">
                  {errors.country.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
};
export default EditUserDetails;
