import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows, DataTableValueArray } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Eye from "../../assets/icons/eye.svg?react";
import { IDetailedAppointment, IGetAppointmentByIdPayload, ISidebarAppointment } from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import { IGetTestByIdPayload, ILabTest } from "../../interfaces/immunization";
import { appointmentStatus, getStatusColors } from "../../services/commonFunctions";
import { getAppointmentByIdThunk } from "../../store/slices/appointmentSlice";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import { getLabTestByIdThunk, selectLabTests } from "../../store/slices/serviceHistorySlice";
import { AppDispatch } from "../../store/store";
import { DATE_FORMAT, NORMAL, RECORD_TYPE, RESPONSE, RESULT_STATUS } from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { AppointentView } from "../serviceHistory/ServiceHistory";
import useToast from "../useToast/UseToast";

const TestResult = ({ handlePageChange, }: { handlePageChange: (value: number) => void; }) => {

  const results = useSelector(selectLabTests);
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;

  const { errorToast, toast } = useToast();


  const dispatch = useDispatch<AppDispatch>();
  const [selectedTest, setSelectedTest] = useState({} as ILabTest);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState({} as ISidebarAppointment);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | []>([]);

  const columnHeaderStyle =
    "text-sm font-secondary py-1 border-b bg-white text-center";

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
    if (row.type?.toLowerCase() === RECORD_TYPE.APPOINTMENT) {
      const payload: IGetAppointmentByIdPayload = {
        appointment_id: row.orderId,
        patient_id: patientId,
      };
      dispatch(getAppointmentByIdThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const appointment = response.payload as IDetailedAppointment;
          const appointmentData: ISidebarAppointment = {
            category: appointment.category || "",
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
            testDetails: appointment?.testDetails,
            totalCost: appointment?.totalCost,
            centerLocation: appointment?.centerLocation,
            takeTestAt: appointment?.takeTestAt,
            paymentStatus: appointment?.paymentStatus,
            reasonForTest: appointment?.reasonForTest,
            otherReasonForTest: appointment?.other_reason || "",
          };
          setSelectedAppointment(appointmentData);
        } else {
          const errorMessage = response.payload as ErrorResponse;
          errorToast("Unable To Fetch", errorMessage.message);
        }
      });
    }
    action === "view" && setIsOpenSidebar(true);
  };
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

  const sidebarHeader = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="pe-3">{selectedTest.category}</span>
          <span
            className={`${getStatusColors(selectedTest.status)} py-2 px-3 rounded-full text-sm capitalize font-tertiary`}>{` ${selectedTest?.status}`}</span>
        </div>
        {selectedTest.fileUrl && (
          <Button
            title="Download test report"
            className="text-purple-900 bg-purple-100 rounded-lg py-2 px-3 border border-purple-900 me-3 text-[16px]"
            icon="pi pi-download"
            onClick={() => downloadDocument(selectedTest.fileUrl)}
          />
        )}
      </div>
    );
  };

  const appointmentHeader = () => {
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
          <span className="pe-3">{selectedAppointment.category}</span>
          <span
            className={`${getStatusColors(selectedAppointment.status)} py-2 px-3 rounded-full text-sm font-tertiary`}
          >
            {getValue()}
          </span>
        </div>
      </div>
    );
  };

  const renderTestName = (rowData: ILabTest) => <TestName name={rowData.testName} />
  const renderOrderId = (rowData: ILabTest) => <TestDetails value={rowData.orderId} />
  const renderDateOfTest = (rowData: ILabTest) => <TestDetails value={rowData.dateOfTest} />
  const renderPaymentStatus = (rowData: ILabTest) => <div> {rowData.paymentStatus || "-"} </div>
  const renderAppointmentStatus = (rowData: ILabTest) => <TestStatus status={rowData.status} />
  const renderActionColumn = (rowData: ILabTest) => <ReportColumn data={rowData} handleReports={handleReports} />

  const resultColumns = [
    {
      field: "testName",
      header: "TEST NAME",
      body: (rowData: ILabTest) => renderTestName(rowData),
    },
    {
      field: "orderId",
      header: "ORDER ID",
      body: (rowData: ILabTest) => renderOrderId(rowData),
    },
    {
      field: "dateOfTest",
      header: "DATE OF TEST",
      body: (rowData: ILabTest) => renderDateOfTest(rowData),
    },
    {
      header: "PAYMENT STATUS",
      body: (rowData: ILabTest) => renderPaymentStatus(rowData),
    },
    {
      field: "status",
      header: "APPOINTMENT STATUS",
      body: (rowData: ILabTest) => renderAppointmentStatus(rowData),
    },
    {
      field: "",
      header: "",
      body: (rowData: ILabTest) => renderActionColumn(rowData),
    },
  ];

  const isRowExpandable = (rowData: ILabTest) => rowData?.results?.length > 0;

  const toggleRow = (event: React.MouseEvent, rowData: ILabTest) => {
    event.stopPropagation();
    if (!isRowExpandable(rowData)) return;

    setExpandedRows((prevExpanded: any) => {
      const isExpanded = prevExpanded?.some((r: any) => r.orderId === rowData.orderId);
      return isExpanded
        ? prevExpanded.filter((r: any) => r.orderId !== rowData.orderId)
        : [...(prevExpanded || []), rowData];
    });
  };

  const handleViewLabTest = (action: string, row: any) => {
    const payload: IGetTestByIdPayload = {
      patient_id: patientId,
      test_id: row?.orderId?.toString(),
    };
    dispatch(getLabTestByIdThunk(payload)).then((response) => {
      if (response?.meta?.requestStatus !== RESPONSE.FULFILLED) {
        return
      }


      const handleViewAction = () => {
        if (response?.payload) {
          const _response = response?.payload as ILabTest;
          setSelectedTest(_response);
          setIsOpenSidebar(true);
        }
      }

      const handleDownload = () => {
        if (response?.payload && "fileUrl" in response.payload) {
          const fileUrl = (response.payload).fileUrl;

          if (fileUrl) {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = "document";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            errorToast(
              "File not found",
              "This observation does not have a file"
            );
            return;
          }
        }
      }

      if (action === "view") { handleViewAction() } else {
        handleDownload()
      }
    })
  }

  const expanderTemplate = (rowData: ILabTest) => {
    const isExpanded = Array.isArray(expandedRows) ? expandedRows.some((r: any) => r.orderId === rowData.orderId) : false;
    return (
      <Button
        type="button"
        className={`${isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'} focus:shadow-none`}
        disabled={!isRowExpandable(rowData)}
        onClick={(e) => toggleRow(e, rowData)}
      />
    );
  };


  const viewReportColumn = (rowData: ILabTest) => {
    return (<>
      <Button
        title="View report"
        label="View Report"
        className="text-purple-900  rounded-full  me-3 focus:shadow-none text-[16px]"
        onClick={() => handleViewLabTest('view', rowData)}
      />
      <Button
        title="Download report"
        icon="pi pi-download"
        className={`${rowData.fileUrl ? "font-bold text-purple-900 rounded-full  me-3 focus:shadow-none text-[16px]} cursor-pointer" : 'hidden'}`}
        onClick={() => handleViewLabTest('download', rowData)}
      />
    </>
    );
  }

  const rowExpansionTemplate = (data: ILabTest) => {
    return (
      <div className="text-center">
        <DataTable value={data?.results} emptyMessage="No Available Results" className="p-0 m-0 lg:max-w-[80%]" rowClassName={() => "border-b custom-row"} tableClassName="p-0">
          <Column field="testName" header="TEST NAME" headerClassName="text-sm font-secondary py-1 border-b bg-gray-300 max-w-[15rem]"
          />
          <Column
            field=""
            header="Action"
            className="max-w-[3rem]"
            headerClassName="text-sm font-secondary py-1 border-b bg-gray-300"
            body={(rowData) => viewReportColumn(rowData)}
          />
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <div className="h-[calc(100vh-175px)] overflow-auto">
        <DataTable
          selection={selectedTest}
          value={results?.data}
          emptyMessage={
            <div className="flex w-full justify-center">No tests available</div>
          }
          dataKey="orderId"
          tableStyle={{ minWidth: "50rem" }}
          className="mt-2"
          rowClassName={() => "h-10 border-b"}
          expandedRows={expandedRows}
          rowExpansionTemplate={rowExpansionTemplate}
          stripedRows
        >
          <Column
            key="expander"
            exportable={true}
            expander
            body={(row) => expanderTemplate(row)}
            className="w-[4rem]"
            headerClassName="text-sm font-secondary py-1 border-b bg-white"
          />
          {resultColumns.map((column, index) => {
            return (
              <Column
                key={column.header + index}
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
          header={sidebarHeader}
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
          header={appointmentHeader}
          visible={!!Object.keys(selectedAppointment).length && isOpenSidebar}
          position="right"
          onHide={() => {
            setSelectedAppointment({} as ISidebarAppointment);
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
    <div className="text-purple-800 font-tertiary">{name || "-"}</div>
  );
};

const TestDetails = ({ value }: { value: string }) => {
  return (
    <div title={value} className="font-tertiary break-words">
      {value ?? "-"}
    </div>
  );
};

const TestStatus = ({ status }: { status: string }) => {
  return (
    <div>
      <span
        className={`${getStatusColors(status)} rounded-full py-[.4rem] px-4 text-sm text-center font-tertiary capitalize`}
      >
        {status ?? "-"}
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
    <div className="flex flex-row items-center stroke-purple-800 items-center cursor-pointer justify-start">
      <Eye className="me-2" onClick={() => handleReports("view", data)} />
    </div>
  );
};

export const TestDetailedView = ({ test }: { test: ILabTest }) => {

  const result = () => {

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
      { label: "UNITS", value: test?.unit || "-", heighlight: false },
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
        {columnFields.map((column) => {
          return (
            <TableCell
              key={column.label}
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
          return test?.orderId || '-';
        case "DATE OF TEST":
          return test?.dateOfTest || '-';
        case "SPECIMEN USED":
          return test?.specimenUsed || '-';
        case "TESTED AT":
          return test?.testedAt || '-';
        case "DATE/TIME COLLECTED":
          return test?.collectedDateTime || '-';
        case "PHYSICAN PHONE":
          return test?.contactInfo || '-';
        case "PHYSICIAN NAME":
          return test?.physicianName || '-';
        case "DATE/TIME REPORTED":
          return test?.dateOfTest || '-';
        default:
          return "";
      }
    } else return "";
  };

  return (
    <div className="pt-6">
      <p className="font-primary text-sm">Test details</p>
      <div>
        <TableCell label="TEST NAME" value={test.testName} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {Boolean(columnKeys.length) &&
          columnKeys.map((column) => {
            return (
              <TableCell label={column} key={column} value={getValue(column)} />
            );
          })}
      </div>
      {test?.status?.toLowerCase() !== RESULT_STATUS.UPCOMING_APPOINTMENT && (
        <>
          <div className="font-primary text-primary flex justify-between py-6 mt-6 text-xl">
            Test Results
          </div>
          {test?.status?.toLowerCase() === RESULT_STATUS.AVAILABLE ? (
            result()
          ) : (
            <p className="text:sm py-6">
              Results will be displayed here once physician uploaded it.
            </p>
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
      {label ?? "-"}
    </div>
    <label className={`${highlight && "text-red-600"} font-primary`}>
      {value ?? "-"}
    </label>
  </div>
);
export default TestResult;
