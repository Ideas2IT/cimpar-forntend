import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-clock/dist/Clock.css";
import { useRef, useState } from "react";
import "react-time-picker/dist/TimePicker.css";
import "./AppointmentPage.css";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "../customModal/CustomModal";
import checkmark from "../../assets/icons/checkmark.svg";
import { Controller, useForm } from "react-hook-form";
import {
  ITest,
  allergies,
  medicalConditons,
  reasonsForTest,
  tests,
} from "../../assets/MockData";
import { MultiSelect } from "primereact/multiselect";
import { user } from "../userProfilePage/UserProfilePage";
import moment from "moment";
import BackButton from "../backButton/BackButton";
import { Dropdown } from "primereact/dropdown";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { MESSAGE, PATH_NAME } from "../../utils/AppConstants";
import { Calendar } from "primereact/calendar";
import { Button as PrimeButton } from "primereact/button";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";

export interface IItem {
  id: number;
  name: string;
}

export interface IFormData {
  testToTake: ITest[];
  dateOfAppointment: Date;
  scheduledTime: string;
  reasonForTest: string;
  testReason: IItem;
  otherReasonForTest: string;
  medicalConditions: IItem[];
  otherMedicalConditon: string;
  allergies: IItem[];
}

const AppointmentForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {} as IFormData,
  });

  const [selectedMedicalConditions, setSelectedMedicalConditons] = useState<
    IItem[]
  >([]);
  const [selectedAllergies, setSelectedAllergies] = useState<IItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const multiSelectRef = useRef<MultiSelect>(null);
  const reasonForTest = watch("testReason");
  const navigate = useNavigate();

  //TODO: need to write the logic to handle formSubmit
  const handleFormSubmit = (data: IFormData) => {
    confirm();
  };

  const handleSelectMedicalConditons = (values: IItem[]) => {
    setSelectedMedicalConditons(values);
    setValue("medicalConditions", values);
  };

  const handleSelectedAllergies = (values: IItem[]) => {
    setSelectedAllergies(values);
    setValue("allergies", values);
  };

  const getDobAndAge = () => {
    const dateOfBirth = moment(user.dob, "DD-MM-YYYY").format("DD MMMM, YYYY");
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    return dateOfBirth + " (" + age + ")";
  };

  //TODO: need to call appointment creation API
  const accept = () => {
    setShowDialog(true);
  };

  //TODO: need to handle the logic if user rejects the form submission
  const reject = () => {};

  const confirm = () => {
    confirmDialog({
      message: MESSAGE.APPOINTMENT_SUBMIT_WARNING,
      header: "Confirmation",
      icon: "pi pi-info-circle text-yellow-500",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  const TestFooterFormat = () => {
    return (
      <div className="text-end px-4 py-2">
        <PrimeButton
          label="Cancel"
          className="me-3 px-5 py-1 color-primary rounded-md border border-cyan-900"
          onClick={() => {
            setValue("testToTake", []);
            multiSelectRef?.current && multiSelectRef.current.hide();
          }}
        />
        <PrimeButton
          className="bg-primary py-1 px-5 text-white rounded-md"
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

  return (
    <>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
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
                className="ml-3 font-primary"
                variant="primary"
                type="button"
                style="link"
              >
                <i className="p" />
                <i className="pi pi-times me-2"></i>Cancel
              </Button>
            </Link>
            <Button
              onClick={() => handleSubmit}
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              type="submit"
            >
              <i className="pi pi-check me-2"></i>Confirm
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
                    inputId="testToTake"
                    {...field}
                    ref={multiSelectRef}
                    options={tests}
                    filter
                    showSelectAll={false}
                    panelFooterTemplate={<TestFooterFormat />}
                    optionLabel="name"
                    placeholder="Select Tests"
                    className="input-field"
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
                      placeholder="Please pick the date of appointment"
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
                  defaultValue={""}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      disableClock={true}
                      minutePlaceholder="MM"
                      hourPlaceholder="HH"
                      id="scheduleTime"
                      className="timePicker w-full h-[2.5rem] rounded-md border border-gray-300"
                      format="hh:mm a"
                      clearIcon={<i className="hidden" />}
                      closeClock={true}
                    />
                  )}
                />
                <span className="absolute pi pi-clock top-[1rem] right-[1rem]" />
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
                      className="w-full border border-gray-300 rounded-lg px-2 h-[2.8rem]"
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
                className="cimpar-input py-[.6rem] focus:outline-none font-tertiary"
                placeholder="Type the reason here (optional)"
              />
            </div>
          </div>
          <div className="font-primary text-xl py-2">Medical Condition</div>
          <div>
            <label htmlFor="medicalConditions" className="block input-label">
              Please select the medical conditions you currently have.
            </label>
            <CustomAutoComplete
              placeholder="Add one or more medical conditions"
              handleSelection={handleSelectMedicalConditons}
              items={medicalConditons}
              selectedItems={selectedMedicalConditions}
            />
          </div>
          <div className="pt-4">
            <label
              className="block input-label"
              htmlFor="otherMedicalConditions"
            >
              Other medical conditions.
            </label>
            <input
              {...register("otherMedicalConditon")}
              id="otherMedicalConditions"
              name={`otherMedicalConditon`}
              onChange={(event) =>
                setValue("otherMedicalConditon", event?.target?.value || "")
              }
              className="cimpar-input focus:outline-none font-sans"
              type="text"
              placeholder="Enter other medical Conditions"
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">Allergies</div>
          <div>
            <label className="block input-label" htmlFor="allergies">
              Please select the allergies you currently have.
            </label>
            <CustomAutoComplete
              placeholder="Add one or more allergies"
              items={allergies}
              selectedItems={selectedAllergies}
              handleSelection={handleSelectedAllergies}
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
                user.firstName + " " + user.middleName + "(" + user.gender + ")"
              }
            />
            <DetailColumn label="DOB (Age)" content={getDobAndAge()} />
            <div className="col-span-2">
              <DetailColumn
                label="insurance provider & number"
                content={user.insuranceName + " - " + user.insuranceNumber}
              />
            </div>
          </div>
        </div>
      </form>
      {showDialog && (
        <CustomModal
          showCloseButton={true}
          styleClass="w-[30rem] h-[15rem]"
          handleClose={() => {
            setShowDialog(false);
          }}
        >
          <AppointmentStatus />
        </CustomModal>
      )}
      <ConfirmDialog
        style={{ borderRadius: "16px" }}
        className="confirm-dialog"
        acceptClassName="px-5 mx-3 py-2 bg-purple-900 rounded-full text-white"
        rejectClassName="px-5 mx-3 py-2 border-purple-900 border rounded-full text-purple"
        maskStyle={{ backdropFilter: "red", background: "#55555530" }}
        closable={true}
        dismissableMask
      />
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
      <label className="uppercase block input-label">{label}</label>
      <div className="w-full text-md">{content}</div>
    </div>
  );
};

const AppointmentStatus = () => {
  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center">
        <img src={checkmark} alt="Appointment status" />
      </div>
      <label className="font-primary py-4 text-center">
        Your Appointment has been Successfully fixed.
      </label>
      <div className="flex justify-center">
        <Link to={PATH_NAME.TEST_RESULT}>
          <Button className="font-primary w-[12rem]" style="outline">
            <i className="pi pi-check me-2"></i>Go to Lab Results
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AppointmentForm;
