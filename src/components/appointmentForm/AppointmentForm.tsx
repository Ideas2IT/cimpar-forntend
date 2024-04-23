import ReactDatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-clock/dist/Clock.css";
import { useState } from "react";
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
import { Button } from "primereact/button";
interface IItem {
  id: number;
  name: string;
  image: string;
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
    { id: 1, name: "abc", image: "" },
    { id: 4, name: "Spanish flu or Influenza", image: "" },
    { id: 2, name: "Bubonic Plague", image: "" },
    { id: 3, name: "Coronavirus", image: "" },
    { id: 5, name: "HIV/AIDS", image: "" },
    { id: 6, name: "Cholera", image: "" },
  ];
  const [testReason, setTestReason] = useState("");

  const [selectedMedicalConditions, setSelectedMedicalConditons] = useState<
    IItem[]
  >([]);
  const [selectedAllergies, setSelectedAllergies] = useState<IItem[]>([]);

  return (
    <div className="p-6 mx-6 bg-white rounded-md max-h-[100%]">
      <div className="font-primary text-xl">Appointment Details</div>
      <form>
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
          <div className="lg:w-1/4 md:w-1/2 sm:w-1 lg:px-4 d-flex">
            <label htmlFor="appointmentDate" className="block input-label">
              Date of appointment for text *
            </label>
            <ReactDatePicker
              icon={<FaRegCalendarMinus />}
              wrapperClassName="w-full"
              showIcon={true}
              calendarIconClassname="right-0 mt-2"
              id="appointmentDate"
              dateFormat="dd MMMM, yyyy"
              onChange={(date) => date && setStartDate(date)}
              selected={startDate}
              className="h-[2.5rem] px-1 border-2 border-gray-300 px-1 block w-[100%] mt-1 md:text-sm rounded-md right-0 left-0"
            />
          </div>
          <div className="lg:w-1/4 md:w-1/2 sm:w-1 lg:px-4">
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
          <div className="md:w-1/2 lg:px-4 min-h-[50px]">
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
        <div className="font-primary text-xl py-4">Medical Condition</div>
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
          <label className="block input-label" htmlFor="otherMedicalConditions">
            Other medical conditions.
          </label>
          <input
            className="cimpar-input"
            type="text"
            id="otherMedicalConditions"
            placeholder="Mild concussion."
          />
        </div>
        <div className="font-primary text-xl py-4">Allergies</div>
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
        <div className="font-primary text-xl py-4">
          Basic Details
          <span className="h-[2rem] w-[2rem] ps-3  text-[#61277F]">
            <i className="pi pi-pencil" /> Edit
          </span>
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
      </form>
    </div>
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
  const [inputVlaue, setInputValue] = useState("");
  const itemTemplate = (item: IItem) => {
    return (
      <div
        className="flex align-items-center hover:text-cyan-800 w-full h-full py-4 justify-between"
        onMouseEnter={() => addImage(item.id)}
        onMouseLeave={() => removeImage(item.id)}
      >
        <div className="capitalize">{item.name}</div>
        <img src={item.image} />
      </div>
    );
  };
  const addImage = (id: number) => {
    const filteredSuggestions = suggestions.map((a) => {
      if (a.id === id) {
        return { ...a, image: plus };
      } else return a;
    });
    setSuggestions(filteredSuggestions);
  };
  const removeImage = (id: number) => {
    const filteredSuggestions = suggestions.map((a) => {
      if (a.id === id) {
        return { ...a, image: "" };
      } else return a;
    });
    setSuggestions(filteredSuggestions);
  };

  const search = (event: AutoCompleteCompleteEvent) => {
    setInputValue(event.query);
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
    }, 250);
  };

  const handleValueSelect = (event: AutoCompleteChangeEvent) => {
    handleSelection(event.value);
  };

  return (
    <AutoComplete
      className="border block border-gray-300 rounded-md layout-none focus:border-none"
      field="name"
      multiple
      value={selectedItems}
      suggestions={suggestions}
      onChange={(event) => handleValueSelect(event)}
      completeMethod={search}
      itemTemplate={itemTemplate}
      panelClassName={styles.customPanelStyle}
      placeholder={placeholder ? placeholder : "Select or Add"}
      emptyMessage="No result found"
      showEmptyMessage={true}
      itemProp="py-0"
    />
  );
};

export default AppointmentForm;
