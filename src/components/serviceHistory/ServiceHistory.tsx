import { useState } from "react";
import { LabTestResult } from "../LabTestResults";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Eye from "../../assets/icons/eye.svg?react";
import Download from "../../assets/icons/download.svg?react";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { Sidebar } from "primereact/sidebar";
import { getStatusColors } from "../../services/commonFunctions";
import {
  IService,
  immunizations,
  labResults,
  serviceData,
} from "../../assets/MockData";
import { ImmunizationDetailView } from "../testResult/Immunization";

const ServiceHistory = () => {
  const [selectedService, setSelectedTest] = useState<IService>({} as IService);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const tableProps = {
    selection: selectedService,
    value: serviceData,
    selectionMode: "single" as const,
    dataKey: "serviceId",
    tableStyle: { minWidth: "50rem" },
    className: "mt-2 max-h-[90%] rowHoverable",
    rowClassName: "h-10 border-b",
    scrollHeight: "40rem",
  };

  const handlePageChange = (event: any) => {
    //TODO: Write logic to call api
    console.log(event);
  };

  //TODO: Need to handle the logic
  const handleReports = (action: string, row: IService) => {
    setSelectedTest(row);
    action === "view" && setIsOpenSidebar(true);
  };

  const SidebarHeader = () => {
    return (
      <div className="items-center flex">
        <span className="pe-3">Lab Result</span>
        <span
          className={`${getStatusColors(selectedService.status)} py-1 px-3 rounded-full text-sm font-tertiary`}
        >
          {selectedService.status ? selectedService.status : "-"}
        </span>
      </div>
    );
  };
  const serviceColumns = [
    {
      field: "category",
      header: "CATEGORY",
      bodyClassName: "py-2",
      body: (rowData: IService) => <div> {rowData.category} </div>,
    },
    {
      field: "serviceFor",
      header: "SERVICE FOR",
      body: (rowData: IService) => <TestDetails value={rowData.serviceFor} />,
    },
    {
      field: "dateOfService",
      header: "DATE OF SERVICE",
      body: (rowData: IService) => (
        <TestDetails value={rowData.dateOfService} />
      ),
    },
    {
      field: "status",
      header: "STATUS",
      body: (rowData: IService) => <TestStatus status={rowData.status} />,
    },
  ];

  return (
    <>
      <DataTable {...tableProps}>
        {serviceColumns.map((column, index) => {
          return (
            <Column
              key={index}
              field={column.field}
              header={column.header}
              body={column.body}
              headerClassName="text-sm font-secondary py-1 border-b bg-white"
            />
          );
        })}

        <Column
          field=""
          header=""
          headerClassName="text-sm font-secondary py-1 border-b bg-white"
          body={(rowData) => (
            <ReportColumn data={rowData} handleReports={handleReports} />
          )}
        />
      </DataTable>
      {serviceData.length > 10 && (
        <CustomPaginator
          rowLimit={10}
          handlePageChange={handlePageChange}
          totalRecords={serviceData.length}
        />
      )}
      {!!Object.keys(selectedService).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          //TODO: Need to customze the header on the bases of service type
          header={<SidebarHeader />}
          visible={!!Object.keys(selectedService).length && isOpenSidebar}
          position="right"
          onHide={() => {
            setSelectedTest({} as IService);
            setIsOpenSidebar(false);
          }}
        >
          {selectedService.category.toLowerCase() === "lab test" ? (
            // TODO: Need to fetch the results of selected service and render the component accordingly
            <TestDetailedView test={labResults[0]} />
          ) : (
            <ImmunizationDetailView data={immunizations[0]} />
          )}
        </Sidebar>
      )}
    </>
  );
};

// const TestName = ({ name }: { name: String }) => {
//   return (
//     <div className="text-purple-800 font-tertiary">{name ? name : "-"}</div>
//   );
// };

const TestDetails = ({ value }: { value: string }) => {
  return <div className="font-tertiary">{value ? value : "-"}</div>;
};
const TestStatus = ({ status }: { status: string }) => {
  return (
    <div>
      <span
        className={`${getStatusColors(status)} rounded-full py-2 px-4 text-sm text-center`}
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
  data: IService;
  handleReports: (action: string, data: IService) => void;
}) => {
  return (
    <div className="flex flex-row items-center stroke-purple-800 justify-start">
      <Eye className="me-2" onClick={() => handleReports("view", data)} />
      {(data.status.toLowerCase() === "under porcesses" ||
        data.status.toLowerCase() === "available") && (
        <Download onClick={() => handleReports("download", data)} />
      )}

      {/* {(data.status.toLowerCase() === "available" ||
        data.status.toLowerCase() === "under processing") && (
        <Share className="ms-2" onClick={() => handleReports("share", data)} />
      )} */}
    </div>
  );
};

const TestDetailedView = ({ test }: { test: LabTestResult }) => {
  const TableCell = ({
    label,
    value,
    highlight,
  }: {
    label: string | undefined;
    value: string | undefined;
    highlight?: boolean;
  }) => (
    <div className="border-b pb-1">
      <div className="text-gray-500 font-secondary text-sm pt-4">
        {label ? label : "-"}
      </div>
      <label className={`${highlight && "text-red-600"} font-primary`}>
        {value ? value : "-"}
      </label>
    </div>
  );

  const Result = () => {
    return (
      <div className="flex grid lg:grid-cols-2">
        <TableCell label="RESULT" value="16" highlight={true} />
        <TableCell label="REFERENCE RANGE" value="10-13" />
        <TableCell label="UNITS" value="G/dL" />
        <TableCell label="FALG" value="HIGH" highlight={true} />
      </div>
    );
  };

  const columnKeys =
    test.status.toLowerCase() !== "upcoming appointment"
      ? [
          "ORDER ID",
          "DATE OF TEST",
          "SPECIMEN USED",
          "TESTED AT",
          "DATE/TIME COLLECTED",
          "DATE/TIME REPORTED",
        ]
      : ["ORDER ID", "DATE OF TEST"];

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
          columnKeys.map((column, index) => {
            return (
              <TableCell key={index} label={column} value={getValue(column)} />
            );
          })}
      </div>
      {test.status.toLowerCase() !== "upcoming appointment" && (
        <>
          <div className="font-primary text-primary flex justify-between py-6 mt-6 text-xl">
            Test Results
            {test.status === "Available" && (
              <div
                className="flex flex-row items-center justify-center text-purple-800 cursor-pointer"
                onClick={() => {}}
              >
                <Eye className="stroke-purple-800 me-2" /> Preview
              </div>
            )}
          </div>
          {test.status.toLowerCase() === "available" ? (
            <Result />
          ) : (
            <label className="text:sm py-6">
              Results will be displayed here once physician uploaded it.
            </label>
          )}
          <div className="font-primary text-primary py-6 text-xl">
            Ordering Physician details
          </div>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap">
            <TableCell
              label="PHYSICIAN NAME"
              value={getValue("PHYSICIAN NAME")}
            />
            <TableCell
              label="CONTACT INFO"
              value={getValue("PHYSICAN PHONE")}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default ServiceHistory;
