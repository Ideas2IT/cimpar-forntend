import { Button as PrimeButton } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorResponse, IOptionValue } from "../../interfaces/common";
import { IUpdatePatientPayload } from "../../interfaces/patient";
import { IEditProfile } from "../../interfaces/User";
import {
  cleanString,
  combineHeight,
  getDecimalPartPart,
  getFractionalPart,
  handleKeyPress,
  splitCodeWithPhoneNumber,
} from "../../services/commonFunctions";
import { getOptionValuesThunk } from "../../store/slices/masterTableSlice";
import {
  getPatientDetailsThunk,
  selectSelectedPatient,
  updatePatientProfileThunk,
} from "../../store/slices/PatientSlice";
import { getUserProfileThunk } from "../../store/slices/UserSlice";
import { AppDispatch } from "../../store/store";
import {
  DATE_FORMAT,
  ERROR,
  GENDER,
  PATH_NAME,
  PATTERN,
  RESPONSE,
  TABLE,
} from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import "./EditUserDetails.css";

const EditUserDetails = () => {
  const userDetails = useSelector(selectSelectedPatient).basicDetails;
  const [races, setRace] = useState<IOptionValue[]>([]);
  const [ethnicities, setEthnicities] = useState<IOptionValue[]>([]);
  const [states, setStates] = useState<IOptionValue[]>([]);
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

  const genders = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
    { name: "Unknown", value: "unknown" },
  ];

  useEffect(() => {
    if (userDetails && Object.keys(userDetails)?.length) {
      resetForm();
    }
    getOptionData();
  }, [userDetails]);

  useEffect(() => {
    if (ethnicities?.length) {
      const value = ethnicities?.find(
        (item: IOptionValue) =>
          item?.display?.toLowerCase() === userDetails?.ethnicity?.toLowerCase()
      );
      if (value) {
        setValue("ethnicity", value);
        trigger("ethnicity");
      }
    }
  }, [ethnicities]);

  useEffect(() => {
    if (races?.length) {
      let value = {} as IOptionValue | undefined;
      value = races?.find(
        (item: IOptionValue) =>
          item?.display?.toLowerCase() === userDetails?.race?.toLowerCase()
      );
      if (userDetails?.race?.toLowerCase() === "white") {
        value = races?.find(
          (item: IOptionValue) =>
            item?.display?.toLowerCase() === "white or caucasian"
        );
      }
      if (value) {
        setValue("race", value);
        trigger("race");
      }
    }
  }, [races]);

  useEffect(() => {
    if (states?.length) {
      const value = states?.find(
        (item: IOptionValue) =>
          item?.display?.toLowerCase() === userDetails?.state?.toLowerCase()
      );
      if (value) {
        setValue("state", value);
        trigger("state");
      }
    }
  }, [states]);

  const resetForm = () => {
    const patient: IEditProfile = {
      city: userDetails?.city,
      country: userDetails?.country,
      dob: userDetails?.dob,
      email: userDetails?.email,
      ethnicity: {} as IOptionValue,
      firstName: userDetails?.firstName,
      gender: userDetails?.gender,
      fullAddress: userDetails?.address ?? "",
      height: {
        inches: getDecimalPartPart(Number(userDetails?.height)),
        feet: getFractionalPart(Number(userDetails?.height)),
      },
      id: "",
      lastName: userDetails?.lastName,
      middleName: userDetails?.middleName,
      phoneCode: userDetails?.phoneCode,
      phoneNo: Number(splitCodeWithPhoneNumber(userDetails?.phoneNo)) || null,
      race: {} as IOptionValue,
      state: {} as IOptionValue,
      weight: Number(userDetails?.weight),
      zipCode: userDetails?.zipCode || "",
      alternateNo: userDetails?.alternativeNumber
        ? Number(userDetails.alternativeNumber)
        : null,
    };
    reset({ ...patient });
  };

  const getOptionData = () => {
    dispatch(getOptionValuesThunk(TABLE.RACE)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        const _response = response.payload as IOptionValue[];
        if (_response?.length) {
          const updatedResponse: IOptionValue[] = _response?.map(
            (raceItem: IOptionValue) => {
              if (raceItem?.display?.toLowerCase() === "white") {
                const race: IOptionValue = {
                  display: "White or Caucasian",
                  code: raceItem?.code,
                  id: raceItem?.id,
                };
                return race;
              } else {
                return raceItem;
              }
            }
          );
          setRace(updatedResponse);
        } else {
          setRace([]);
        }
      }
    });
    dispatch(getOptionValuesThunk(TABLE.STATE)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        const _response = response.payload as IOptionValue[];
        if (_response?.length) {
          setStates(_response);
        } else {
          setStates([]);
        }
      }
    });
    dispatch(getOptionValuesThunk(TABLE.ETHNICITY)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        const _response = response.payload as IOptionValue[];
        if (_response.length) {
          setEthnicities(_response);
        } else {
          setEthnicities([]);
        }
      }
    });
  };

  const { toast, successToast, errorToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const handleFormSubmit = (data: IEditProfile) => {
    const payload: IUpdatePatientPayload = {
      city: cleanString(data.city),
      country: data.country || "USA",
      dob: dateFormatter(data?.dob, DATE_FORMAT.MM_DD_YYYY),
      email: data?.email?.trim(),
      firstName: cleanString(data?.firstName),
      middleName: cleanString(data?.middleName),
      lastName: cleanString(data.lastName),
      address: cleanString(data.fullAddress),
      gender:
        data?.gender?.toLowerCase() === GENDER.MALE
          ? "M"
          : data?.gender?.toLowerCase() === GENDER.FEMAIL
            ? "F"
            : "U",
      patient_id: userDetails.id,
      phoneNo: data.phoneNo?.toString() || "",
      state: data.state.code,
      zipCode: cleanString(data.zipCode),
      weight: data.weight.toString() || "",
      height: combineHeight(data.height.feet, data.height.inches) || "0",
      ethnicity: data.ethnicity.code || "",
      race: data?.race?.code,
      alternativeNumber: data?.alternateNo?.toString() || "",
    };
    dispatch(updatePatientProfileThunk(payload)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        dispatch(getPatientDetailsThunk(payload.patient_id));
        dispatch(getUserProfileThunk());
        successToast(
          "Updated Successfully",
          "Profile details updated successfully"
        );
        setTimeout(() => {
          if (location?.state?.from?.includes(PATH_NAME.CREATE_APPOINTMENT)) {
            navigate(location?.state?.from);
          } else {
            navigate(PATH_NAME.PROFILE);
          }
        }, 1000);
      } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Updation Failed", errorResponse.message);
      }
    });
  };

  const validateHeight = (height: number) => {
    if (!height) {
      return "Height is requited";
    }
    if (height > 20) {
      return "Invalid height";
    }
    return true;
  };

  const validatePhoneNumber = (value: number | null) => {
    if (value == null || value?.toString()?.length != 10) {
      return "Phone number must be 10 digits";
    } else return true;
  };

  const handleCancel = () => {
    if (location?.state?.from.includes(PATH_NAME.CREATE_APPOINTMENT)) {
      navigate(location?.state?.from);
    } else {
      navigate(PATH_NAME.PROFILE);
    }
  };

  const validateAlternateNumber = (item: number | null) => {
    if (item != null && item?.toString()?.length != 10) {
      return "Alternate Number must be 10 digits";
    } else return true;
  };

  const validateRequiredField = (value: string, field: string) => {
    if (value?.trim()) {
      return true;
    } else {
      return `${field} is required`;
    }
  };

  return (
    <div className="px-6">
      <form
        className="relative"
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => handleKeyPress(event)}
      >
        <div className="flex flex-row justify-between pb-6">
          <BackButton
            previousPage={
              location?.state?.from.includes(PATH_NAME.CREATE_APPOINTMENT)
                ? "Make Appointment"
                : "Personal"
            }
            currentPage="Edit Profile"
            backLink={
              location?.state?.from.includes(PATH_NAME.CREATE_APPOINTMENT)
                ? location?.state?.from
                : PATH_NAME.PROFILE
            }
          />
          <div>
            <div className="flex py-2 justify-between items-center">
              <Button
                onClick={handleCancel}
                className="ml-3 font-primary text-purple-800"
                variant="primary"
                type="reset"
                style="link"
              >
                <i className="p" />
                <i className="pi pi-times me-2"></i>Cancel
              </Button>

              <PrimeButton
                onClick={() => handleSubmit}
                className="ml-3 submit-button items-center"
                outlined
                type="submit"
              >
                <i className="pi pi-check me-2" />
                Save
              </PrimeButton>
            </div>
          </div>
        </div>
        <div className="bg-white py-4 px-6 rounded-xl h-[calc(100vh-200px)] overflow-auto">
          <div className="font-primary text-xl">Basic Details</div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <div className="pt-4 relative">
              <label className="block input-label" htmlFor="firstName">
                First Name*
              </label>
              <input
                {...register("firstName", {
                  required: "First Name is required",
                  validate: (value) =>
                    validateRequiredField(value, "First Name"),
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
                Last Name*
              </label>
              <input
                {...register("lastName", {
                  pattern: {
                    value: PATTERN.NAME,
                    message: ERROR.NAME_ERROR,
                  },
                  validate: (value) =>
                    validateRequiredField(value, "Last Name"),
                  required: "Last Name is required",
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
                    placeholder="Select Gender"
                    className="dropdown w-full gender"
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
                      dateFormat={DATE_FORMAT.DD_MM_YY}
                      className="calander border rounded-lg h-[2.5rem]"
                      maxDate={new Date()}
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
                        {...field}
                        inputId="height"
                        onChange={(event: InputNumberChangeEvent) => {
                          setValue("height.feet", event.value || 0);
                          trigger("height.feet");
                        }}
                        placeholder="Feet"
                        value={Number(field.value) || 0}
                        className="w-full h-full height-feet"
                        useGrouping={false}
                      />
                    )}
                  />
                </span>
                <span className="p-inputgroup-addon w-[48%] px-1 relative">
                  <Controller
                    name="height.inches"
                    control={control}
                    rules={{
                      validate: {
                        value: (value) =>
                          (value >= 0 && value <= 11) || "Invalid Height",
                      },
                    }}
                    render={({ field }) => (
                      <InputNumber
                        onChange={(e) => {
                          e.value && setValue("height.inches", e.value);
                          trigger("height.inches");
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
                  min: { value: 1, message: "Weight is required" },
                  validate: (value) => value >= 1 || "Weight is required",
                }}
                render={({ field }) => (
                  <>
                    <InputNumber
                      mode="decimal"
                      value={field.value}
                      onChange={(event) => {
                        event.value
                          ? setValue("weight", event?.value)
                          : setValue("weight", 0);
                        trigger("weight");
                      }}
                      className="cimpar-input weight focus:outline-none"
                      minFractionDigits={1}
                      maxFractionDigits={2}
                      id="weight"
                      placeholder="weight"
                      useGrouping={false}
                    />
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
                rules={{
                  required: "Race is required",
                }}
                render={({ field }) => (
                  <Dropdown
                    id="race"
                    value={field.value}
                    onChange={(e: DropdownChangeEvent) =>
                      setValue("race", e.value)
                    }
                    options={races}
                    optionLabel="display"
                    placeholder="Select"
                    className="race-dropdown items-center"
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
                rules={{
                  required: "Ethnicity is required",
                }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    onChange={(e) => setValue("ethnicity", e.value)}
                    id="ethnicity"
                    value={field.value}
                    options={ethnicities}
                    optionLabel="display"
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
            <div className="pt-4 relative">
              <label
                className="block input-label pb-1"
                htmlFor="alternateNumberCode"
              >
                Alternate Number
              </label>
              <div className="p-inputgroup buttonGroup relative  flex-1 w-full h-[2.5rem]">
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
                  rules={{
                    validate: validateAlternateNumber,
                  }}
                  render={({ field }) => (
                    <InputNumber
                      inputId="alternateNumberCode"
                      value={field?.value ? Number(field?.value) : null}
                      onChange={(e) => {
                        setValue("alternateNo", e.value || null);
                        trigger("alternateNo");
                      }}
                      placeholder="Phone Number"
                      useGrouping={false}
                      className="border custom-input rounded-r-lg border-gray-300 w-[50%]"
                    />
                  )}
                />
              </div>
              <span className="absolute">
                {errors.alternateNo && (
                  <ErrorMessage message={errors.alternateNo.message} />
                )}
              </span>
            </div>

            <div className="pt-4">
              <label className="block input-label pb-1" htmlFor="city">
                City*
              </label>
              <input
                {...register("city", {
                  required: "City is required",
                  validate: (value) => validateRequiredField(value, "City"),
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
                Zip Code*
              </label>
              <Controller
                name="zipCode"
                control={control}
                rules={{
                  required: "Zip Code is required",
                  minLength: {
                    value: 5,
                    message: "Zip Code must be 5 digits",
                  },
                  maxLength: {
                    value: 5,
                    message: "Zip Code must be 5 digits",
                  },
                  validate: (value) => validateRequiredField(value, "Zip Code"),
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
                  required: "Full Address is required",
                  validate: (value) =>
                    validateRequiredField(value, "Full Address"),
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
                rules={{
                  required: "State is required",
                }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    onChange={(event) => {
                      setValue("state", event?.value);
                      setValue("zipCode", "");
                    }}
                    id="state"
                    options={states}
                    optionLabel="display"
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

              <Dropdown
                id="country"
                value="USA"
                onChange={(e) => setValue("country", e.target.value)}
                placeholder="USA"
                disabled
                className="dropdown w-full md:w-14rem border border-gray-300  rounded-lg !py-[0.4rem]"
              />

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
