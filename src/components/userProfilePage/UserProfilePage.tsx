import { useEffect, useState } from "react";
import Tab from "../../interfaces/Tab";
import VerticalTabView from "../VerticalTabView";
import SlideOpen from "../../assets/icons/slideOpen.svg?react";
import SlideBack from "../../assets/icons/slideback.svg?react";
import Button from "../Button";
import UserDetails from "../userDetails/UserDetails";
import { IUser } from "../../interfaces/User";
import { useNavigate } from "react-router-dom";
import Medication from "../medication/Medication";
import InsuranceDetails from "../insuranceDetails/InsuranceDetails";
import MedicalConditionDetails from "../MedicalDetails/MedicalConditionDetails";
import VisitHistory from "../visitHistory/VisitHistory";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTab,
  setSelectedSidebarTab,
} from "../../store/slices/commonSlice";
import { AppDispatch } from "../../store/store";
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
  countryCode: "+61-AU",
  alternateNumberCode: "+55-BR",
  insuranceName: "American Family Insurance",
  insuranceNumber: "10*******982",
  medicationTakenBefore: [
    "Celexa",
    "Lexapro",
    "Prozacfluvoxamine",
    "Paroxetine HCL and Zoloft",
    // { id: 1, name: "Celexa" },
    // { id: 2, name: "Lexapro" },
    // { id: 3, name: "Prozacfluvoxamine" },
    // { id: 4, name: "Paroxetine HCL and Zoloft" },
  ],
  currentMedication: [
    "Celexa",
    "Lexapro",
    "Prozacfluvoxamine",
    "Paroxetine HCL and Zoloft",
  ],
  // { id: 1, name: "pantop 40" },
  // { id: 2, name: "Amlokind" },
  insurance: [
    {
      id: 1,
      insuranceType: "Primary",
      insuranceNumber: "df-1231-tr",
      policyNumber: "lic-sdfsd-323-c4",
      groupNumber: "1-800-MYAMFAM",
      insuranceCompany: "Medicare",
    },
    {
      id: 2,
      insuranceType: "Secondary",
      insuranceNumber: "df-1231-tr",
      policyNumber: "lic-sdfsd-323-c4",
      groupNumber: "1-800-MYAMFAM",
      insuranceCompany: "American Automobile Association",
    },
    {
      id: 3,
      insuranceType: "Tertiary",
      insuranceNumber: "df-1231-tr",
      policyNumber: "lic-sdfsd-323-c4",
      groupNumber: "1-800-MYAMFAM",
      insuranceCompany: "American Family Insurance",
    },
  ],
  isOnMedicine: "no",
  medicationalHistory: "yes",
};
const UserProfilePage = () => {
  const navigate = useNavigate();
  const tabs: Tab[] = [
    {
      key: "Personal",
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
      key: "insurance",
      value: "Insurance",
      content: (
        <div className="px-6 py-1 h-full">
          <InsuranceDetails />
        </div>
      ),
    },
    {
      key: "MedicalConditions",
      value: "Medical Conditions & Allergies",
      content: (
        <div className="px-6 py-1 h-full">
          <MedicalConditionDetails />
        </div>
      ),
    },
    {
      key: "visitHistory",
      value: "Visit History",
      content: (
        <div className="px-6 py-1 h-full">
          <VisitHistory />
        </div>
      ),
    },
  ];
  const dispatch = useDispatch<AppDispatch>();
  const selectedOption = useSelector(selectTab);
  const [selectedTab, setSelectedTab] = useState(selectedOption?selectedOption :'personal');
  const [hideTabs, setHideTabs] = useState(false);

  useEffect(() => {
    console.log(selectedOption)
    dispatch(setSelectedSidebarTab(selectedTab));
  }, [selectedTab])

  const handleEdit = () => {
    switch (selectedTab.toLowerCase()) {
      case "personal":
        navigate("/editprofile");
        break;
      case "medications":
        navigate("/editMedications");
        break;
      case "medical conditions & allergies":
        navigate("/edit-medical-conditons");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <div className="flex flex-col flex-grow px-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <button
            className={`p-2 rounded-lg mr-3 ${hideTabs ? "bg-white" : "bg-cyan-700"}`}
            onClick={() => setHideTabs((hideTabs) => !hideTabs)}
          >
            {hideTabs ? <SlideOpen fill="clear" /> : <SlideBack fill="white" />}
          </button>
          <span className="font-primary text-xl text-cyan-800">
            {selectedTab}
          </span>
        </div>
        <div className="flex items-center">
          {selectedTab.toLowerCase() === "insurance" ? (
            <Button
              disabled={
                user.insurance?.length && user.insurance?.length >= 3
                  ? true
                  : false
              }
              className="ml-3"
              variant="primary"
              style="outline"
              onClick={() => navigate("/edit-insurance")}
            >
              <i className=" pi pi-file-plus stroke-purple-700 mr-2" />
              Add Insurance
            </Button>
          ) : selectedTab.toLowerCase() === "visit history" ? (
            <Button
              className="ml-3"
              variant="primary"
              style="outline"
              onClick={() => {
                navigate("/edit-visit-history");
              }}
            >
              <i className=" pi pi-file-plus stroke-purple-700 mr-2" />
              Add Visit History
            </Button>
          ) : (
            <Button
              className="ml-3"
              variant="primary"
              style="outline"
              onClick={() => handleEdit()}
            >
              <i className=" pi pi-pencil stroke-purple-700 mr-2" />
              Edit Details
            </Button>
          )}
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