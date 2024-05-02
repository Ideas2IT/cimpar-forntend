import { useState } from "react";
import Tab from "../../interfaces/Tab";
import VerticalTabView from "../VerticalTabView";
import SlideOpen from "../../assets/icons/slideOpen.svg?react";
import SlideBack from "../../assets/icons/slideback.svg?react";
import Button from "../Button";
import UserDetails from "../userDetails/UserDetails";
import { IUser } from "../../interfaces/User";

const UserProfilePage = () => {
  const user: IUser = {
    dob: "12-12-2023",
    ethinicity: "white",
    gender: "male",
    height: 110,
    firstName: "Balaji",
    middleName: "Balamurgun",
    race: "white",
    weight: 120,
    alternativeNumber: "+91-9906915912",
    city: "chennai",
    country: "india",
    fullAddress: "Guindy, Chennai, tamil nadu india 6000032",
    phoneNumber: "+91-9906461523",
    state: "tamil nadu",
    zipCode: "zy-1232",
  };

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
      content: <div className="px-6 py-1 h-full">{/* <Immunization /> */}</div>,
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
  const [isEditable, setIsEditable] = useState(false);

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
            onClick={() => setIsEditable(true)}
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
