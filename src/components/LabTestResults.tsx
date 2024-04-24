import { ColumnDef } from "@tanstack/react-table";
import Tab from "../interfaces/Tab";
import Button from "./Button";
import Table from "./Table";
import VerticalTabView from "./VerticalTabView";
import { useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import Calendar from "../assets/icons/calendar.svg?react";
import AddRecord from "../assets/icons/addrecord.svg?react";
import SlideBack from "../assets/icons/slideback.svg?react";
import Eye from "../assets/icons/eye.svg?react";
import Download from "../assets/icons/download.svg?react";
import Share from "../assets/icons/share.svg?react";
import { dateFormatter } from "../utils/Date";
import { Link } from "react-router-dom";
import Immunization from "./testResult/Immunization";

const LabTestResults = () => {
  type LabTestResult = {
    testName: string;
    testedAt: string;
    status: string;
    dateOfTest: string;
    data: {};
  };

  const defaultData: LabTestResult[] = [
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
    {
      testName: "Thyroid test",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
    {
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {},
    },
    {
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
    {
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {},
    },
    {
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {},
    },
    {
      testName: "USG Scan",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Manually Added",
      data: {},
    },
    {
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Manually Added",
      data: {},
    },
    {
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Manually Added",
      data: {},
    },
    {
      testName: "MRI",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
    {
      testName: "Blood count",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
      data: {},
    },
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
      data: {},
    },
  ];

  const columns = useMemo<ColumnDef<LabTestResult>[]>(
    () => [
      {
        accessorKey: "testName",
        cell: ({ row }) => {
          return (
            <span className="text-purple-800">{row.getValue("testName")}</span>
          );
        },
        header: () => <p className="font-medium text-sm">Test Name</p>,
      },
      {
        accessorKey: "testedAt",
        cell: (info) => info.getValue(),
        header: () => <p className="font-medium text-sm">Tested At</p>,
      },
      {
        accessorKey: "dateOfTest",
        cell: (info) => info.getValue(),
        header: () => <p className="font-medium text-sm">Date Of Test</p>,
      },
      {
        accessorKey: "status",
        cell: ({ row }) => {
          const getStatusColor = (medicalStatus: string) => {
            switch (medicalStatus) {
              case "Available":
                return "bg-blue-100";
              case "Under Processing":
                return "bg-purple-100";
              case "Manually Added":
                return "bg-indigo-100";
            }
          };
          return (
            <span
              className={`text-black text-xs me-2 px-4 py-2 rounded-full ${getStatusColor(row.getValue("status"))}`}
            >
              {row.getValue("status")}
            </span>
          );
        },
        header: () => <p className="font-medium text-sm">Status</p>,
      },
      {
        accessorKey: "data",
        cell: () => (
          <div className="flex items-center">
            <button><Eye className="stroke-purple-700" /></button>
            <button><Download className="stroke-purple-700 mx-3" /></button>
            <button><Share className="stroke-purple-700" /></button>
          </div>
        ),
        header: "",
      },
    ],
    []
  );

  const tabs: Tab[] = [
    {
      key: "labTestResults",
      value: "Lab Test Results",
      content: (
        <div className="px-6 py-1 h-full">
          <Table rowData={defaultData} columns={columns} />
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
          <Table rowData={defaultData} columns={columns} />
        </div>
      ),
    },
  ];

  const [hideTabs, setHideTabs] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Lab Test Results");

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-3">
        <div>
          <button
            className={`p-2 rounded-lg mr-3 ${hideTabs ? "bg-white" : "bg-cyan-700"}`}
            onClick={() => setHideTabs((hideTabs) => !hideTabs)}
          >
            <SlideBack
              className={`${hideTabs ? "fill-cyan-700" : "fill-white"}`}
            />
          </button>
          <span className="font-bold text-lg text-cyan-800">{selectedTab}</span>
        </div>
        <div className="flex items-center">
          <SearchInput />
          <Link to="appointment">
            <Button className="ml-3" variant="primary" style="outline">
              <img src={Calendar} className="fill-purple-700 mr-2" />
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
