import ReactDatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-clock/dist/Clock.css";
import { useRef, useState } from "react";
import "react-time-picker/dist/TimePicker.css";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import plus from "../../assets/icons/plus.svg";
import "./AppointmentPage.css";
import Button from "../Button";
import { Link } from "react-router-dom";
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

  // const [testReason, setTestReason] = useState("");
  const [selectedMedicalConditions, setSelectedMedicalConditons] = useState<
    IItem[]
  >([]);
  const [selectedAllergies, setSelectedAllergies] = useState<IItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const datePickerRef = useRef<ReactDatePicker<never, undefined>>(null);

  //TODO: need to write the logic to handle formSubmit
  const handleFormSubmit = (data: IFormData) => {
    console.log("form submitted");
    setShowDialog(true);
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
  const reasonForTest = watch("testReason");

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
            <Link to="/">
              <Button
                onClick={() => {}}
                className="ml-3 font-primary"
                variant="primary"
                type="reset"
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
          <div className="flex flex-wrap mt-1">
            <div className="test w-full lg:w-1/2 md:w-full sm:w-full pe-4">
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
                    options={tests}
                    filter
                    optionLabel="name"
                    placeholder="Select Tests"
                    className="input-field"
                  />
                )}
              />
              {errors.testToTake && (
                <span className="text-red-500 text-xs ">
                  {errors.testToTake.message}
                </span>
              )}
            </div>
            <div className="lg:w-1/4 md:w-1/2 sm:w-1 d-flex relative">
              <label htmlFor="appointmentDate" className="block input-label">
                Date of appointment for test*
              </label>
              <div className="absolute left-0 right-0">
                <Controller
                  name="dateOfAppointment"
                  control={control}
                  defaultValue={new Date()}
                  rules={{
                    required: "Date of appointment is required",
                  }}
                  render={({ field }) => (
                    <ReactDatePicker
                      placeholderText="Please pick the date of appointment"
                      required={true}
                      ref={datePickerRef}
                      minDate={new Date()}
                      wrapperClassName="w-full"
                      calendarIconClassname="right-0 mt-2"
                      id="appointmentDate"
                      dateFormat={"dd MMMM, yyyy"}
                      onChange={(date) => setValue("dateOfAppointment", date)}
                      selected={field.value}
                      className="h-[2.5rem] ps-2 border border-gray-300 px-1 block w-[100%] mt-1 md:text-sm rounded-md right-0 left-0 focus:outline-none"
                    />
                  )}
                />
                <span
                  className="absolute top-[1rem] right-[1rem]"
                  onClick={() => datePickerRef?.current?.setOpen(true)}
                ></span>
              </div>
            </div>
            <div className="lg:w-1/4 md:w-1/2 sm:w-1 lg:pe-0 lg:ps-4 md:px=4">
              <label htmlFor="scheduleTime" className="block input-label">
                Scheduled Time*
              </label>
              <Controller
                name="scheduledTime"
                control={control}
                defaultValue={""}
                rules={{
                  required: "Date of appointment is required",
                }}
                render={({ field }) => (
                  <TimePicker
                    minutePlaceholder="MM"
                    hourPlaceholder="HH"
                    value={field.value}
                    id="scheduleTime"
                    className="timePicker w-full h-[2.5rem] mt-1 rounded-md border border-gray-300"
                    format="hh:mm a"
                    clearIcon=""
                    closeClock={true}
                    onChange={(time) =>
                      time && setValue("scheduledTime", time?.toString())
                    }
                  />
                )}
              />
              {errors.scheduledTime && (
                <ErrorMessage message={errors.scheduledTime.message} />
              )}
            </div>
          </div>
          <div className="flex flex-wrap py-3 mt-2">
            <div className="lg:w-1/2 pe-4">
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
                <span className="text-red-500 text-xs ">
                  {errors.testReason.message}
                </span>
              )}
            </div>
            <div className="md:w-1/2 min-h-[50px]">
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
                className="cimpar-input py-[.6rem] focus:outline-none"
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
              className="cimpar-input focus:outline-none"
              type="text"
              placeholder="Mild concussion."
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
            <Link to="/editprofile">
              <Button style="link" className="ps-3  text-[#61277F]">
                <i className="pi pi-pencil px-2" /> Edit
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap">
            <DetailColumn
              label="Name (Gender)"
              content={
                user.firstName + " " + user.middleName + "(" + user.gender + ")"
              }
            />
            <DetailColumn label="DOB (Age)" content={getDobAndAge()} />
            <DetailColumn
              styleClass="md:w-1/2"
              label="insurance provider & number"
              content={user.insuranceName + " - " + user.insuranceNumber}
            />
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
    <div
      className={`w-full ${styleClass ? styleClass : "md:w-1/4"}  min-h-[50px]`}
    >
      <label className="uppercase block input-label">{label}</label>
      <div className="w-full text-md">{content}</div>
    </div>
  );
};

export const CustomAutoComplete = ({
  selectedItems,
  items,
  handleSelection,
  placeholder,
}: {
  placeholder?: string;
  selectedItems: IItem[];
  items: IItem[];
  handleSelection: (value: IItem[]) => void;
}) => {
  const [suggestions, setSuggestions] = useState<IItem[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let filteredItems;

      if (!event.query.trim().length) {
        filteredItems = [...items];
      } else {
        filteredItems = items.filter((item) => {
          return item.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }
      setSuggestions(filteredItems);
    }, 100);
  };

  const handleValueSelect = (event: AutoCompleteChangeEvent) => {
    if (event.value) {
      handleSelection(event.value);
    } else {
      handleSelection([]);
    }
  };

  return (
    <div className="border block border-gray-300 rounded-md flex flex-row justify-between items-center">
      <AutoComplete
        className="w-[90%]"
        field="name"
        multiple
        value={selectedItems}
        suggestions={suggestions}
        onChange={(event) => handleValueSelect(event)}
        completeMethod={search}
        itemTemplate={(option) => <ItemTemplate item={option} />}
        placeholder={placeholder ? placeholder : "Select or Add"}
        emptyMessage="No result found"
        showEmptyMessage={true}
        itemProp="py-0"
        removeTokenIcon={"pi pi-times"}
        panelClassName="custom-autocomplete-panel"
        panelStyle={{ left: "500px" }}
      />
      {Boolean(selectedItems.length) && (
        <span
          className="px-2 text-red-500 text-sm font-tertiary cursor-pointer min-w-[5rem]"
          onClick={() =>
            handleValueSelect({ value: [] } as AutoCompleteChangeEvent)
          }
        >
          Clear all
        </span>
      )}
    </div>
  );
};

const ItemTemplate = ({ item }: { item: IItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      key={item.id}
      className="flex align-items-center hover:text-cyan-800 w-full h-full py-4 justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="capitalize">{item.name}</div>
      {isHovered && <img src={plus} />}
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
        <Link to="/test-result">
          <Button className="font-primary w-[12rem]" style="outline">
            <i className="pi pi-check me-2"></i>Go to Lab Results
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AppointmentForm;
