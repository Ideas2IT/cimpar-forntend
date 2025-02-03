import { addDays } from "date-fns";
import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import { Chips } from "primereact/chips";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "react-time-picker/dist/TimePicker.css";
import { IAzureBookingData, ICreateAppointmentPayload, ICreateAppointmentResponse } from "../../interfaces/appointment";
import { ErrorResponse, IGetPatientServicesPayload, ILabTestService, ITimeSlotPayload, } from "../../interfaces/common";
import { ILocation, ILocationResponse, TServiceLocationType, } from "../../interfaces/location";
import { IMedicine } from "../../interfaces/medication";
import { getDobAndAge, getPolicyDetails, getStringArrayFromObjectArray, handleKeyPress, } from "../../services/commonFunctions";
import { getPatientInsuranceThunk, getPatientMedicalConditionsThunk, selectSelectedPatient, } from "../../store/slices/PatientSlice";
import { createAppointmentThunk } from "../../store/slices/appointmentSlice";
import { getAllergiesByQueryThunk, getLabTestsForPatientThunk, getLocationsWithoutPaginationThunk, getMedicalConditionsByQueryThunk, getTimeSlotsByBookingIdAndCategoryThunk, getTimeSlotsForHomeThunk, selectAllergies, selectConditions, } from "../../store/slices/masterTableSlice";
import { updatePaymentStatusThunk } from "../../store/slices/paymentSlice";
import { AppDispatch } from "../../store/store";
import { CODE, DATE_FORMAT, DIALOG_WARNING, PATH_NAME, RESPONSE, SERVICE_CATEGORY_NAME, SERVICE_LOCATION, SERVICE_MENU, SYSTEM, TABLE } from "../../utils/AppConstants";
import { combineDateAndTimeToUTC, OutputTimeSlot, ServiceTimeSlotsDetail, transformAzureServiceSlotsResponse, } from "../../utils/BookingSlotUtils";
import { combineDateToUTc, dateFormatter, formatUTCToLocalTime, } from "../../utils/Date";
import Button from "../Button";
import BackButton from "../backButton/BackButton";
import MicrosoftBookingModal from "../bokingmodal/MicrosoftBookingModal";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import CustomModal from "../customModal/CustomModal";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PreviewAppointment from "../previewAppointment/PreviewAppointment";
import Payment from "../stripePayment/Payment";
import useToast from "../useToast/UseToast";
import "./AppointmentPage.css";
import AppointmentStatus from "./AppointmentStatusModal";
import LocationDropDown from "./LocationDropDown";
import ServiceOptions from "./ServiceOptions";
import TestPricing from "./TestPricing";

