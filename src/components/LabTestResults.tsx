
import Tab from "../interfaces/Tab";
import Button from "./Button";

import VerticalTabView from "./VerticalTabView";
import {useState } from "react";
import SearchInput from "./SearchInput";
import Calendar from "../assets/icons/calendar.svg?react";
import AddRecord from "../assets/icons/addrecord.svg?react";
import SlideBack from "../assets/icons/slideback.svg?react";
import SlideOpen from "../assets/icons/slideOpen.svg?react";
import { dateFormatter } from "../utils/Date";
import { Link } from "react-router-dom";
import Immunization from "./testResult/Immunization";
import TestResult from "./testResult/TestResult";
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
  const defaultData: LabTestResult[] = [
    {
      orderId: "RI 0122876",
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122878",
      testName: "Thyroid test",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122879",
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
        dateTimeReported: "12 dec, 2021",
      },
    },
    {
      orderId: "RI 0122880",
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122881",
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122882",
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122883",
      testName: "USG Scan",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "available",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122884",
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Upcoming appointment",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122885",
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Upcoming appointment",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    {
      orderId: "RI 0122886",
      testName: "MRI",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Upcoming appointment",
      data: {
        specimenUsed: "blood",
        dateTimeCollected: "12, december,2021",
        physicianName: "Guru govind",
        physicianPhone: "99991111232",
      },
    },
    // {
    //   orderId: "RI 0122887",
    //   testName: "Blood count",
    //   testedAt: "State Hygiene Labarotory",
    //   dateOfTest: dateFormatter(new Date()),
    //   status: "Available",
    //   data: {},
    // },
    // {
    //   orderId: "RI 0122888",
    //   testName: "Blood count",
    //   testedAt: "Ames Laboratory",
    //   dateOfTest: dateFormatter(new Date()),
    //   status: "Under Processing",
    //   data: {},
    // },
    // {
    //   orderId: "RI 0122889",
    //   testName: "Blood count",
    //   testedAt: "Ames Laboratory",
    //   dateOfTest: dateFormatter(new Date()),
    //   status: "Under Processing",
    //   data: {},
    // },
    // {
    //   orderId: "RI 0122890",
    //   testName: "Blood count",
    //   testedAt: "Ames Laboratory",
    //   dateOfTest: dateFormatter(new Date()),
    //   status: "Under Processing",
    //   data: {},
    // },
  ];


  const tabs: Tab[] = [
    {
      key: "labTestResults",
      value: "Lab Test Results",
      content: (
        <div className="px-6 py-1 h-full">
          {/* <Table rowData={defaultData} columns={columns} /> */}
          <TestResult results={defaultData} />
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
    {
      key: "pastHealthRecords",
      value: "Past health records",
      content: (
        <div className="px-6 py-1 h-full">
          <TestResult results={defaultData}/>
        </div>
      ),
    },
  ];

  const [hideTabs, setHideTabs] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Lab Test Results");

  //TODO: Need to call API with search query
  const handleSearch=(value:String)=>{
    console.log(value)
  }

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
          <SearchInput handleSearch={handleSearch} />
          <Link to="appointment">
            <Button className="ml-3" variant="primary" style="outline">
              <Calendar className="stroke-purple-700 mr-2" />
              Make appointment
            </Button>
          </Link>
          <Button className="ml-3" variant="primary" style="outline">
            <AddRecord className="stroke-purple-700 mr-2" />
            Add record
          </Button>
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
