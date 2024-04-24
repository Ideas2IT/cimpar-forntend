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
import styles from "./AppointmentPage.module.scss";
import { RadioButton } from "primereact/radiobutton";
import { FaRegCalendarMinus } from "react-icons/fa";
import { Button as PrimeButton } from "primereact/button";
import Button from "../Button";
import { Link } from "react-router-dom";
import CustomModal from "../customModal/CustomModal";
import checkmark from "../../assets/icons/checkmark.svg";
import { DEFAULT_DATE_FORMAT } from "../../utils/Date";

interface IItem {
  id: number;
  name: string;
}

const AppointmentForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState("");

  const diseases = [
    "Bubonic Plague",
    "Spanish flu or Influenza",
    "Smallpox",
    "Cholera",
    "HIV/AIDS",
    "Ebola",
    "Coronavirus",
  ];

  const medicalConditons: IItem[] = [
    { id: 1, name: "dfdfbc" },
    { id: 4, name: "panish flu or Influenza" },
    { id: 2, name: "Bubonic Plague" },
    { id: 3, name: "Coronavirus" },
    { id: 5, name: "hIV/AIDS" },
    { id: 6, name: "Cholera" },
  ];

  const [testReason, setTestReason] = useState("");
  const [selectedMedicalConditions, setSelectedMedicalConditons] = useState<
    IItem[]
  >([]);
  const [selectedAllergies, setSelectedAllergies] = useState<IItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const datePickerRef = useRef<ReactDatePicker<never, undefined>>(null);
  const handleFormSubmit = () => {
    console.log(selectedAllergies, testReason);
  };

  return (
    <>
      <form>
        <div className="flex mx-6 justify-between items-center bg-gray-100">
          <div className="flex justify-between items-center">
            <Link to="/">
              <PrimeButton className="p-2 bg-white" text raised>
                <i
                  className="pi pi-arrow-left color-primary"
                  color="danger"
                ></i>
              </PrimeButton>
              <label className="text-blue-200 font-primary  text-xl cursor-pointer px-2">
                Home/
              </label>
            </Link>
            <label className="color-primary font-primary text-xl px-2">
              Make Appointment
            </label>
          </div>
          <div className="flex py-2 justify-between items-center">
            <Button
              className="ml-3 font-primary"
              variant="primary"
              type="reset"
              style="link"
            >
              <i className="p" />
              <i className="pi pi-times me-2"></i>Cancel
            </Button>
            <Button
              onClick={() => handleFormSubmit()}
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
            >
              <i className="pi pi-check me-2"></i>Confirm
            </Button>
          </div>
        </div>
        <div className="p-6 mx-6 bg-white rounded-md max-h-[100%]">
          <div className="font-primary text-xl">Appointment Details</div>
          <div className="flex flex-wrap mt-1">
            <div className="w-full md:w-1/2 sm:w-1 pe-4">
              <label
                htmlFor="testToTake"
                className="block text-sm font-medium input-label"
              >
                Choose test to be taken*
              </label>
              <select
                id="testToTake"
                className="mt-1 border focus:ring-gray-500 border-2 focus:border-gray-500 block w-full border-gray-300 rounded-md h-[2.5rem] border-gray px-1 outline-gray-300"
              >
                {diseases.map((disease) => {
                  return <option key={disease}>{disease}</option>;
                })}
              </select>
            </div>
            <div className="lg:w-1/4 md:w-1/2 sm:w-1 lg:px-4 d-flex relative">
              <label htmlFor="appointmentDate" className="block input-label">
                Date of appointment for test *
              </label>
              <div className="absolute left-0 right-0">
                <ReactDatePicker
                  ref={datePickerRef}
                  minDate={new Date()}
                  wrapperClassName="w-full"
                  calendarIconClassname="right-0 mt-2"
                  id="appointmentDate"
                  dateFormat={DEFAULT_DATE_FORMAT}
                  onChange={(date) => date && setStartDate(date)}
                  selected={startDate}
                  className="h-[2.5rem] ps-2 border-2 border-gray-300 px-1 block w-[100%] mt-1 md:text-sm rounded-md right-0 left-0"
                ></ReactDatePicker>
                <span
                  className="absolute top-[1rem] right-[1rem]"
                  onClick={() => datePickerRef?.current?.setOpen(true)}
                >
                  <FaRegCalendarMinus />
                </span>
              </div>
            </div>
            <div className="lg:w-1/4 md:w-1/2 sm:w-1 lg:pe-0 lg:ps-4 md:px=4">
              <label htmlFor="scheduleTime" className="block input-label">
                Scheduled Time*
              </label>
              <TimePicker
                minutePlaceholder="MM"
                hourPlaceholder="HH"
                value={time}
                id="scheduleTime"
                className={`${styles.timePicker} w-full h-[2.5rem] mt-1 rounded-md border-2 border-gray-300`}
                format="hh:mm a"
                clearIcon=""
                closeClock={true}
                onChange={(time) => time && setTime(time)}
              />
            </div>
          </div>
          <div className="flex flex-wrap py-2">
            <div className="lg:w-1/2 pe-4">
              <label htmlFor="testReason" className="input-label">
                Reason for test
              </label>
              <div className="flex flex-row rounded-md pe-2 py-2">
                <RadioButton
                  name="testReason"
                  inputId="usualCheckup"
                  className="me-3"
                  value="usualCheckup"
                  onChange={(e) => setTestReason(e.value)}
                  checked={testReason === "usualCheckup"}
                />
                <label
                  htmlFor="usualCheckup"
                  className={`${testReason === "usualCheckup" && styles.activeLabel} font-semibold`}
                >
                  Usual checkup
                </label>
                <RadioButton
                  name="testReason"
                  inputId="doctorsAdvice"
                  className="mx-3"
                  value="doctorsAdvice"
                  onChange={(e) => setTestReason(e.value)}
                  checked={testReason === "doctorsAdvice"}
                />
                <label
                  htmlFor="doctorsAdvice"
                  className={`${testReason === "doctorsAdvice" && styles.activeLabel} font-semibold`}
                >
                  Advised by doctor
                </label>
                <RadioButton
                  name="testReason"
                  inputId="otherReason"
                  className="mx-3"
                  value="otherReason"
                  onChange={(e) => setTestReason(e.value)}
                  checked={testReason === "otherReason"}
                />
                <label
                  htmlFor="otherReason"
                  className={`${testReason === "otherReason" && styles.activeLabel} font-semibold`}
                >
                  Other
                </label>
              </div>
            </div>
            <div className="md:w-1/2 min-h-[50px]">
              <label htmlFor="reasonDetails" className="input-label">
                Other reason
              </label>
              <input
                type="text"
                className="cimpar-input py-[.6rem]"
                placeholder="Type the reason here (optional)"
              />
            </div>
          </div>
          <div className="font-primary text-xl pt-4 pb-2">
            Medical Condition
          </div>
          <div>
            <label htmlFor="medicalConditions" className="block input-label">
              Please select the medical conditions you currently have.
            </label>
            <CustomAutoComplete
              placeholder="Select or Add"
              handleSelection={setSelectedMedicalConditons}
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
              className="cimpar-input"
              type="text"
              id="otherMedicalConditions"
              placeholder="Mild concussion."
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">Allergies</div>
          <div>
            <label className="block input-label" htmlFor="allergies">
              Please select the allergies you currently have.
            </label>
            <CustomAutoComplete
              items={medicalConditons}
              selectedItems={selectedAllergies}
              handleSelection={setSelectedAllergies}
            />
          </div>
          <div className="font-primary text-xl pt-4 pb-2">
            Basic Details
            <Button style="link" className="ps-3  text-[#61277F]">
              <i className="pi pi-pencil px-2" /> Edit
            </Button>
          </div>
          <div className="flex flex-wrap">
            <DetailColumn label="Name (Gender)" content="John Doe (Male)" />
            <DetailColumn label="DOB (Age)" content="01 January, 2001 (23)" />
            <DetailColumn
              styleClass="md:w-1/2"
              label="insurance provider & number"
              content="American Family Insurance - 10*******982"
            />
          </div>
        </div>
      </form>
      {showDialog && (
        <CustomModal
          styleClass="w-[30rem] h-[15rem]"
          handleClose={() => setShowDialog(false)}
        >
          <AppoinementStatus />
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
        // className="border block border-gray-300 rounded-md layout-none focus:border-none"
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
      />
      {Boolean(selectedItems.length) && (
        <span
          className="px-2 text-red-500 cursor-pointer min-w-[5rem]"
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

const AppoinementStatus = () => {
  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center">
        <img src={checkmark} alt="Appoinement status" />
      </div>
      <label className="font-primary py-4 text-center">
        Your Appointment has been Successfully fixed.
      </label>
      <div className="flex justify-center">
        <Link to="/">
          <Button className="font-primary w-[12rem]" style="outline">
            <i className="pi pi-check me-2"></i>Go to Lab Results
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AppointmentForm;
