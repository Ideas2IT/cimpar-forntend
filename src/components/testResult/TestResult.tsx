import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Download from "../../assets/icons/download.svg?react";
import Eye from "../../assets/icons/eye.svg?react";
import {
  IDetailedAppointment,
  IGetAppointmentByIdPayload,
  SidebarAppointment,
} from "../../interfaces/appointment";
import { IGetTestByIdPayload, ILabTest } from "../../interfaces/immunization";
import {
  appointmentStatus,
  getRowClasses,
  getStatusColors,
} from "../../services/commonFunctions";
import { getAppointmentByIdThunk } from "../../store/slices/appointmentSlice";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import {
  getLabTestByIdThunk,
  selectLabTests,
} from "../../store/slices/serviceHistorySlice";
import { AppDispatch } from "../../store/store";
import {
  DATE_FORMAT,
  NORMAL,
  RESPONSE,
  RESULT_STATUS,
} from "../../utils/AppConstants";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { AppointentView } from "../serviceHistory/ServiceHistory";
import { dateFormatter } from "../../utils/Date";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";

const TestResult = ({
  handlePageChange,
}: {
  handlePageChange: (value: number) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTest, setSelectedTest] = useState({} as ILabTest);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(
    {} as SidebarAppointment
  );
  const columnHeaderStyle = "text-sm font-secondary py-1 border-b bg-white";
  const results = useSelector(selectLabTests);
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;
  const handleReports = (action: string, row: ILabTest) => {
    if (action === "download") {
      if (row.fileUrl) {
        const link = document.createElement("a");
        link.href = row.fileUrl;
        link.download = "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        errorToast("File not found", "This observation does not have a file");
        return;
      }
    }
    if (
      row.status?.toLowerCase() === RESULT_STATUS.UPCOMING_APPOINTMENT ||
      row.status?.toLowerCase() === RESULT_STATUS.UNDER_PROCESSING
    ) {
      const payload: IGetAppointmentByIdPayload = {
        appointment_id: row.orderId,
        patient_id: patientId,
      };
      dispatch(getAppointmentByIdThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const appointment = response.payload as IDetailedAppointment;
          const appointmentDate: SidebarAppointment = {
            allergies: appointment?.currentAllergies || "",
            conditions: appointment?.currentConditions || "",
            dateOfTest:
              dateFormatter(
                appointment?.appointmentDate,
                DATE_FORMAT.DD_MMMM_YYYY_HH_MMA
              ) || "N/A",
            testName: appointment?.appointmentFor || "",
            orderId: appointment?.id || "",
            status: appointmentStatus(appointment?.appointmentDate),
            otherAllergies: appointment?.otherAllergies || "",
            otherMedicalConditions: appointment?.otherConditions || "",
          };
          setSelectedAppointment(appointmentDate);
        }
      });
    } else {
      const payload: IGetTestByIdPayload = {
        test_id: row.orderId,
        patient_id: patientId,
      };
      dispatch(getLabTestByIdThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const test = response.payload as ILabTest;
          setSelectedTest(test);
        }
      });
    }
    action === "view" && setIsOpenSidebar(true);
  };
  const { errorToast, toast } = useToast();
  const downloadDocument = (url: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      errorToast("File Not Found", "This observation does not have a file");
    }
  };

  const SidebarHeader = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="pe-3">Lab Result</span>
          <span
            className={`${getStatusColors(selectedTest.status)} py-2 px-3 rounded-full text-sm font-tertiary`}
          >
            {selectedTest.status ? selectedTest.status : "-"}
          </span>
        </div>
        {selectedTest.fileUrl && (
          <Button
            title="Download test report"
            label="Download"
            className="text-purple-900 bg-purple-100 rounded-full py-2 px-3 border border-purple-900 me-3 text-[16px]"
            icon="pi pi-download"
            onClick={() => downloadDocument(selectedTest.fileUrl)}
          />
        )}
      </div>
    );
  };

  const AppointmentHeader = () => {
    const getValue = () => {
      if (!selectedAppointment?.status) return selectedAppointment?.status;
      return selectedAppointment?.status
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="pe-3">Lab Result</span>
          <span
            className={`${getStatusColors(selectedAppointment.status)} py-2 px-3 rounded-full text-sm font-tertiary`}
          >
            {getValue()}
          </span>
        </div>
      </div>
    );
  };

  const resultColumns = [
    {
      field: "testName",
      header: "TEST NAME",
      body: (rowData: ILabTest) => <TestName name={rowData.testName} />,
    },
    {
      field: "orderId",
      header: "ORDER ID",
      body: (rowData: ILabTest) => <TestDetails value={rowData.orderId} />,
    },
    {
      field: "testedAt",
      header: "TESTED AT",
      body: (rowData: ILabTest) => <TestDetails value={rowData.testedAt} />,
    },
    {
      field: "dateOfTest",
      header: "DATE OF TEST",
      body: (rowData: ILabTest) => <TestDetails value={rowData.dateOfTest} />,
    },
    {
      field: "status",
      header: "STATUS",
      body: (rowData: ILabTest) => <TestStatus status={rowData.status} />,
    },
    {
      field: "",
      header: "",
      body: (rowData: ILabTest) => (
        <ReportColumn data={rowData} handleReports={handleReports} />
      ),
    },
  ];

  return (
    <>
      <div className="h-[calc(100vh-200px)] overflow-auto">
        <DataTable
          selection={selectedTest}
          value={results?.data}
          emptyMessage={
            <div className="flex w-full justify-center">
              No lab tests available
            </div>
          }
          selectionMode="single"
          dataKey="orderId"
          tableStyle={{ minWidth: "50rem" }}
          className="mt-2 rowHoverable"
          rowClassName={() => getRowClasses("h-10 border-b")}
        >
          {resultColumns.map((column, index) => {
            return (
              <Column
                key={index}
                headerClassName={columnHeaderStyle}
                bodyClassName="py-4 text-ellipsis text-wrap max-w-[12rem]"
                field={column.field}
                header={column.header}
                body={column.body}
              />
            );
          })}
        </DataTable>
        <Toast ref={toast} />
      </div>
      {results?.pagination?.total_pages > 1 && (
        <CustomPaginator
          handlePageChange={handlePageChange}
          currentPage={results?.pagination?.current_page}
          totalPages={results?.pagination?.total_pages}
        />
      )}
      {!!Object.keys(selectedTest).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          header={<SidebarHeader />}
          visible={!!Object.keys(selectedTest).length && isOpenSidebar}
          position="right"
          onHide={() => {
            setSelectedTest({} as ILabTest);
            setIsOpenSidebar(false);
          }}
        >
          <TestDetailedView test={selectedTest} />
        </Sidebar>
      )}
      {!!Object.keys(selectedAppointment).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          header={<AppointmentHeader />}
          visible={!!Object.keys(selectedAppointment).length && isOpenSidebar}
          position="right"
          onHide={() => {
            setSelectedAppointment({} as SidebarAppointment);
            setIsOpenSidebar(false);
          }}
        >
          <AppointentView appointment={selectedAppointment} />
        </Sidebar>
      )}
    </>
  );
};

