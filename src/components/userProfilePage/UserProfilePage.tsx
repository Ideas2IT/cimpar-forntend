import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddRecord from "../../assets/icons/addrecord.svg?react";
import SlideOpen from "../../assets/icons/slideOpen.svg?react";
import SlideBack from "../../assets/icons/slideback.svg?react";
import Tab from "../../interfaces/Tab";
import {
  selectHasMedicalConditions,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import {
  selectTab,
  setSelectedSidebarTab,
} from "../../store/slices/commonSlice";
import { AppDispatch } from "../../store/store";
import { PATH_NAME } from "../../utils/AppConstants";
import Button from "../Button";
import VerticalTabView from "../VerticalTabView";
import InsuranceDetails from "../insuranceDetails/InsuranceDetails";
import MedicalConditionDetails from "../medicalDetails/MedicalConditionDetails";
import Medication from "../medication/Medication";
import UserDetails from "../userDetails/UserDetails";
import VisitHistory from "../visitHistory/VisitHistory";

export const tabs: Tab[] = [
  {
    key: "Personal",
    value: "Personal",
    content: (
      <div className="px-6 py-1 h-[calc(100vh-170px)] overflow-auto">
        <UserDetails />
      </div>
    ),
  },
  {
    key: "medications",
    value: "Medications",
    content: (
      <div className="ps-6 py-1 h-full">
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
      <div className="ps-6 py-1 h-full">
        <MedicalConditionDetails />
      </div>
    ),
  },
  {
    key: "visitHistory",
    value: "Visit History",
    content: (
      <div className="ps-6 py-1 h-full">
        <VisitHistory />
      </div>
    ),
  },
];
const UserProfilePage = () => {
  const selectedPatient = useSelector(selectSelectedPatient);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectedOption = useSelector(selectTab);
  const [selectedTab, setSelectedTab] = useState(
    selectedOption ? selectedOption : "personal"
  );
  const [hideTabs, setHideTabs] = useState(false);
  const hasConditions = useSelector(selectHasMedicalConditions);

  useEffect(() => {
    dispatch(setSelectedSidebarTab(selectedTab));
  }, [selectedTab]);

  const handleEdit = () => {
    switch (selectedTab.toLowerCase()) {
      case "personal":
        navigate(PATH_NAME.EDIT_PROFILE, { state: { from: "menu" } });
        break;
      case "medications":
        navigate(PATH_NAME.EDIT_MEDICATION);
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
                selectedPatient &&
                selectedPatient?.InsuranceDetails?.length >= 3
                  ? true
                  : false
              }
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              onClick={() => navigate(PATH_NAME.EDIT_INSURANCE)}
            >
              <AddRecord className="stroke-purple-900 mx-2" />
              Add Insurance
            </Button>
          ) : selectedTab.toLowerCase() === "visit history" ? (
            <Button
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              onClick={() => {
                navigate(`${PATH_NAME.EDIT_VISIT_HISTORY}`);
              }}
            >
              <AddRecord className="stroke-purple-900 mx-2" />
              Add Visit History
            </Button>
          ) : selectedTab.toLowerCase() === "medications" ? (
            <Button
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              onClick={() => {
                navigate(PATH_NAME.EDIT_MEDICATION);
              }}
            >
              <AddRecord className="stroke-purple-900 mx-2" />
              {selectedPatient?.medicationDetails &&
              Object.keys(selectedPatient?.medicationDetails)?.length
                ? "Edit Medication"
                : "Add Medication"}
            </Button>
          ) : selectedTab === "Medical Conditions & Allergies" ? (
            <Button
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              onClick={() => navigate(PATH_NAME.EDIT_MEDICAL_CONDITIONS)}
            >
              {!hasConditions ? (
                <>
                  <AddRecord className="stroke-purple-900 mx-2" />
                  Add Medical Conditions & Allergies
                </>
              ) : (
                <>
                  <i className="pi pi-pencil stroke-purple-700 mr-2" />
                  Edit Details
                </>
              )}
            </Button>
          ) : (
            <Button
              className="ml-3 font-primary"
              variant="primary"
              style="outline"
              onClick={() => handleEdit()}
            >
              <i className="pi pi-pencil stroke-purple-700 mr-2" />
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
