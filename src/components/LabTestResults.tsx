import { ColumnDef } from "@tanstack/react-table";
import Tab from "../interfaces/Tab";
import Button from "./Button";
import Table from "./Table";
import VerticalTabView from "./VerticalTabView";
import { useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import Calendar from "../assets/icons/calendar.svg";
import AddRecord from "../assets/icons/addrecord.svg";
import SlideBack from "../assets/icons/slideback.svg";
import { dateFormatter } from "../utils/Date";
import { Link } from "react-router-dom";

const LabTestResults = () => {
  type LabTestResult = {
    testName: string;
    testedAt: string;
    status: string;
    dateOfTest: string;
  };

  const defaultData: LabTestResult[] = [
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
    },
    {
      testName: "Thyroid test",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
    },
    {
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
    },
    {
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
    },
    {
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
    },
    {
      testName: "MRI",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
    },
    {
      testName: "USG Scan",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Manually Added",
    },
    {
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Manually Added",
    },
    {
      testName: "Urine Analysis",
      testedAt: "Lakeside Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Manually Added",
    },
    {
      testName: "MRI",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
    },
    {
      testName: "Blood count",
      testedAt: "State Hygiene Labarotory",
      dateOfTest: dateFormatter(new Date()),
      status: "Available",
    },
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
    },
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
    },
    {
      testName: "Blood count",
      testedAt: "Ames Laboratory",
      dateOfTest: dateFormatter(new Date()),
      status: "Under Processing",
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
          <Table rowData={defaultData} columns={columns} />
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

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-3">
        <div>
          <button
            className={`p-2 rounded-lg mr-3 ${hideTabs ? "bg-white" : "bg-cyan-700"}`}
            onClick={() => setHideTabs((hideTabs) => !hideTabs)}
          >
            <img src={SlideBack} />
          </button>
          <span className="font-bold text-lg text-cyan-800">
            Lab Test Results
          </span>
        </div>
        <div className="flex items-center">
          <SearchInput />
          <Button className="ml-3" variant="primary" style="outline">
            <img src={Calendar} className="fill-purple-700 mr-2" />
            <Link to="appointment">Make appointment</Link>
          </Button>
          <Button className="ml-3" variant="primary" style="outline">
            <img src={AddRecord} className="fill-purple-700 mr-2" />
            Add record
          </Button>
        </div>
      </div>
      <div className="flex flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
        <VerticalTabView tabs={tabs} hideTabs={hideTabs} />
      </div>
    </div>
  );
};

export default LabTestResults;
