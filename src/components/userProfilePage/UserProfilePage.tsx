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
import { PATH_NAME } from "../../utils/AppConstants";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";

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
  ],
  currentMedication: [
    "Celexa",
    "Lexapro",
    "Prozacfluvoxamine",
    "Paroxetine HCL and Zoloft",
  ],
  insurance: [],
  isOnMedicine: "no",
  hasMedicalConditions: false,
  medicationalHistory: "yes",
};
export const tabs: Tab[] = [
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
const UserProfilePage = () => {
  const patinetInsuranceCount = useSelector(selectSelectedPatient)
    ?.InsuranceDetails?.length;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectedOption = useSelector(selectTab);
  const [selectedTab, setSelectedTab] = useState(
    selectedOption ? selectedOption : "personal"
  );
  const [hideTabs, setHideTabs] = useState(false);

  useEffect(() => {
    dispatch(setSelectedSidebarTab(selectedTab));
  }, [selectedTab]);

  const handleEdit = () => {
    switch (selectedTab.toLowerCase()) {
      case "personal":
        navigate(PATH_NAME.EDIT_PROFILE, { state: { from: "menu" } });
        break;
      case "medications":
        navigate(PATH_NAME.EIDT_MEDICATION);
        break;
      case "medical conditions & allergies":
        navigate(PATH_NAME.EDIT_MEDICAL_CONDITIONS);
        break;
      default:
        navigate(PATH_NAME.HOME);
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
                patinetInsuranceCount && patinetInsuranceCount >= 3
                  ? true
                  : false
              }
              className="ml-3"
              variant="primary"
              style="outline"
              onClick={() => navigate(PATH_NAME.EDIT_INSURANCE)}
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
                navigate(PATH_NAME.EDIT_VISIT_HISTORY);
              }}
            >
              <i className=" pi pi-file-plus stroke-purple-700 mr-2" />
              Add Visit History
            </Button>
          ) : selectedTab.toLowerCase() === "medications" ? (
            <Button
              className="ml-3"
              variant="primary"
              style="outline"
              onClick={() => {
                navigate(PATH_NAME.EIDT_MEDICATION);
              }}
            >
              <i className=" pi pi-file-plus stroke-purple-700 mr-2" />
              {user.isOnMedicine === "yes" || user.medicationalHistory === "yes"
                ? "Edit Medication"
                : "Add Medication"}
            </Button>
          ) : selectedTab === "Medical Conditions & Allergies" ? (
            <Button
              className="ml-3"
              variant="primary"
              style="outline"
              onClick={() => navigate(PATH_NAME.EDIT_MEDICAL_CONDITIONS)}
            >
              {!user.hasMedicalConditions ? (
                <>
                  <i className=" pi pi-file-plus stroke-purple-700 mr-2" />
                  Add Medical Conditions & Allergies
                </>
              ) : (
                <>
                  <i className=" pi pi-pencil stroke-purple-700 mr-2" />
                  Edit Details
                </>
              )}
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
