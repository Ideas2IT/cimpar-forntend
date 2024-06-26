import { Controller, useForm } from "react-hook-form";
import { IEditProfile, IUser } from "../../interfaces/User";
import "./EditUserDetails.css";
import {
  countries,
  countryCodes,
  ethnicities,
  genders,
  raceList,
  states,
} from "../../assets/MockData";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button as PrimeButton } from "primereact/button";
import { ERROR, PATH_NAME, PATTERN, RESPONSE } from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import {
  combineHeight,
  getFractionalPart,
  getFullPhoneNumber,
  handleKeyPress,
  splitCodeWithPhoneNumber,
} from "../../services/commonFunctions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedPatient,
  updatePatientProfileThunk,
} from "../../store/slices/PatientSlice";
import { IUpdatePatientPayload } from "../../interfaces/patient";
import { AppDispatch } from "../../store/store";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { useEffect } from "react";

const EditUserDetails = ({ user }: { user: IUser }) => {
  const userDetails = useSelector(selectSelectedPatient).basicDetails;
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {} as IEditProfile,
  });

  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length) {
      resetForm();
    }
  }, [userDetails]);

  const resetForm = () => {
    const patient: IEditProfile = {
      city: userDetails.city,
      country: userDetails.country,
      dob: userDetails.dob,
      email: userDetails.email,
      ethnicity: userDetails.ethnicity,
      firstName: userDetails.firstName,
      gender: userDetails.gender,
      fullAddress: userDetails.address,
      height: {
        inches: Number(Math.floor(userDetails.height)),
        feet: getFractionalPart(userDetails.height),
      },
      id: "",
      lastName: userDetails.lastName,
      middleName: userDetails.middleName,
      phoneCode: userDetails.phoneCode,
      alternateCode: userDetails.alternateCode,
      phoneNo: Number(splitCodeWithPhoneNumber(userDetails.phoneNo).phone) || 0,
      race: userDetails.race,
      state: userDetails.state,
      weight: userDetails.weight,
      zipCode: userDetails.zipCode,
      alternateNo: Number(userDetails.alternateNo),
    };
    reset({ ...patient });
  };

  const { toast, successToast, errorToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const handleFormSubmit = (data: IEditProfile) => {
    const payload: IUpdatePatientPayload = {
      city: data.city,
      country: data.country,
      date_of_birth: data.dob,
      email: data.email,
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      full_address: data.fullAddress,
      gender: data.gender,
      patient_id: userDetails.id,
      phone_number: getFullPhoneNumber("+1", data.phoneNo),
      state: data.state,
      zip_code: data.zipCode,
      weight: data.weight,
      height: combineHeight(data.height.feet, data.height.inches),
    };
    dispatch(updatePatientProfileThunk(payload)).then(({ meta }) => {
      if (meta.requestStatus === RESPONSE.FULFILLED) {
        successToast("Data Updated", "Profile updated successfully");
        if (location?.state?.from === PATH_NAME.HEALTH_RECORDS) {
          navigate(PATH_NAME.HEALTH_RECORDS);
        } else {
          navigate(PATH_NAME.PROFILE);
        }
      } else if (RESPONSE.REJECTED) {
        errorToast("Failed", "Profile updation unsuccessful");
      }
    });
  };

  const validateHeight = (height: number) => {
    if (height > 20 || height < 1) {
      return "Invalid height";
    }
    return true;
  };

  const validatePhoneNumber = (value: number | null) => {
    if (value == null || value.toString().length < 6) {
      return "Phone number must be at least 6 digits";
    } else return true;
  };
  return (
    <div className="px-6 ">
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => handleKeyPress(event)}
      >
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
                className="cimpar-input focus:outline-none"
                type="text"
                id="firstName"
                placeholder="First name"
              />
              {errors.firstName && (
                <ErrorMessage message={errors.firstName.message} />
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
                className="cimpar-input focus:outline-none"
                type="text"
                id="middleName"
                placeholder="Middle Name"
              />
              {errors.middleName && (
                <ErrorMessage message={errors.middleName.message} />
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
                className="cimpar-input focus:outline-none"
                type="text"
                id="lastName"
                placeholder="Last name"
              />
              {errors.lastName && (
                <ErrorMessage message={errors.lastName.message} />
              )}
            </div>
            <div className="pt-4">
              <label
                className="block input-label"
                htmlFor="gender"
                onClick={() => document.getElementById("gender")?.click()}
              >
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
                    id="gender"
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
                <ErrorMessage message={errors.gender.message} />
              )}
            </div>
            <div className="pt-4 relative">
              <label htmlFor="dob" className="block input-label pb-1">
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
                      onChange={(e) => {
                        e?.target?.value &&
                          setValue("dob", e.target.value.toString());
                      }}
                      inputId="dob"
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
              {errors.dob && <ErrorMessage message={errors.dob.message} />}
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
                    rules={{
                      required: "Height is required",
                      validate: validateHeight,
                    }}
                    render={({ field }) => (
                      <InputNumber
                        inputId="height"
                        onChange={(event: InputNumberChangeEvent) => {
                          event.value && setValue("height.feet", event.value);
                          trigger("height.feet");
                        }}
                        placeholder="Feet"
                        value={Number(field.value) || 0}
                        className="w-full h-full"
                        useGrouping={false}
                      />
                    )}
                  />
                  <span className="absolute top-[.5rem] right-5 bg-white">ft</span>
                </span>
                <span className="p-inputgroup-addon w-[48%] px-1 relative">
                  <Controller
                    name="height.inches"
                    control={control}
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
                        max={11}
                        onChange={(e) => {
                          e.value && setValue("height.inches", e.value);
                        }}
                        value={Number(field.value) || 0}
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
                <ErrorMessage message={errors.height.feet.message} />
              ) : (
                errors.height?.inches && (
                  <ErrorMessage message={errors.height.inches.message} />
                )
              )}
            </div>
            <div className="pt-4  relative">
              <label className="block input-label pb-1" htmlFor="weight">
                Weight*
              </label>
              <Controller
                name="weight"
                control={control}
                rules={{
                  required: "Weight is required",
                }}
                render={({ field }) => (
                  <>
                    <InputNumber
                      mode="decimal"
                      value={field.value}
                      onChange={(event) => {
                        event.value ? setValue("weight", event?.value) : 0;
                        trigger("weight");
                      }}
                      className="cimpar-input weight focus:outline-none"
                      minFractionDigits={1}
                      maxFractionDigits={2}
                      id="weight"
                      placeholder="weight"
                      useGrouping={false}
                    />
                    <span className="absolute right-2 top-[3rem] z-100">
                      Lbs
                    </span>
                  </>
                )}
              />
              {errors.weight && (
                <ErrorMessage message={errors.weight.message} />
              )}
            </div>
            <div className="pt-4">
              <label
                className="block input-label pb-1"
                htmlFor="race"
                onClick={() => document.getElementById("race")?.click()}
              >
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
                    onChange={(e: DropdownChangeEvent) =>
                      e.value && setValue("race", e.value)
                    }
                    options={raceList}
                    optionLabel="name"
                    placeholder="Select"
                    className="race-dropdown"
                  />
                )}
              />
              {errors.race && <ErrorMessage message={errors.race.message} />}
            </div>
            <div className="pt-4  relative">
              <label
                className="block input-label pb-1"
                htmlFor="ethnicity"
                onClick={() => document.getElementById("ethnicity")?.click()}
              >
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
                    id="ethnicity"
                    value={field.value}
                    options={ethnicities}
                    placeholder="Select"
                    className="border p-0 w-full border-border-gray-300 rounded-lg h-[2.5rem] text-xs px-0 shadow-none"
                  />
                )}
              />
              {errors.ethnicity && (
                <ErrorMessage message={errors.ethnicity.message} />
              )}
            </div>
          </div>
          <div className="py-6 font-primary text-xl">Contact Details</div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 pb-[5rem]">
            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="phoneNumber">
                Phone Number*
              </label>
              <div className="p-inputgroup buttonGroup">
                <span className="country-code w-[50%] h-[2.5rem] align-middle">
                  <Dropdown
                    value="+1"
                    disabled={true}
                    placeholder="+1-US"
                    className="border p-0 w-full h-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                  />
                </span>
                <Controller
                  name="phoneNo"
                  control={control}
                  rules={{
                    validate: validatePhoneNumber,
                  }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      inputId="phoneNumber"
                      onChange={(e) => {
                        setValue("phoneNo", e?.value ? e.value : null);
                        trigger("phoneNo");
                      }}
                      placeholder="Phone Number"
                      useGrouping={false}
                      className="border custom-input border-gray-300 rounded-r-lg w-[50%]"
                    />
                  )}
                />
              </div>
              {errors.phoneNo && (
                <ErrorMessage message={errors.phoneNo.message} />
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
                <span className="country-code w-[50%] align-middle">
                  <Dropdown
                    value="+1"
                    placeholder="+1-US"
                    disabled
                    className="border rounded-r-lg p-0 h-full w-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                  />
                </span>
                <Controller
                  name="alternateNo"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      inputId="alternateNumberCode"
                      value={(field.value && Number(field.value)) || 0}
                      onChange={(e) =>
                        e.value && setValue("alternateNo", e.value)
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
                className="cimpar-input focus:outline-none"
                type="text"
                id="city"
                placeholder="City"
              />
              {errors.city && <ErrorMessage message={errors.city.message} />}
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
                  <InputText
                    {...field}
                    id="zipCode"
                    className="input-field w-full"
                  />
                )}
              />
              {errors.zipCode && (
                <ErrorMessage message={errors.zipCode.message} />
              )}
            </div>
            <div className="pt-4 col-span-2">
              <label className="block input-label pb-1" htmlFor="fullAddress">
                Full Address*
              </label>
              <input
                {...register("fullAddress", {
                  required: "Address can't be empty.",
                })}
                name={`fullAddress`}
                className="cimpar-input focus:outline-none"
                type="text"
                id="fullAddress"
                placeholder="Full address"
              />
              {errors.fullAddress && (
                <ErrorMessage message={errors.fullAddress.message} />
              )}
            </div>
            <div className="pt-4">
              <label
                className="block input-label pb-1"
                htmlFor="state"
                onClick={() => document.getElementById("state")?.click()}
              >
                State*
              </label>
              <Controller
                name="state"
                control={control}
                defaultValue={user.state}
                rules={{
                  required: "State can't be empty",
                }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    id="state"
                    onChange={(e) => setValue("state", e.target.value)}
                    options={states}
                    optionLabel="value"
                    placeholder="Select a State"
                    className="dropdown w-full md:w-14rem border border-gray-300 rounded-lg !py-[0.4rem]"
                  />
                )}
              />
              {errors.state && <ErrorMessage message={errors.state.message} />}
            </div>
            <div className="pt-4">
              <label
                className="block input-label pb-1"
                htmlFor="country"
                onClick={() => document.getElementById("country")?.click()}
              >
                Country*
              </label>
              {/* <Controller
                name="country"
                control={control}
                defaultValue={user.country}
                rules={{
                  required: "Country can not be empty",
                }}
                render={({ field }) => ( */}
              <Dropdown
                id="country"
                value="USA"
                onChange={(e) => setValue("country", e.target.value)}
                placeholder="USA"
                disabled
                className="dropdown w-full md:w-14rem border border-gray-300  rounded-lg !py-[0.4rem]"
              />
              {/* )}
              /> */}
              {errors.country && (
                <ErrorMessage message={errors.country.message} />
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
