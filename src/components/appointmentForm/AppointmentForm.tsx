import { addMinutes } from "date-fns";
import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-time-picker/dist/TimePicker.css";
import AddRecord from "../../assets/icons/addrecord.svg?react";
import checkmark from "../../assets/icons/checkmark.svg";
import HomeIcon from "../../assets/icons/home.svg?react";
import HeaderContext from "../../context/HeaderContext";
import { ICreateAppointmentPayload } from "../../interfaces/appointment";
import {
  ErrorResponse,
  IAllTestspayload,
  ILabTestService,
} from "../../interfaces/common";
import {
  IGetLocationPayload,
  ILocation,
  ILocationResponse,
  TServiceLocationType,
} from "../../interfaces/location";
import { IMedicine } from "../../interfaces/medication";
import {
  getDobAndAge,
  getPolicyDetails,
  getStringArrayFromObjectArray,
  handleKeyPress,
} from "../../services/commonFunctions";
import {
  getPatientInsuranceThunk,
  getPatientMedicalConditionsThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { createAppointmentThunk } from "../../store/slices/appointmentSlice";
import {
  getAllergiesByQueryThunk,
  getLabTestsForAdminThunk,
  getLocationsThunk,
  getMedicalConditionsByQueryThunk,
  selectAllergies,
  selectConditions,
} from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import {
  CODE,
  DATE_FORMAT,
  DIALOG_WARNING,
  LAB_SERVICES,
  PAGE_LIMIT,
  PATH_NAME,
  PRICING_INDEX,
  RESPONSE,
  SERVICE_LOCATION,
  SYSTEM,
  TABLE,
} from "../../utils/AppConstants";
import Button from "../Button";
import BackButton from "../backButton/BackButton";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import CustomModal from "../customModal/CustomModal";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PreviewAppointment from "../previewAppointment/PreviewAppoinement";
import useToast from "../useToast/UseToast";
import "./AppointmentPage.css";
import LocationDropDown from "./LocationDropDown";
import ServiceOptions from "./ServiceOptions";
import TestPricing from "./TestPricing";

export interface IItem {
  id: number;
  name: string;
}

export interface IFormData {
  testToTake: ILabTestService[];
  dateOfAppointment: Date;
  scheduledTime: Date;
  reasonForTest: string;
  testReason: IItem;
  otherReasonForTest: string;
  medicalConditions: IMedicine[];
  otherMedicalConditions: string[];
  allergies: IMedicine[];
  otherAllergies: string[];
  location: ILocation;
  serviceType: TServiceLocationType;
}

const AppointmentForm = () => {
  const reasonsForTest: IItem[] = [
    { id: 1, name: "Usual checkup" },
    { id: 2, name: "Advised by doctor" },
    { id: 3, name: "Other" },
  ];

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors, isDirty },
    trigger,
  } = useForm({
    defaultValues: {} as IFormData,
  });

  const multiSelectRef = useRef<MultiSelect>(null);
  const timerRef = useRef<Calendar>(null);

  const dispatch = useDispatch<AppDispatch>();

  const patient = useSelector(selectSelectedPatient);
  const filteredAllergies = useSelector(selectAllergies);
  const filteredConditions = useSelector(selectConditions);

  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({} as IFormData);
  const [tests, setTests] = useState<ILabTestService[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const reasonForTest = watch("testReason");
  const appointmentDate = watch("dateOfAppointment");
  const selectedTests = watch("testToTake");
  const selectedServiceType = watch("serviceType");

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    dispatch(
      getLabTestsForAdminThunk({
        service_type: LAB_SERVICES.CLINICAL_LABORATORY,
        tableName: TABLE.LAB_TEST,
        all_records: true,
        page: 1,
        page_size: PAGE_LIMIT,
      } as IAllTestspayload)
    ).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        if (response?.payload?.data?.length) {
          const _response = response.payload.data;
          setTests(_response);
        } else {
          setTests([]);
        }
      }
    });
    dispatch(
      getLocationsThunk({
        active: true,
        page: 1,
        page_size: PAGE_LIMIT,
      } as IGetLocationPayload)
    ).then((response) => {
      const locations = response.payload as ILocationResponse;
      setLocations(locations.data);
    });
    if (patient?.basicDetails?.id) {
      dispatch(getPatientInsuranceThunk(patient?.basicDetails?.id)).then(
        ({ meta }) => {
          if (meta.requestStatus === RESPONSE.REJECTED) {
            errorToast(
              "Failed to Load insurance details",
              "Could not load insurance details"
            );
          }
        }
      );
      dispatch(
        getPatientMedicalConditionsThunk(patient?.basicDetails?.id)
      ).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.REJECTED) {
          errorToast(
            "Failed to Load data",
            "Could not load medical conditions"
          );
        }
      });
    }
  }, [patient?.basicDetails?.id]);

  useEffect(() => {
    reset({
      medicalConditions:
        patient?.medicalConditionsAndAllergies?.medicalConditions,
      allergies: patient?.medicalConditionsAndAllergies?.allergies,
      otherAllergies: getStringArrayFromObjectArray(
        patient?.medicalConditionsAndAllergies?.otherAllergies
      ),
      otherMedicalConditions: getStringArrayFromObjectArray(
        patient?.medicalConditionsAndAllergies?.otherMedicalConditions
      ),
      dateOfAppointment: new Date(),
    } as IFormData);
  }, [patient?.medicalConditionsAndAllergies]);

  useEffect(() => {
    trigger("otherReasonForTest");
    trigger("scheduledTime");
  }, [reasonForTest, appointmentDate]);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedTests, selectedServiceType]);

  const calculateTotalCost = () => {
    if (selectedTests?.length) {
      const totalPrice = selectedTests.reduce((acc, service) => {
        if (selectedServiceType === SERVICE_LOCATION.HOME) {
          return acc + Number(service.home_price);
        } else {
          return acc + Number(service.center_price);
        }
      }, 0);
      setTotalCost(totalPrice);
    } else {
      setTotalCost(0);
    }
  };

  const handleFormSubmit = (data: IFormData) => {
    setShowConfirmDialog(true);
    setFormData(data);
  };

  const searchAllergies = (event: AutoCompleteCompleteEvent) => {
    if (event.query.trim().length > 2) {
      dispatch(getAllergiesByQueryThunk(event.query));
    }
  };

  const searchMedicalConditions = (event: AutoCompleteCompleteEvent) => {
    if (event.query.trim().length > 2) {
      dispatch(getMedicalConditionsByQueryThunk(event.query));
    }
  };

  const handleSelectMedicalConditons = (values: IMedicine[]) => {
    setValue("medicalConditions", values);
  };

  const handleSelectedAllergies = (values: IMedicine[]) => {
    setValue("allergies", values);
  };
  const { errorToast, toast } = useToast();

  const TestFooterFormat = () => {
    return (
      <div className="text-end px-4 text-md py-2">
        <PrimeButton
          className="bg-primary font-secondary py-2 px-6 text-white rounded-md"
          label="OK"
          type="button"
          onClick={() => {
            multiSelectRef?.current && multiSelectRef.current.hide();
          }}
        />
      </div>
    );
  };

  const confirmEdit = () => {
    confirmDialog({
      header: "Confirmation",
      className: "max-w-[50vw]",
      message: DIALOG_WARNING,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      accept,
    });
  };

  const confirmCancle = () => {
    confirmDialog({
      header: "Confirmation",
      className: "max-w-[50vw]",
      message: DIALOG_WARNING,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      accept() {
        goBack();
      },
    });
  };

  const accept = () => {
    navigate(PATH_NAME.EDIT_PROFILE, {
      state: { from: PATH_NAME.HEALTH_RECORDS },
    });
  };

  const goBack = () => {
    navigate(PATH_NAME.HOME);
  };

  const handleConfirmation = (value: boolean) => {
    if (value) {
      const dateOfAppointment = formData.dateOfAppointment;
      const hours = formData.scheduledTime.getHours();
      const minutes = formData.scheduledTime.getMinutes();
      dateOfAppointment.setHours(hours);
      dateOfAppointment.setMinutes(minutes);
      const payload: ICreateAppointmentPayload = {
        current_condition_id:
          patient?.medicalConditionsAndAllergies?.current_condition_id || "",
        other_condition_id:
          patient?.medicalConditionsAndAllergies?.additional_condition_id || "",
        current_allergy_id:
          patient?.medicalConditionsAndAllergies?.current_allergy_id || "",
        other_allergy_id:
          patient?.medicalConditionsAndAllergies?.additional_allergy_id || "",
        current_allergy: formData.allergies,
        current_medical_condition: formData?.medicalConditions,
        date_of_appointment: dateOfAppointment.toISOString(),
        other_medical_condition: formData?.otherAllergies?.length
          ? formData?.otherMedicalConditions?.map((condition) => {
              return { system: SYSTEM, code: CODE, display: condition };
            })
          : ([] as IMedicine[]),
        other_reason: formData.otherReasonForTest,
        patientid: patient?.basicDetails?.id,
        reason_for_test: formData?.testReason?.name,
        schedule_time: formData?.scheduledTime.toISOString(),
        test_to_take: formData?.testToTake,
        other_allergy: formData?.otherAllergies?.length
          ? formData?.otherAllergies?.map((allergy) => {
              return { system: SYSTEM, code: CODE, display: allergy };
            })
          : ([] as IMedicine[]),
      };
      dispatch(createAppointmentThunk(payload)).then((response) => {
        if (response?.meta.requestStatus === RESPONSE.FULFILLED) {
          setShowDialog(value);
        } else {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to create Appointment", errorResponse?.message);
        }
      });
    }
    setShowConfirmDialog(false);
  };

  const validateScheduledTime = (appointmentTime: Date) => {
    const currentDate = new Date();
    const hours = appointmentTime.getHours();
    const minutes = appointmentTime.getMinutes();
    const selectedDateTime = new Date(appointmentDate);
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);
    if (selectedDateTime < currentDate) {
      return "Scheduled time must be in the future.";
    } else {
      return true;
    }
  };

  const getNameAndGender = () => {
    const firstName = patient?.basicDetails?.firstName || "-";
    const middleName = patient?.basicDetails?.middleName || "";
    const lastName = patient?.basicDetails?.lastName || "";
    const gender = patient?.basicDetails?.gender || "-";
    return `${firstName} ${middleName} ${lastName} (${gender})`;
  };

  const validateLocation = (value: ILocation) => {
    if (!value && selectedServiceType === SERVICE_LOCATION.CENTER) {
      return "Location is required.";
    } else {
      return true;
    }
  };

  const panelHeaderTemplate = () => {
    const columnHeaders = [
      { lable: "Test Name", classNames: "w-[50%]" },
      { lable: "Service Center", classNames: "w-[20%] text-center" },
      { lable: "At Home", classNames: "w-[10%] text-center" },
      { lable: "Telehealth Visit", classNames: "w-[20%] text-center" },
    ];
    return (
      <div className="w-[100%] border-b">
        <div
          className="header test-sm p-2 flex"
          style={{ width: "calc(100% - 35px)" }}
        >
          {columnHeaders.map((columnHeader, index) => (
            <div
              key={index}
              className={`${columnHeader.classNames} capitalize`}
            >
              {columnHeader.lable}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const itemTemplate = (value: ILabTestService) => {
    return (
      <div className="flex w-full">
        <div className="w-[50%]">{value?.display || "-"}</div>
        <div className="w-[20%] text-center">
          {value.currency_symbol + value?.center_price || "0"}
        </div>
        <div className="w-[10%] text-center">
          {value.currency_symbol + value?.home_price || "0"}
        </div>
        <div className="w-[20%] text-center capitalize">
          {value?.is_telehealth_required ? "Yes" : "No"}
        </div>
      </div>
    );
  };

  return (
    <>
      <form
        className="h-[calc(100vh-150px)]"
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => {
          handleKeyPress(event);
        }}
      >
        <div className="flex mx-4 justify-between items-center bg-gray-100">
          <BackButton
            showConfirmDialog={true}
            previousPage="Home"
            currentPage="Make Appointment"
            backLink={PATH_NAME.HOME}
          />
          <div className="flex py-2 justify-between items-center">
            <Button
              onClick={confirmCancle}
              className="ml-3 font-primary text-md"
              variant="primary"
              type="button"
              style="link"
              size="medium"
            >
              <i className="pi pi-times me-2" />
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit}
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              size="medium"
              type="submit"
            >
              <i className="pi pi-check me-2" />
              Confirm
            </Button>
          </div>
        </div>
        <div className="p-6 mx-4 bg-white rounded-xl max-h-[100%] overflow-auto">
          <div className="font-primary text-xl flex items-center">
            Appointment Details
            <TestPricing
              tableHeader="View Test Pricing"
              selectedIndex={PRICING_INDEX.CLINICAL_LABORATORY}
            />
          </div>
          <div className="grid grid-cols-4 mt-1 gap-4">
            <div className="xl:col-span-3 col-span-4 test w-full relative">
              <label
                htmlFor="testToTake"
                className="block text-sm font-medium input-label"
              >
                Choose test to be taken*
              </label>
              <Controller
                name="testToTake"
                control={control}
                rules={{
                  required: "Test to be taken is required",
                }}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    title={field?.value?.map((test) => test.display).join(", ")}
                    inputId="testToTake"
                    optionLabel="display"
                    ref={multiSelectRef}
                    options={tests}
                    resetFilterOnHide
                    filter
                    itemTemplate={(value) => itemTemplate(value)}
                    panelHeaderTemplate={panelHeaderTemplate}
                    showSelectAll={false}
                    panelFooterTemplate={<TestFooterFormat />}
                    placeholder="Select Tests"
                    data-testid="select-tests"
                    showClear={true}
                    panelClassName="test-list"
                    appendTo="self"
                    className="input-field font-secondary test-multiselect"
                    maxSelectedLabels={4}
                    selectedItemsLabel={
                      field?.value?.length + " Tests Selected"
                    }
                  />
                )}
              />
              {errors.testToTake && (
                <ErrorMessage message={errors.testToTake.message} />
              )}
            </div>
            <div className="lg:col-span-1 md:col-span-2 col-span-4 relative">
              <label className="input-label block capitalize">
                total price
              </label>
              <div className="border-b h-[2.5rem] pt-3">
                ${totalCost || "0"}
              </div>
            </div>
            <div className="xl:col-span-1 md:col-span-2 col-span-4 relative">
              <label className="input-label block">
                Planning to take test at?
              </label>
              <Controller
                control={control}
                name="serviceType"
                defaultValue="service center"
                render={({ field }) => (
                  <ServiceOptions
                    value={field.value}
                    onChange={(value: TServiceLocationType) => {
                      setValue("serviceType", value);
                    }}
                  />
                )}
              />
            </div>
            <div className="xl:col-span-1 lg:col-span-2 col-span-4 relative">
              <Controller
                name="location"
                control={control}
                rules={{
                  validate: (value) => validateLocation(value),
                }}
                render={({ field }) => (
                  <LocationDropDown
                    disabled={selectedServiceType === SERVICE_LOCATION.HOME}
                    value={field.value}
                    onChange={field.onChange}
                    options={locations}
                  />
                )}
              />
              {errors.location && (
                <ErrorMessage message={errors.location?.message} />
              )}
            </div>
            <div className="xl:col-span-1 lg:col-span-2 col-span-4 relative">
              <label htmlFor="appointmentDate" className="block input-label">
                Date of appointment for test*
              </label>
              <div className="relative">
                <Controller
                  name="dateOfAppointment"
                  control={control}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      onChange={(e) => {
                        e?.target?.value &&
                          setValue("dateOfAppointment", e.target.value);
                        setValue(
                          "scheduledTime",
                          e?.target?.value || new Date()
                        );
                        trigger("scheduledTime");
                      }}
                      inputId="appointmentDate"
                      placeholder="Please pick the date of appointment"
                      aria-label="Please pick the date of appointment"
                      inputClassName="rounded-lg"
                      dateFormat={DATE_FORMAT.DD_MM_YY}
                      className="input-field"
                      icon="pi pi-calendar-minus"
                      inputStyle={{ borderRadius: "16px" }}
                      showIcon={true}
                      minDate={new Date()}
                    />
                  )}
                />
              </div>
            </div>
            <div className="xl:col-span-1 lg:col-span-2 col-span-4 relative">
              <label htmlFor="scheduleTime" className="block input-label">
                Scheduled Time*
              </label>
              <div className="relative">
                <Controller
                  name="scheduledTime"
                  control={control}
                  rules={{
                    validate: (value) => validateScheduledTime(value),
                    required: "Scheduled time is required",
                  }}
                  defaultValue={addMinutes(new Date(), +1)}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      onChange={(e) => {
                        e?.target?.value &&
                          setValue("scheduledTime", e.target.value);
                        trigger("scheduledTime");
                      }}
                      ref={timerRef}
                      inputId="scheduleTime"
                      showIcon={true}
                      placeholder="Pick the appointment time"
                      icon="pi pi-clock"
                      hourFormat="12"
                      className="input-field"
                      inputClassName="rounded-lg"
                      inputStyle={{ borderRadius: "16px" }}
                      timeOnly
                      showTime
                    />
                  )}
                />
                {errors.scheduledTime && (
                  <ErrorMessage message={errors.scheduledTime.message} />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-3 mt-2">
            <div className="xl:col-span-1 col-span-2">
              <label htmlFor="testReason" className="input-label">
                Reason For Test*
              </label>
              <div className="flex flex-row rounded-md">
                <Controller
                  name="testReason"
                  control={control}
                  rules={{
                    required: "Reason For Test is  required",
                  }}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      onChange={(event) => {
                        clearErrors("otherReasonForTest");
                        setValue("testReason", event.value);
                        if (event.value.name !== "Other") {
                          setValue("otherReasonForTest", "");
                          trigger("testReason");
                          trigger("otherReasonForTest");
                        }
                      }}
                      inputId="testReason"
                      options={reasonsForTest}
                      optionLabel="name"
                      placeholder="Select Test Reason"
                      aria-label="Select test reason"
                      className="w-full border border-gray-300 rounded-lg pe-2 h-[2.5rem] test-dropdown"
                    />
                  )}
                />
              </div>
              {errors.testReason && (
                <ErrorMessage message={errors.testReason.message} />
              )}
            </div>
            <div className="xl:col-span-1 lg:col-span-2 col-span-4 relative">
              <label htmlFor="reasonDetails" className="input-label">
                Other reason
              </label>

              <Controller
                name="otherReasonForTest"
                control={control}
                rules={{
                  required:
                    reasonForTest?.name === "Other"
                      ? "Other reason is required"
                      : false,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="reasonDetails"
                    onChange={(e) => {
                      setValue("otherReasonForTest", e.target.value);
                      trigger("otherReasonForTest");
                    }}
                    disabled={reasonForTest?.name !== "Other"}
                    type="text"
                    className="cimpar-input py-[.6rem] h-[2.5rem] focus:outline-none font-tertiary"
                    placeholder="Type the test reason here"
                  />
                )}
              />
              {errors.otherReasonForTest && (
                <ErrorMessage message={errors.otherReasonForTest?.message} />
              )}
            </div>
          </div>
          <div className="font-primary text-xl py-2">Medical Condition</div>
          <>
            <label htmlFor="medicalConditions" className="block input-label">
              Please select the medical conditions you currently have.
              <Controller
                name="medicalConditions"
                control={control}
                render={({ field }) => (
                  <CustomAutoComplete
                    handleSearch={searchMedicalConditions}
                    inputId="medicalConditions"
                    handleSelection={handleSelectMedicalConditons}
                    items={filteredConditions}
                    selectedItems={field.value}
                  />
                )}
              />
            </label>
          </>
          <div className="pt-4 relative">
            <label
              className="block input-label"
              htmlFor="otherMedicalConditions"
            >
              Other medical conditions.
            </label>
            <Controller
              name="otherMedicalConditions"
              control={control}
              render={({ field }) => (
                <>
                  <Chips
                    {...field}
                    value={field.value}
                    addOnBlur={true}
                    allowDuplicate={false}
                    inputId="otherMedicalConditions"
                    className="min-h-[2.5rem] border border-gray-300 p-1 block w-full rounded-md"
                    placeholder={
                      !field?.value?.length
                        ? "Enter your Medical Condition(s), seperated by commos"
                        : ""
                    }
                    removeIcon={"pi pi-times"}
                    separator=","
                  />
                  {!!field?.value?.length && (
                    <div className="flex top-[1.2rem] items-center clear-button">
                      <span
                        className="cursor-pointer"
                        onClick={() => setValue("otherMedicalConditions", [])}
                      >
                        Clear all
                      </span>
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">Allergies</div>
          <>
            <label className="block input-label" htmlFor="allergies">
              Please select the allergies you currently have.
              <Controller
                name="allergies"
                control={control}
                render={({ field }) => (
                  <CustomAutoComplete
                    handleSearch={searchAllergies}
                    inputId="allergies"
                    items={
                      filteredAllergies
                        ? filteredAllergies
                        : ([] as IMedicine[])
                    }
                    selectedItems={field.value}
                    handleSelection={handleSelectedAllergies}
                  />
                )}
              />
            </label>
          </>
          <div className="pt-4 relative">
            <label className="block input-label" htmlFor="otherAllergies">
              Other allergies.
            </label>
            <Controller
              name="otherAllergies"
              control={control}
              render={({ field }) => (
                <>
                  <Chips
                    {...field}
                    addOnBlur={true}
                    allowDuplicate={false}
                    inputId="otherAllergies"
                    className="min-h-[2.5rem] border border-gray-300 p-1 block w-full rounded-md"
                    placeholder={
                      !field?.value?.length
                        ? "Enter your allergy(ies) names, separated by commas."
                        : ""
                    }
                    removeIcon={"pi pi-times"}
                    separator=","
                  />
                  {!!field?.value?.length && (
                    <div className="flex top-[1.2rem] items-center clear-button">
                      <span
                        className="cursor-pointer"
                        onClick={() => setValue("otherAllergies", [])}
                      >
                        Clear all
                      </span>
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <div className="font-primary flex  items-center text-xl pt-4 pb-2">
            Basic Details
            <span>
              <ConfirmDialog />
              <span className="card flex flex-wrap gap-2 justify-content-center">
                <Button
                  style="link"
                  className="ps-3  inline text-[#61277F]"
                  onClick={confirmEdit}
                >
                  <i className="pi pi-pencil px-2" /> Edit
                </Button>
              </span>
            </span>
          </div>
          <div className="grid grid-cols-4">
            <DetailColumn
              label="Name (Gender)"
              styleClass="lg:col-span-1 col-span-2"
              content={getNameAndGender()}
            />
            <DetailColumn
              label="DOB (Age)"
              content={getDobAndAge(patient?.basicDetails?.dob) || ""}
            />
            <div className="col-span-2">
              <DetailColumn
                styleClass="lg:col-span-2 col-span-4"
                label="insurance provider & number"
                content={getPolicyDetails(patient?.InsuranceDetails) || ""}
              />
            </div>
          </div>
        </div>
      </form>
      {showDialog && (
        <CustomModal
          showCloseButton={true}
          styleClass="w-[30rem] h-[15rem] bg-white"
          handleClose={() => {
            setShowDialog(false);
            navigate(PATH_NAME.HOME);
          }}
        >
          <AppointmentStatus />
        </CustomModal>
      )}
      {showConfirmDialog && (
        <CustomModal
          isDismissable="no"
          closeButtonTitle={DIALOG_WARNING}
          header={
            <div className="font-primary text-2xl w-full py-2 px-2">
              Appointment Summary
            </div>
          }
          showCloseButton={true}
          handleClose={() => {
            setShowConfirmDialog(false);
            navigate(PATH_NAME.HOME);
          }}
          styleClass="md:w-[40rem] md:h-[35rem] bg-white"
        >
          <PreviewAppointment
            totalCost={totalCost}
            details={formData}
            handleResponse={handleConfirmation}
          />
        </CustomModal>
      )}
      <Toast ref={toast} />
    </>
  );
};

const DetailColumn = ({
  label,
  content,
  styleClass,
}: {
  label: string;
  content: string;
  styleClass?: string;
}) => {
  return (
    <div className={`w-full ${styleClass && styleClass}  min-h-[50px]`}>
      <label className="uppercase block text-[#283956] opacity-65 text-sm font-secondary">
        {label || "-"}
      </label>
      <div className="w-full font-primary text-md capitalize">
        {content || "-"}
      </div>
    </div>
  );
};

const AppointmentStatus = () => {
  const navigate = useNavigate();
  const { updateHeaderTitle } = useContext(HeaderContext);

  const handleResponse = () => {
    navigate(PATH_NAME.TEST_RESULT);
    updateHeaderTitle("Health Records");
  };

  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center">
        <img src={checkmark} alt="Appointment status" />
      </div>
      <label className="font-primary py-4 text-center">
        Your Appointment has been Successfully fixed.
      </label>
      <div className="flex justify-between text-sm w-full">
        <Button
          setFocus={true}
          onClick={handleResponse}
          className="font-primary w-[13rem] focus:border focus:border-purple-1000 "
          style="outline"
        >
          <HomeIcon className="stroke-purple-900 pe-1" />
          Go to Health Records
        </Button>
        <Button
          className="font-primary w-[13rem] bg-white justify-center"
          onClick={() => navigate(PATH_NAME.HOME)}
          style="outline"
        >
          <AddRecord className="stroke-purple-900 pe-1" /> Add New Service
        </Button>
      </div>
    </div>
  );
};

export default AppointmentForm;