const TestName = ({ name }: { name: string }) => {
  return (
    <div className="text-purple-800 font-tertiary">{name ? name : "-"}</div>
  );
};

const TestDetails = ({ value }: { value: string }) => {
  return (
    <div title={value} className="font-tertiary break-words">
      {value ? value : "-"}
    </div>
  );
};

const TestStatus = ({ status }: { status: string }) => {
  return (
    <div>
      <span
        className={`${getStatusColors(status)} rounded-full py-[.4rem] px-4 text-sm text-center font-tertiary capitalize`}
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
  data: ILabTest;
  handleReports: (action: string, data: ILabTest) => void;
}) => {
  return (
    <div className="flex flex-row items-center stroke-purple-800 items-center justify-start">
      <Eye className="me-2" onClick={() => handleReports("view", data)} />
      {data?.fileUrl && (
        <Download onClick={() => handleReports("download", data)} />
      )}
    </div>
  );
};

export const TestDetailedView = ({ test }: { test: ILabTest }) => {
  const TableCell = ({
    label,
    value,
    highlight,
  }: {
    label: string | undefined;
    value: string | undefined;
    highlight?: boolean;
  }) => (
    <div title={value} className="border-b pb-1 max-w-[100%] truncate">
      <div className="text-gray-500 font-secondary text-sm pt-4">
        {label ? label : "-"}
      </div>
      <label className={`${highlight && "text-red-600"} font-primary`}>
        {value ? value : "-"}
      </label>
    </div>
  );

  const Result = () => {
    const columnFields = [
      {
        label: "RESULT",
        value: test?.result || "-",
        highlight:
          (test?.flag && test?.flag?.toLowerCase() !== NORMAL) ||
          (test?.flag && test?.flag?.toLowerCase() !== "n") ||
          false,
      },
      { label: "REFERENCE RANGE", value: test?.range, highlight: false },
      { label: "UNITS", value: test?.unit || "-", heightlight: false },
      {
        label: "FLAG",
        value: test?.flag,
        highlight:
          (test?.flag && test?.flag?.toLowerCase() !== "normal") ||
          (test?.flag && test?.flag?.toLowerCase() !== "n") ||
          false,
      },
    ];

    return (
      <div className="flex grid lg:grid-cols-2 gap-3">
        {columnFields.map((column, index) => {
          return (
            <TableCell
              key={index}
              label={column.label}
              value={column.value}
              highlight={column.highlight}
            />
          );
        })}
      </div>
    );
  };

  const columnKeys =
    test?.status?.toLowerCase() !== RESULT_STATUS.UPCOMING_APPOINTMENT
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
          return test["specimenUsed"];
        case "TESTED AT":
          return test["testedAt"];
        case "DATE/TIME COLLECTED":
          return test["collectedDateTime"];
        case "PHYSICAN PHONE":
          return test["contactInfo"];
        case "PHYSICIAN NAME":
          return test["physicianName"];
        case "DATE/TIME REPORTED":
          return test["dateOfTest"];
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
              <TableCell label={column} key={index} value={getValue(column)} />
            );
          })}
      </div>
      {test?.status?.toLowerCase() !== RESULT_STATUS.UPCOMING_APPOINTMENT && (
        <>
          <div className="font-primary text-primary flex justify-between py-6 mt-6 text-xl">
            Test Results
            {/* {test.status?.toLowerCase() === RESULT_STATUS.AVAILABLE && (
              <div
                className="flex flex-row items-center justify-center text-purple-800 cursor-pointer"
                onClick={() => {}}
              >
                <Eye className="stroke-purple-800 me-2" /> Preview
              </div>
            )} */}
          </div>
          {test?.status?.toLowerCase() === RESULT_STATUS.AVAILABLE ? (
            <Result />
          ) : (
            <label className="text:sm py-6">
              Results will be displayed here once physician uploaded it.
            </label>
          )}
          <div className="font-primary text-primary py-6 text-xl">
            Ordering Physician details
          </div>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3">
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
export default TestResult;
