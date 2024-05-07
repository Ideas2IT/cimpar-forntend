import { useState } from "react";
import Tab from "../../interfaces/Tab";
import VerticalTabView from "../VerticalTabView";
import SlideOpen from "../../assets/icons/slideOpen.svg?react";
import SlideBack from "../../assets/icons/slideback.svg?react";
import Button from "../Button";
import UserDetails from "../userDetails/UserDetails";
import { IUser } from "../../interfaces/User";
import { useNavigate } from "react-router-dom";
import Medication from "../medication/Medication";
export const user: IUser = {
  dob: "11-11-1993",
  ethnicity: "Chinese",
  gender: "male",
  height: { inches: 2, feet: 5 },
  firstName: "Balaji",
  middleName: "Balamurgun",
  race: "white",
  weight: 120,
  alternativeNumber: 9906915912,
  city: "Arkansas",
  country: "USA",
  fullAddress: "Guindy, Chennai, tamil nadu india 6000032",
  phoneNumber: 9906461523,
  state: "Colorado",
  zipCode: "zy-1232",
  countryCode: { name: "+55-BR", value: "+55-BR" },
  alternateNumberCode: { name: "+55-BR", value: "+55-BR" },
  insuranceName: "American Family Insurance",
  insuranceNumber: "10*******982",
  medicationTakenBefore: [
    { id: 1, name: "Celexa" },
    { id: 2, name: "Lexapro" },
    { id: 3, name: "Prozacfluvoxamine" },
    { id: 4, name: "Paroxetine HCL and Zoloft" },
  ],
  currentMedication: [],
  insurance: {
    insuranceType: "Primary",
    insuranceNumber: "df-1231-tr",
    policyNumber: "lic-sdfsd-323-c4",
    groupNumber: "Bijaj",
    insuranceCompany: "",
  },
  isOnMedicine: true,
  medicationalHistory: true,
};
const UserProfilePage = () => {
  const navigate = useNavigate();
  const tabs: Tab[] = [
    {
      key: "personal",
      value: "Personal",
      content: (
        <div className="px-6 py-1 h-full">
          <UserDetails patient={user} />
        </div>
      ),
    },
    {
      key: "medications",
      value: "Medications",
      content: (
        <div className="px-6 py-1 h-full">
          <Medication />
        </div>
      ),
    },
    {
      key: "MedicalConditions",
      value: "Medical Conditions & Allergies",
      content: (
        <div className="px-6 py-1 h-full">
          {/* <Table rowData={defaultData} columns={columns} /> */}
        </div>
      ),
    },
    {
      key: "hospitalizationHistory",
      value: "Hospitalization History",
      content: (
        <div className="px-6 py-1 h-full">
          {/* <Table rowData={defaultData} columns={columns} /> */}
        </div>
      ),
    },
  ];

  const [selectedTab, setSelectedTab] = useState("personal");
  const [hideTabs, setHideTabs] = useState(false);

  const handleEdit = () => {
    switch (selectedTab.toLowerCase()) {
      case "personal":
        navigate("/editprofile");
        break;
      case "medications":
        navigate("/editMedications");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-3">
        <div>
          <button
            className={`p-2 rounded-lg mr-3 ${hideTabs ? "bg-white" : "bg-cyan-700"}`}
            onClick={() => setHideTabs((hideTabs) => !hideTabs)}
          >
            {hideTabs ? <SlideOpen fill="clear" /> : <SlideBack fill="white" />}
          </button>
          <span className="font-bold text-lg text-cyan-800">{selectedTab}</span>
        </div>
        <div className="flex items-center">
          <Button
            className="ml-3"
            variant="primary"
            style="outline"
            onClick={() => handleEdit()}
          >
            <i className=" pi pi-pencil stroke-purple-700 mr-2" />
            Edit Details
          </Button>
        </div>
      </div>
      <div className="flex flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
        <VerticalTabView
          tabs={tabs}
          changeTab={setSelectedTab}
          hideTabs={hideTabs}
        />
      </div>
    </div>
  );
};
export default UserProfilePage;
