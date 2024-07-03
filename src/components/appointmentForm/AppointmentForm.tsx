import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { useContext, useEffect, useRef, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "react-time-picker/dist/TimePicker.css";
import { ITest, reasonsForTest, tests } from "../../assets/MockData";
import checkmark from "../../assets/icons/checkmark.svg";
import HeaderContext from "../../context/HeaderContext";
import {
  getDobAndAge,
  // getDobAndAge,
  getPolicyDetails,
  handleKeyPress,
} from "../../services/commonFunctions";
import {
  getPatientInsuranceThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import {
  getAllergiesByQueryThunk,
  getMedicalConditionsByQueryThunk,
  selectAllergies,
  selectConditions,
} from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import { PATH_NAME } from "../../utils/AppConstants";
import Button from "../Button";
import BackButton from "../backButton/BackButton";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import CustomModal from "../customModal/CustomModal";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PreviewAppointment from "../previewAppointment/PreviewAppoinement";
import "./AppointmentPage.css";

export interface IItem {
  id: number;
  name: string;
}

export interface IFormData {
  testToTake: ITest[];
  dateOfAppointment: Date;
  scheduledTime: Date;
  reasonForTest: string;
  testReason: IItem;
  otherReasonForTest: string;
  medicalConditions: string[];
  otherMedicalConditions: string[];
  allergies: string[];
  otherAllergies: string[];
}

const AppointmentForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {} as IFormData,
  });

  const [selectedMedicalConditions, setSelectedMedicalConditons] = useState<
    string[]
  >([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const patient = useSelector(selectSelectedPatient);
  const [showDialog, setShowDialog] = useState(false);
  const multiSelectRef = useRef<MultiSelect>(null);
  const reasonForTest = watch("testReason");
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({} as IFormData);
  const dispatch = useDispatch<AppDispatch>();
  const initialRender = useRef(true);

  //TODO: need to write the logic to handle formSubmit
  const handleFormSubmit = (data: IFormData) => {
    setShowConfirmDialog(true);
    setFormData(data);
  };

  const filteredAllergies = useSelector(selectAllergies);
  const filteredConditions = useSelector(selectConditions);

  useEffect(() => {
    if (initialRender?.current) {
      initialRender.current = false;
      return;
    }
    if (patient?.basicDetails?.id) {
      dispatch(getPatientInsuranceThunk(patient?.basicDetails?.id));
    }
  }, [patient?.basicDetails?.id]);

  const searchAllergies = (event: AutoCompleteCompleteEvent) => {
    if (event.query.trim().length > 1) {
      dispatch(getAllergiesByQueryThunk(event.query)).then((response) => {
        console.log(response);
      });
    }
  };

  const searchMedicalConditions = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      if (event.query.trim().length > 1) {
        dispatch(getMedicalConditionsByQueryThunk(event.query)).then(
          (response) => {
            console.log(response.payload);
          }
        );
      }
    }, 300);
  };

  const handleSelectMedicalConditons = (values: string[]) => {
    setSelectedMedicalConditons(values);
    setValue("medicalConditions", values);
  };

  const handleSelectedAllergies = (values: string[]) => {
    setSelectedAllergies(values);
    setValue("allergies", values);
  };

  const TestFooterFormat = () => {
    return (
      <div className="text-end px-4 text-md py-2">
        <PrimeButton
          label="Cancel"
          className="me-3 px-5 py-1 font-secondary color-primary rounded-md border border-cyan-900"
          onClick={() => {
            setValue("testToTake", []);
            multiSelectRef?.current && multiSelectRef.current.hide();
          }}
        />
        <PrimeButton
          className="bg-primary font-secondary py-1 px-5 text-white rounded-md"
          label="Select"
          onClick={() => {
            multiSelectRef?.current && multiSelectRef.current.hide();
          }}
        />
      </div>
    );
  };

  const handleEditUser = () => {
    navigate(PATH_NAME.EDIT_PROFILE, {
      state: { from: PATH_NAME.HEALTH_RECORDS },
    });
  };

  const handleConfirmation = (value: boolean) => {
    setShowDialog(value);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => {
          handleKeyPress(event);
        }}
      >
        <div className="flex mx-4 justify-between items-center bg-gray-100">
          <BackButton
            previousPage="Home"
            currentPage="Make Appointment"
            backLink="/"
          />
          <div className="flex py-2 justify-between items-center">
            <Link to={PATH_NAME.HOME}>
              <Button
                onClick={() => {}}
                className="ml-3 font-primary text-md"
                variant="primary"
                type="button"
                style="link"
                size="medium"
              >
                <i className="pi pi-times me-2" />
                Cancel
              </Button>
            </Link>
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
        <div className="p-6 mx-4 bg-white rounded-xl max-h-[100%]">
          <div className="font-primary text-xl">Appointment Details</div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-1 gap-4">
            <div className="md:col-span-2 test w-full relative">
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
                  required: "Test list can't be empty",
                }}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    inputId="testToTake"
                    ref={multiSelectRef}
                    options={tests}
                    filter
                    showSelectAll={false}
                    panelFooterTemplate={<TestFooterFormat />}
                    optionLabel="name"
                    placeholder="Select Tests"
                    data-testid="select-tests"
                    showClear={true}
                    className="input-field font-secondary"
                    maxSelectedLabels={4}
                  />
                )}
              />
              {errors.testToTake && (
                <ErrorMessage message={errors.testToTake.message} />
              )}
            </div>
            <div className="col-span-1 relative">
              <label htmlFor="appointmentDate" className="block input-label">
                Date of appointment for test*
              </label>
              <div className="relative">
                <Controller
                  name="dateOfAppointment"
                  control={control}
                  defaultValue={new Date()}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      onChange={(e) =>
                        e?.target?.value &&
                        setValue("dateOfAppointment", e.target.value)
                      }
                      inputId="appointmentDate"
                      placeholder="Please pick the date of appointment"
                      aria-label="Please pick the date of appointment"
                      inputClassName="rounded-lg"
                      dateFormat="dd MM, yy"
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
            <div className="sm:col-span-full md:col-span-2 lg:col-span-1 relative">
              <label htmlFor="scheduleTime" className="block input-label">
                Scheduled Time*
              </label>
              <div className="relative">
                <Controller
                  name="scheduledTime"
                  control={control}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      onChange={(e) => {
                        e?.target?.value &&
                          setValue("scheduledTime", e.target.value);
                        trigger("scheduledTime");
                      }}
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-3 mt-2">
            <div className="md:col-span-1 col-span-2">
              <label htmlFor="testReason" className="input-label">
                Reason for test*
              </label>
              <div className="flex flex-row rounded-md">
                <Controller
                  name="testReason"
                  control={control}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      inputId="testReason"
                      options={reasonsForTest}
                      optionLabel="name"
                      placeholder="Select test reason"
                      aria-label="Select test reason"
                      className="w-full border border-gray-300 rounded-lg pe-2 h-[2.5rem]"
                    />
                  )}
                />
              </div>
              {errors.testReason && (
                <ErrorMessage message={errors.testReason.message} />
              )}
            </div>
            <div className="md:col-span-1 col-span-2">
              <label htmlFor="reasonDetails" className="input-label">
                Other reason
              </label>
              <input
                id="reasonDetails"
                disabled={reasonForTest?.name !== "Other"}
                {...register("otherReasonForTest")}
                name={`otherReasonForTest`}
                onChange={(e) => setValue("otherReasonForTest", e.target.value)}
                type="text"
                className="cimpar-input py-[.6rem] h-[2.5rem] focus:outline-none font-tertiary"
                placeholder="Type the reason here (optional)"
              />
            </div>
          </div>
          <div className="font-primary text-xl py-2">Medical Condition</div>
          <>
            <label htmlFor="medicalConditions" className="block input-label">
              Please select the medical conditions you currently have.
            </label>
            <CustomAutoComplete
              handleSearch={searchMedicalConditions}
              inputId="medicalConditions"
              placeholder="Add one or more medical conditions"
              handleSelection={handleSelectMedicalConditons}
              items={filteredConditions}
              selectedItems={selectedMedicalConditions}
            />
          </>
          <div className="pt-4">
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
                <Chips
                  inputId="otherMedicalConditions"
                  {...field}
                  className="min-h-[2.5rem] border border-gray-300 p-1 block w-full rounded-md"
                  placeholder={
                    !field?.value?.length
                      ? "Enter your medication name(s), separated by commas"
                      : ""
                  }
                  removeIcon={"pi pi-times"}
                  separator=","
                />
              )}
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">Allergies</div>
          <>
            <label className="block input-label" htmlFor="allergies">
              Please select the allergies you currently have.
            </label>
            <CustomAutoComplete
              handleSearch={searchAllergies}
              inputId="allergies"
              placeholder="Add one or more allergies"
              items={filteredAllergies ? filteredAllergies : ([] as string[])}
              selectedItems={selectedAllergies}
              handleSelection={handleSelectedAllergies}
            />
          </>
          <div className="pt-4">
            <label className="block input-label" htmlFor="otherAllergies">
              Other allergies.
            </label>
            <Controller
              name="otherAllergies"
              control={control}
              render={({ field }) => (
                <Chips
                  inputId="otherAllergies"
                  {...field}
                  className="min-h-[2.5rem] border border-gray-300 p-1 block w-full rounded-md"
                  placeholder={
                    !field?.value?.length
                      ? "Enter your allergies name(s), separated by commas"
                      : ""
                  }
                  removeIcon={"pi pi-times"}
                  separator=","
                />
              )}
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">
            Basic Details
            <Button
              style="link"
              className="ps-3  text-[#61277F]"
              onClick={handleEditUser}
            >
              <i className="pi pi-pencil px-2" /> Edit
            </Button>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            <DetailColumn
              label="Name (Gender)"
              content={
                patient?.basicDetails?.firstName +
                " " +
                patient?.basicDetails?.middleName +
                "(" +
                patient?.basicDetails?.gender +
                ")"
              }
            />
            <DetailColumn
              label="DOB (Age)"
              content={getDobAndAge(patient?.basicDetails?.dob) || ""}
            />
            <div className="col-span-2">
              <DetailColumn
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
          }}
        >
          <AppointmentStatus />
        </CustomModal>
      )}
      {showConfirmDialog && (
        <CustomModal
          header={
            <div className="font-primary text-2xl w-full py-2 px-2">
              Appointment Summary
            </div>
          }
          showCloseButton={true}
          handleClose={() => setShowConfirmDialog(false)}
          styleClass="md:w-[40rem] md:h-[35rem] bg-white"
        >
          <PreviewAppointment
            details={formData}
            handleResponse={handleConfirmation}
          />
        </CustomModal>
      )}
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
      <div className="w-full font-primary text-md">{content || "-"}</div>
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
      <div className="flex justify-center">
        <Button
          onClick={handleResponse}
          className="font-primary w-[12rem]"
          style="outline"
        >
          <i className="pi pi-check me-2"></i>Go to Lab Results
        </Button>
      </div>
    </div>
  );
};

export default AppointmentForm;
