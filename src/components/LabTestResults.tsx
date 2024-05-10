import Tab from "../interfaces/Tab";

import VerticalTabView from "./VerticalTabView";
import { useState } from "react";
import SearchInput from "./SearchInput";
import SlideBack from "../assets/icons/slideback.svg?react";
import SlideOpen from "../assets/icons/slideOpen.svg?react";
import Immunization from "./testResult/Immunization";
import TestResult from "./testResult/TestResult";
import ServiceHistory from "./serviceHistory/ServiceHistory";
import { labResults } from "../assets/MockData";
import { Dropdown } from "primereact/dropdown";
export interface LabTestResult {
  testName: string;
  testedAt: string;
  status: string;
  dateOfTest: string;
  data: {
    specimenUsed: string;
    dateTimeCollected: string;
    physicianName: string;
    physicianPhone: string;
    dateTimeReported?: string;
  };
  orderId: string;
}

const LabTestResults = () => {
  const tabs: Tab[] = [
    {
      key: "pastHealthRecord",
      value: "Service History",
      content: (
        <div className="px-6 py-1 h-full">
          <ServiceHistory />
          {/* <TestResult results={defaultData} /> */}
        </div>
      ),
    },
    {
      key: "labTestResults",
      value: "Lab Results",
      content: (
        <div className="px-6 py-1 h-full">
          <TestResult results={labResults} />
        </div>
      ),
    },
    {
      key: "immunization",
      value: "Immunization",
      content: (
        <div className="px-6 py-1 h-full">
          <Immunization />
        </div>
      ),
    },
  ];

  const [hideTabs, setHideTabs] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Lab Test Results");

  //TODO: Need to call API with search query
  const handleSearch = (value: String) => {
    console.log(value);
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
          <SearchInput handleSearch={handleSearch} />
          {/* <Link to="appointment">
            <Button className="ml-3" variant="primary" style="outline">
              <Calendar className="stroke-purple-700 mr-2" />
              Make appointment
            </Button>
          </Link>
          <Button className="ml-3" variant="primary" style="outline">
            <AddRecord className="stroke-purple-700 mr-2" />
            Add record
          </Button> */}
          
        </div>
      </div>
      <div className="flex flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
        <VerticalTabView
          tabs={tabs}
          hideTabs={hideTabs}
          changeTab={setSelectedTab}
        />
      </div>
    </div>
  );
};

export default LabTestResults;