export interface IItem {
  id: number;
  name: string;
  value?: string;
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

const reasonsForTest: IItem[] = [
  { id: 1, name: "Usual checkup" },
  { id: 2, name: "Advised by doctor" },
  { id: 3, name: "Other" },
];

const AppointmentForm = () => {

  const navigate = useNavigate();

  const { service } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const patient = useSelector(selectSelectedPatient);
  const filteredAllergies = useSelector(selectAllergies);
  const filteredConditions = useSelector(selectConditions);

  const multiSelectRef = useRef<MultiSelect>(null);

  const { control, handleSubmit, setValue, watch, reset, clearErrors, formState: { errors, isDirty }, trigger, } = useForm({ defaultValues: {} as IFormData, });
  const reasonForTest = watch("testReason");
  const appointmentDate = watch("dateOfAppointment");
  const appointmentTime = watch("scheduledTime");
  const selectedTests = watch("testToTake");
  const selectedServiceType = watch("serviceType");
  const selectedLocation = watch("location");



  const [formData, setFormData] = useState<IFormData>({} as IFormData);
  const [tests, setTests] = useState<ILabTestService[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [searchTestName, setSearchTestName] = useState<string>("");
  const [appointmentResponse, setAppointmentResponse] = useState<ICreateAppointmentResponse>({} as ICreateAppointmentResponse);
  const [isOpenBooking, setIsOpenBooking] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [timeSlotDetail, setTimeSlotDetail] = useState<ServiceTimeSlotsDetail>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<OutputTimeSlot>({} as OutputTimeSlot);

  const filteredTests = tests.filter((option) => option.display.toLowerCase().includes(searchTestName.toLowerCase()));



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
    loadInputData();
    handleServiceLocationChange(SERVICE_LOCATION.HOME);
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


  const loadInputData = () => {
    fetchLabTestsForDropdown();
    fetchLocationsForDropdown();
    if (patient?.basicDetails?.id) {
      fetchInsuranceDetails()
      fetchMedicalConditions();
    }
  };

  const fetchLabTestsForDropdown = () => {
    dispatch(
      getLabTestsForPatientThunk({
        service_type: getServiceCategory(),
        tableName: TABLE.LAB_TEST,
        is_active: true,
      } as IGetPatientServicesPayload)
    ).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        if (response?.payload?.data?.length) {
          const _response = response.payload.data as ILabTestService[];
          setTests(_response);
        } else {
          setTests([]);
        }
      }
    });
  }

  const fetchLocationsForDropdown = () => {
    dispatch(getLocationsWithoutPaginationThunk()).then((response) => {
      const locations = response.payload as ILocationResponse;
      if (locations?.data?.length > 0) {
        setLocations(locations.data);
      }
    });
  }

  const fetchInsuranceDetails = () => {
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
  }

  const fetchMedicalConditions = () => {
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
  const calculateTotalCost = () => {
    if (selectedTests?.length) {
      const totalPrice = selectedTests.reduce((acc, service) => {
        if (selectedServiceType === SERVICE_LOCATION.HOME) {
          return acc + Number(service.home_price);
        } else {
          return acc + Number(service.center_price);
        }
      }, 0);
      setTotalCost(Number(totalPrice.toFixed(2)));
    } else {
      setTotalCost(0);
    }
  };

  const handleFormSubmit = (data: IFormData) => {
    setShowConfirmDialog(true);
    setFormData(data);
  };

  const getServiceCategory = () => {
    return SERVICE_CATEGORY_NAME[service ?? SERVICE_MENU.LABORATORY];
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

  const testFooterFormat = () => {
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
      header: "Confirm Cancellation",
      className: "max-w-[50vw]",
      message: DIALOG_WARNING,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      draggable: false,
      accept,
    });
  };

  const confirmCancle = () => {
    confirmDialog({
      header: "Confirm Cancellation",
      className: "max-w-[50vw]",
      message: DIALOG_WARNING,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      draggable: false,
      accept() {
        goBack();
      },
    });
  };

  const accept = () => {
    navigate(PATH_NAME.EDIT_PROFILE, {
      state: { from: `${PATH_NAME.CREATE_APPOINTMENT}/${service}` },
    });
  };

  const goBack = () => {
    navigate(PATH_NAME.HOME);
  };

  const handleConfirmation = (value: boolean) => {
    setShowConfirmDialog(false);
    if (value) {
      let azureBookingData: IAzureBookingData = {
        startDateTime: {
          dateTime: combineDateAndTimeToUTC(
            formData.dateOfAppointment,
            selectedTimeSlot.start
          ),
          timeZone: "UTC",
        },
        endDateTime: {
          dateTime: combineDateAndTimeToUTC(
            formData.dateOfAppointment,
            selectedTimeSlot.end
          ),
          timeZone: "UTC",
        },
        serviceId: timeSlotDetail?.serviceId ?? "",
        staffMemberIds: timeSlotDetail?.staffMemberIds || [],

        customers: [
          {
            "@odata.type": "#microsoft.graph.bookingCustomerInformation",
            name: `${patient?.basicDetails?.firstName || ""} ${patient?.basicDetails?.middleName || ""} ${patient?.basicDetails?.lastName || ""}`,
            emailAddress: patient.basicDetails.email,
          },
        ],
      };
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
        date_of_appointment:
          combineDateAndTimeToUTC(
            formData.dateOfAppointment,
            selectedTimeSlot.start
          ) || "",
        other_medical_condition: formData?.otherAllergies?.length
          ? formData?.otherMedicalConditions?.map((condition) => {
            return { system: SYSTEM, code: CODE, display: condition };
          })
          : ([] as IMedicine[]),
        other_reason: formData.otherReasonForTest,
        patientid: patient?.basicDetails?.id,
        reason_for_test: formData?.testReason?.name,
        schedule_time:
          combineDateAndTimeToUTC(
            formData.dateOfAppointment,
            selectedTimeSlot.start
          ) || "",
        test_to_take: formData?.testToTake,
        other_allergy: formData?.otherAllergies?.length
          ? formData?.otherAllergies?.map((allergy) => {
            return { system: SYSTEM, code: CODE, display: allergy };
          })
          : ([] as IMedicine[]),
        service_center_location: formData?.location?.center_name,
        service_type: getServiceCategory(),
        total_cost: totalCost,
        telehealth_required: true,
        test_location: formData?.serviceType,
        user_email: patient?.basicDetails?.email,
        azure_booking_data: azureBookingData,
        azure_booking_id: selectedLocation?.azure_booking_id || "",
      };
      dispatch(createAppointmentThunk(payload)).then((response) => {
        if (response?.meta.requestStatus === RESPONSE.FULFILLED) {
          const _response = response.payload as ICreateAppointmentResponse;
          setAppointmentResponse(_response);
          setShowPaymentModal(true);
        } else {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to create Appointment", errorResponse?.message);
        }
      });
    }
    setShowConfirmDialog(false);
  };

  const getNameAndGender = () => {
    return `${patient?.basicDetails?.firstName || ""} ${patient?.basicDetails?.middleName || ""} ${patient?.basicDetails?.lastName || ""} (${patient?.basicDetails?.gender || "-"})`;
  };

  const validateLocation = (value: ILocation) => {
    if (selectedServiceType === SERVICE_LOCATION.CENTER) {
      return value && Object.keys(value).length ? true : "Location is required";
    }
    return true;
  };

  const handleClosePaymentModal = () => {
    if (appointmentResponse?.client_secret) {
      dispatch(updatePaymentStatusThunk(appointmentResponse.client_secret));
    }
    setShowPaymentModal(false);
    setShowStatusDialog(true);
  };

  const loadSlots = (bookingId: string, category: string) => {
    if (!bookingId || !category) {
      return;
    }
    setBookingId(bookingId);
    dispatch(
      getTimeSlotsByBookingIdAndCategoryThunk({
        bookingId: bookingId,
        category: category,
      } as ITimeSlotPayload)
    ).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        let timeSlotData: ServiceTimeSlotsDetail | undefined = transformAzureServiceSlotsResponse(response.payload.data);
        setTimeSlotDetail(timeSlotData);
      } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Failed to load slot details", errorResponse?.message);
      }
    });
  };

  const handleChangeLocation = (locationValue: ILocation) => {
    setSelectedTimeSlot({} as OutputTimeSlot);
    setValue("location", locationValue);
    setValue("dateOfAppointment", addDays(new Date(), 1));
    trigger("location");
    loadSlots(locationValue.azure_booking_id, getServiceCategory());
  };

  const handleBookSlot = (date: Date, timeSlot: OutputTimeSlot) => {
    setIsOpenBooking(false);
    setValue("dateOfAppointment", new Date(combineDateToUTc(date, timeSlot.start)));
    setValue("scheduledTime", new Date(combineDateToUTc(date, timeSlot.start)));
    setSelectedTimeSlot(timeSlot);
  };

  const handleServiceLocationChange = (value: TServiceLocationType) => {
    setSelectedTimeSlot({} as OutputTimeSlot);
    setValue("dateOfAppointment", addDays(new Date(), 1));
    setValue("serviceType", value);
    setValue("location", {} as ILocation);
    if (value === SERVICE_LOCATION.HOME) {
      setBookingId("");
      dispatch(getTimeSlotsForHomeThunk()).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          let timeSlotData: ServiceTimeSlotsDetail | undefined = transformAzureServiceSlotsResponse(response.payload.data);
          setTimeSlotDetail(timeSlotData);
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to load slot details", errorResponse?.message);
        }
      });
    } else {
      setTimeSlotDetail({} as ServiceTimeSlotsDetail);
    }
  };

  const validateDate = () => {
    if (!Object.keys(selectedTimeSlot)?.length) {
      return "Time Slot is required";
    }
    return true;
  };


  const panelHeaderTemplate = () => {
    const columnHeaders = [
      { lable: "Available Tests", classNames: "w-[70%]" },
      { lable: "Service Center", classNames: "w-[20%] text-center" },
      { lable: "At Home", classNames: "w-[10%] text-center" },
    ];
    return (
      <>
        <div className="w-full mb-1">
          <InputText
            className="border w-full py-1 rounded"
            onChange={(event) => setSearchTestName(event.target.value)}
            placeholder="Enter Test Name to search..."
          />
        </div>
        <div className="w-[100%] border-b">
          <div
            className="header test-sm ps-2 pe-1 py-0 flex"
            style={{ width: "calc(100% - 35px)" }}
          >
            {columnHeaders.map((columnHeader) => (
              <div
                key={columnHeader.lable}
                className={`${columnHeader.classNames} capitalize`}
              >
                {columnHeader.lable}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const itemTemplate = (value: ILabTestService) => {
    return (
      <div
        className="flex w-full"
        title="Asterisk (*) denotes Telehealth is required"
      >
        <div className="w-[70%]">
          <span className="!inline">
            {value?.is_telehealth_required && (
              <span className="text-red-500 !inline">*</span>
            )}
            {value?.display || "-"}
          </span>
        </div>
        <div className="w-[20%] text-center">
          {value.currency_symbol + Number(value?.center_price)?.toFixed(2) || "0.00"}
        </div>
        <div className="w-[10%] text-center">
          {value.currency_symbol + Number(value?.home_price)?.toFixed(2) || "0"}
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
            previousPage={getServiceCategory() || ""}
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
              <i className="pi pi-times me-2" />Cancel
            </Button>
            <Button
              onClick={() => handleSubmit}
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              size="medium"
              type="submit"
            >
              <i className="pi pi-check me-2" />Review To Pay
            </Button>
          </div>
        </div>
        <div className="p-6 mx-4 bg-white rounded-xl max-h-[98%] overflow-auto">
          <div className="font-primary text-xl flex items-center">
            Appointment Details
            <TestPricing
              tableHeader="View Pricing"
              selectedTab={service ?? SERVICE_MENU.LABORATORY}
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
                    options={filteredTests}
                    resetFilterOnHide
                    filter
                    onHide={() => setSearchTestName("")}
                    itemTemplate={(value) => itemTemplate(value)}
                    panelHeaderTemplate={panelHeaderTemplate}
                    showSelectAll={false}
                    panelFooterTemplate={testFooterFormat}
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
              <span className="input-label block capitalize">Total price</span>
              <div className="border-b h-[2.5rem] pt-3">
                ${totalCost || "0"}
              </div>
            </div>
            <div className="xl:col-span-1 md:col-span-2 col-span-4 relative">
              <span className="input-label block">
                Planning to take test at*
              </span>
              <Controller
                control={control}
                name="serviceType"
                defaultValue={SERVICE_LOCATION.HOME}
                render={({ field }) => (
                  <ServiceOptions
                    value={field.value}
                    onChange={(value: TServiceLocationType) =>
                      handleServiceLocationChange(value)
                    }
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
                    onChange={handleChangeLocation}
                    options={locations}
                  />
                )}
              />
              {errors.location && (
                <ErrorMessage message={errors.location?.message} />
              )}
            </div>
            {!Object.keys(selectedTimeSlot).length ? (
              <Controller
                control={control}
                name="dateOfAppointment"
                rules={{
                  validate: () => validateDate(),
                  required: "Date of appointment is required",
                }}
                render={() => (
                  <div
                    className="relative lg:col-span-2 col-span-4"
                  >
                    <div className="flex items-center h-[5rem]">
                      <i className="pi pi-calendar text-purple-900 pe-1" />
                      <button type="button"
                        className="text-purple-900 font-primary hover:underline"
                        onClick={() => setIsOpenBooking(true)}
                      >
                        Book Your Slot Here
                      </button>
                    </div>
                    {errors.dateOfAppointment && (
                      <span className="absolute bottom-0">
                        <ErrorMessage
                          message={errors.dateOfAppointment.message}
                        />
                      </span>
                    )}
                  </div>
                )}
              />
            ) : (
              <div className="border-b lg:col-span-2 col-span-4 grid grid-cols-3">
                <div className="flex justify-evenly flex-col">
                  <span className="input-label block">
                    Date Of Appointment
                  </span>
                  <label className="font-primary">
                    {dateFormatter(appointmentDate, DATE_FORMAT.DD_MMMM_YYYY) ||
                      "-"}
                  </label>
                </div>
                <div className="flex justify-evenly flex-col">
                  <span className="input-label block">Scheduled Time</span>
                  <label className="font-primary">
                    {formatUTCToLocalTime(appointmentTime?.toISOString())}
                  </label>
                </div>
                <button type="button"
                  onClick={() => setIsOpenBooking(true)}
                  className="flex items-center text-purple-900 font-primary cursor-pointer"
                >
                  <i className="pi pe-1 pi-sync" />Change Your Slot
                </button>
              </div>
            )}
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
                        }
                        trigger("testReason");
                        trigger("otherReasonForTest");
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
                    className={`cimpar-input py-[.6rem] h-[2.5rem] focus:outline-none font-tertiary ${reasonForTest?.name !== "Other" && "cursor-not-allowed"}`}
                    placeholder="Type the test reason here"
                  />
                )}
              />
              {errors.otherReasonForTest && (
                <ErrorMessage message={errors.otherReasonForTest?.message} />
              )}
            </div>
          </div>
          <div className="font-primary text-xl py-2">Medical Conditions</div>
          <label htmlFor="medicalConditions" className="block input-label">
            Please select the medical conditions you currently have.
            <Controller
              name="medicalConditions"
              control={control}
              render={({ field }) => (
                <CustomAutoComplete
                  key="medicalConditons"
                  handleSearch={searchMedicalConditions}
                  inputId="medicalConditions"
                  handleSelection={handleSelectMedicalConditons}
                  items={filteredConditions}
                  selectedItems={field.value}
                />
              )}
            />
          </label>
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
                        ? "Enter your Medical Condition(s), seperated by commas"
                        : ""
                    }
                    removeIcon={"pi pi-times"}
                    separator=","
                  />
                  {!!field?.value?.length && (
                    <div className="flex top-[1.2rem] items-center clear-button">
                      <button type="button"
                        className="cursor-pointer"
                        onClick={() => setValue("otherMedicalConditions", [])}
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">Allergies</div>
          <label className="block input-label" htmlFor="allergies">
            Please select the allergies you currently have.
            <Controller
              name="allergies"
              control={control}
              render={({ field }) => (
                <CustomAutoComplete
                  key="allergies"
                  handleSearch={searchAllergies}
                  inputId="allergies"
                  items={
                    filteredAllergies || ([] as IMedicine[])
                  }
                  selectedItems={field.value}
                  handleSelection={handleSelectedAllergies}
                />
              )}
            />
          </label>
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
                      <button type="button"
                        className="cursor-pointer"
                        onClick={() => setValue("otherAllergies", [])}
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <div className="font-primary flex  items-center text-xl pt-4 pb-2">Basic Details
            <div>
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
            </div>
          </div>
          <div className="grid grid-cols-4">
            <DetailColumn
              label="Name (Gender)"
              styleClass="lg:col-span-1 col-span-2"
              content={getNameAndGender()}
            />
            <DetailColumn
              label="DOB (Age)"
              content={getDobAndAge(patient?.basicDetails?.dob) ?? ""}
            />
            <div className="col-span-2">
              <DetailColumn
                styleClass="lg:col-span-2 col-span-4"
                label="insurance provider & number"
                content={getPolicyDetails(patient?.InsuranceDetails) ?? ""}
              />
            </div>
          </div>
        </div>
      </form >
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
          styleClass="lg:w-[60vw] lg:h-[90vh] w-full bg-white"
        >
          <PreviewAppointment
            totalCost={totalCost}
            details={formData}
            handleResponse={handleConfirmation}
          />
        </CustomModal>
      )
      }
      {
        showPaymentModal && (
          <CustomModal
            handleClose={handleClosePaymentModal}
            closeButtonTitle=""
            showCloseButton={true}
            styleClass=""
            header={<span className="ps-4">Payment</span>}
          >
            <div className="py-2">
              <Payment
                clientSecretKey={appointmentResponse?.client_secret}
                appointmentId={appointmentResponse?.appointment_id}
                handleClose={handleClosePaymentModal}
              />
            </div>
          </CustomModal>
        )
      }
      {
        showStatusDialog && (
          <CustomModal
            showCloseButton={true}
            styleClass="w-[30rem] h-[17rem] bg-white"
            handleClose={() => {
              setShowStatusDialog(false);
              navigate(PATH_NAME.HOME);
            }}
          >
            <AppointmentStatus
              status={"pending"}
              onRetry={() => {
                setShowStatusDialog(false);
              }}
            />
          </CustomModal>
        )
      }
      {
        isOpenBooking && (
          <CustomModal
            showCloseButton={true}
            header={<span className="ps-3">Book Your Appointment</span>}
            handleClose={() => setIsOpenBooking(false)}
            styleClass="w-[50rem] h-[35rem]"
          >
            <MicrosoftBookingModal
              selectedSlotTime={selectedTimeSlot}
              selectedSlotDate={appointmentDate}
              timeSlotDetails={timeSlotDetail}
              handleBookSlot={(date, time) => handleBookSlot(date, time)}
              handleCancel={() => setIsOpenBooking(false)}
              bookingId={bookingId}
              category={getServiceCategory()}
            />
          </CustomModal>
        )
      }
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
    <div className={`w-full ${styleClass}  min-h-[50px]`}>
      <label className="uppercase block text-[#283956] opacity-65 text-sm font-secondary">
        {label || "-"}
      </label>
      <div className="w-full font-primary text-md capitalize">
        {content || "-"}
      </div>
    </div>
  );
};
export default AppointmentForm;
