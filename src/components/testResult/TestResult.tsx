import { useState } from "react";
import LabTestResults, { LabTestResult } from "../LabTestResults";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Eye from "../../assets/icons/eye.svg?react";
import Download from "../../assets/icons/download.svg?react";
import Share from "../../assets/icons/share.svg?react";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { Sidebar } from "primereact/sidebar";
import { getStatusColors } from "../../services/commonFunctions";

const TestResult = ({ results }: { results: LabTestResult[] }) => {
  const [selectedTest, setSelectedTest] = useState({} as LabTestResult);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const tableProps = {
    selection: selectedTest,
    value: results,
    selectionMode: "single" as const,
    dataKey: "orderId",
    tableStyle: { minWidth: "50rem" },
    className: "mt-2 max-h-[90%] rowHoverable",
    rowClassName: "h-10 border-b",
    scrollHeight: "40rem",
  };
  const columnHeaderStyle = "text-sm font-secondary py-1 bg-white";

  const handlePageChange = (event: any) => {
    //TODO: Write logic to call api
    console.log(event);
  };

  //TODO: Need to handle the logic
  const handleReports = (action: string, row: LabTestResult) => {
    setSelectedTest(row);
    action === "view" && setIsOpenSidebar(true);
  };

  const SidebarHeader = () => {
    return (
      <div className="items-center flex">
        <span className="pe-3">Lab Result</span>
        <span
          className={`${getStatusColors(selectedTest.status)} py-1 px-3 rounded-full text-sm font-ternary`}
        >
          {selectedTest.status}
        </span>
      </div>
    );
  };

  return (
    <>
      <DataTable {...tableProps}>
        <Column
          field="testName"
          header="TEST NAME"
          headerClassName={columnHeaderStyle}
          bodyClassName="py-2"
          body={(rowData) => <TestName name={rowData.testName} />}
        />
        <Column
          field="orderId"
          header="ORDER ID"
          headerClassName={columnHeaderStyle}
          body={(rowData) => <TestDetails value={rowData.orderId} />}
        />
        <Column
          field="testedAt"
          header="TESTED AT"
          headerClassName={columnHeaderStyle}
          body={(rowData) => <TestDetails value={rowData.testedAt} />}
        />
        <Column
          field="dateOfTest"
          header="DATE OF TEST"
          headerClassName={columnHeaderStyle}
          body={(rowData) => <TestDetails value={rowData.dateOfTest} />}
        />
        <Column
          field="status"
          header="STATUS"
          headerClassName={columnHeaderStyle}
          body={(rowData) => <TestStatus status={rowData.status} />}
        />
        <Column
          field=""
          header=""
          headerClassName={columnHeaderStyle}
          body={(rowData) => (
            <ReportColumn data={rowData} handleReports={handleReports} />
          )}
        />
      </DataTable>
      {results.length > 10 && (
        <CustomPaginator
          rowLimit={10}
          handlePageChange={handlePageChange}
          totalRecords={results.length}
        />
      )}
      {Object.keys(selectedTest).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          header={<SidebarHeader />}
          visible={!!Object.keys(selectedTest).length}
          position="right"
          onHide={() => {
            setSelectedTest({} as LabTestResult);
            setIsOpenSidebar(false);
          }}
        >
          <TestDetailedView test={selectedTest} />
        </Sidebar>
      )}
    </>
  );
};

const TestName = ({ name }: { name: String }) => {
  return (
    <div className="text-purple-800 font-ternary">{name ? name : "-"}</div>
  );
};

const TestDetails = ({ value }: { value: string }) => {
  return <div className="font-ternary">{value ? value : "-"}</div>;
};
const TestStatus = ({ status }: { status: string }) => {
  return (
    <div>
      <span
        className={`${getStatusColors(status)} rounded-full py-2 px-3 text-center`}
      >
        {status ? status : "-"}
      </span>
    </div>
  );
};

const ReportColumn = ({
  data,
  handleReports,
}: {
  data: LabTestResult;
  handleReports: (action: string, data: LabTestResult) => void;
}) => {
  return (
    <div className="flex flex-row items-center  stroke-purple-800 justify-center">
      <Eye className="me-1" onClick={() => handleReports("view", data)} />
      {(data.status.toLowerCase() === "under porcesses" ||
        data.status.toLowerCase() === "available") && (
        <Download onClick={() => handleReports("download", data)} />
      )}

      {(data.status.toLowerCase() === "available" ||
        data.status.toLowerCase() === "under processing") && (
        <Share className="ms-1" onClick={() => handleReports("share", data)} />
      )}
    </div>
  );
};

const TestDetailedView = ({ test }: { test: LabTestResult }) => {
  const TableCell = ({
    label,
    value,
  }: {
    label: string | undefined;
    value: string | undefined;
  }) => (
    <div className="border-b pb-1">
      <div className="text-gray-500 font-secondary text-sm pt-4">
        {label ? label : "-"}
      </div>
      <label className="font-primary">{value ? value : "-"}</label>
    </div>
  );

  const columnKeys = [
    "ORDER ID",
    "DATE OF TEST",
    "SPECIMEN USED",
    "TESTED AT",
    "DATE/TIME COLLECTED",
    "DATE/TIME REPORTED",
  ];

  const getValue = (title: string | undefined) => {
    if (title) {
      switch (title) {
        case "ORDER ID":
          return test["orderId"];
        case "DATE OF TEST":
          return test["dateOfTest"];
        case "SPECIMEN USED":
          return test.data["specimenUsed"];
        case "TESTED AT":
          return test["testedAt"];
        case "DATE/TIME COLLECTED":
          return test.data["dateTimeCollected"];
        case "PHYSICAN PHONE":
          return test.data["physicianPhone"];
        case "PHYSICIAN NAME":
          return test.data["physicianName"];
        case "DATE/TIME REPORTED":
          return test.data["dateTimeReported"];
        default:
          return "";
      }
    } else return "";
  };

  return (
    <div className="pt-6">
      <label className="font-primary text-sm">Test details</label>
      <div>
        <TableCell label="TEST NAME" value={test.testName} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {Boolean(columnKeys.length) &&
          columnKeys.map((column) => {
            return <TableCell label={column} value={getValue(column)} />;
          })}
      </div>
      <div className="font-primary text-primary py-6 mt-6 text-xl">
        Test Results
      </div>
      <label className="text:sm py-6">
        Results will be displayed here once physician uploaded it.
      </label>
      <div className="font-primary text-primary py-6 text-xl">
        Ordering Physician details
      </div>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap">
        <TableCell label="PHYSICIAN NAME" value={getValue("PHYSICIAN NAME")} />
        <TableCell label="CONTACT INFO" value={getValue("PHYSICAN PHONE")} />
      </div>
    </div>
  );
};
export default TestResult;
