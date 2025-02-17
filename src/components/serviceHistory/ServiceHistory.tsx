import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows, DataTableValueArray } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Eye from "../../assets/icons/eye.svg?react";
import { IDetailedAppointment, IGetAppointmentByIdPayload, ISidebarAppointment, } from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import { IGetTestByIdPayload, IImmunization, IImmunizationPayload, ILabTest, IServiceHistory, } from "../../interfaces/immunization";
import { capitalizeFirstLetter, getStatusColor, getStatusColors, } from "../../services/commonFunctions";
import { getAppointmentByIdThunk } from "../../store/slices/appointmentSlice";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import { getImmunizationByIdThunk, getLabTestByIdThunk, selectServiceHistory, } from "../../store/slices/serviceHistorySlice";
import { AppDispatch } from "../../store/store";
import { APPOINTMENT, DATE_FORMAT, IMMUNIZATION, RESPONSE, SERVICE_CATEGORY, } from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import TestDetailsTable from "../appointments/TestDetailsTable";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { ImmunizationDetailView } from "../testResult/Immunization";
import { TestDetailedView } from "../testResult/TestResult";
import useToast from "../useToast/UseToast";

const ServiceHistory = ({
  handlePageChange,
}: {
  handlePageChange: (value: number) => void;
}) => {

  const dispatch = useDispatch<AppDispatch>();

  const serviceData = useSelector(selectServiceHistory);
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;

  const { toast, errorToast } = useToast();

  const [selectedService, setSelectedService] = useState<IServiceHistory>({} as IServiceHistory);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ILabTest>({} as ILabTest);
  const [selectedAppointment, setSelectedAppointment] = useState<ISidebarAppointment>({} as ISidebarAppointment);
  const [selectedImmunization, setSelectedImmunization] = useState<IImmunization>({} as IImmunization);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | []>([]);

  const handlePaginator = (value: number) => {
    handlePageChange(value);
  }

  const downloadDocument = (url: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      errorToast(
        "Failed to download",
        "This observation does not have a file to download"
      );
    }
  };

  const handleReports = (row: IServiceHistory) => {
    if (row?.type?.toLowerCase() === IMMUNIZATION && patientId) {
      const payload: IImmunizationPayload = {
        immunization_id: row.id?.toString(),
        patient_id: patientId,
      };
      dispatch(getImmunizationByIdThunk(payload)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          if (response?.payload) {
            const _response = response?.payload as IImmunization
            setSelectedImmunization(_response);
            setIsOpenSidebar(true);
            setSelectedService(row);
          }
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Failed to load", errorResponse.message);
        }
      });
    }
    else if (row?.type?.toLowerCase() === APPOINTMENT) {
      const payload: IGetAppointmentByIdPayload = {
        appointment_id: row.id?.toString(),
        patient_id: patientId,
      };
      dispatch(getAppointmentByIdThunk(payload)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          if (response?.payload) {
            setIsOpenSidebar(true);
            setSelectedService(row);
            const appointment = response?.payload as IDetailedAppointment;
            const appointmentDate: ISidebarAppointment = {
              category: appointment.category || "",
              allergies: appointment?.currentAllergies || "",
              conditions: appointment?.currentConditions || "",
              dateOfTest:
                dateFormatter(
                  appointment?.appointmentDate,
                  DATE_FORMAT.DD_MMMM_YYYY_HH_MMA
                ) || "",
              testName: appointment?.appointmentFor || "",
              orderId: appointment?.id || "",
              otherAllergies: appointment?.otherAllergies || "",
              otherMedicalConditions: appointment?.otherConditions || "",
              status: appointment?.status,
              testDetails: appointment?.testDetails,
              totalCost: appointment?.totalCost,
              centerLocation: appointment?.centerLocation || "",
              takeTestAt: appointment?.takeTestAt || "",
              paymentStatus: appointment.paymentStatus,
              reasonForTest: appointment?.reason_for_test,
              otherReasonForTest: appointment?.other_reason || "",
            };
            setSelectedAppointment(appointmentDate);
          }
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Unable To Fetch", errorResponse.message);
        }
      });
    }
  };

  const handleViewLabTest = (action: string, row: any) => {
    const payload: IGetTestByIdPayload = {
      patient_id: patientId,
      test_id: row?.orderId?.toString(),
    };
    dispatch(getLabTestByIdThunk(payload)).then((response) => {
      if (response?.meta?.requestStatus !== RESPONSE.FULFILLED) {
        return;
      }

      const handleViewAction = () => {
        if (!response?.payload) return;
        const _response = response.payload as ILabTest;
        setSelectedTest(_response);
        setIsOpenSidebar(true);
        setSelectedService({ ...row, category: _response.category || '-' });
      };

      const handleDownloadAction = () => {
        const fileUrl = (response.payload as { fileUrl?: string })?.fileUrl;
        if (!fileUrl) {
          errorToast("File not found", "This observation does not have a file");
          return;
        }
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      if (action === "view") {
        handleViewAction();
      } else if (action === "download") {
        handleDownloadAction();
      }
    });
  };



  const sidebarHeader = () => {
    return selectedService?.category?.toLowerCase() ===
      SERVICE_CATEGORY.IMMUNIZATION ? (
      <div className="flex">
        <span className="pe-3">Immunization Details</span>
        <div className={`sidebar-header capitalize ${getStatusColor(selectedImmunization.status)}`}>{selectedImmunization?.status ?? ""}</div>
      </div>
    ) : (
      <div className="flex items-center justify-between w-full">
        <div className="capitalize">
          <span className="pe-3">{selectedService?.category || ""}</span>
          <span
            className={`${getStatusColors(selectedTest?.status)} py-2 text-center capitalize px-3 rounded-full text-sm font-tertiary`}
          > {selectedTest.status ?? ""}
          </span>
        </div>
        {selectedTest?.fileUrl && (
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
    return (
      <div>
        <label className="pe-3">{selectedAppointment.category || "-"}</label>
        <span
          className={`sidebar-header ms-4 capitalize ${getStatusColors(selectedAppointment.status)}`}> {selectedAppointment?.status ?? ''}
        </span>
      </div>
    );
  };

  const renderCategory = (rowData: IServiceHistory) => <div className="font-tertiary capitalize">{rowData?.category} </div>
  const renderDateOfService = (rowData: IServiceHistory) => <TestDetails value={rowData?.dateOfService ? dateFormatter(rowData?.dateOfService, DATE_FORMAT.DD_MMM_YYYY) : ""} />
  const renderPaymentStatus = (rowData: IServiceHistory) => <div className="font-tertiary">{rowData.paymentStatus}</div>
  const renderAppointmentStatus = (rowData: IServiceHistory) => <TestStatus status={rowData?.status ?? "-"} />
  const renderServiceFor = (rowData: IServiceHistory) => <TestDetails value={rowData.serviceFor || ""} />

  const serviceColumns = [
    {
      field: "category",
      header: "CATEGORY",
      bodyClassName: "py-2",
      body: (rowData: IServiceHistory) => renderCategory(rowData),
    },
    {
      field: "serviceFor",
      header: "SERVICE FOR",
      body: (rowData: IServiceHistory) => renderServiceFor(rowData),
    },
    {
      field: "dateOfService",
      header: "DATE OF SERVICE",
      body: (rowData: IServiceHistory) => renderDateOfService(rowData),
    },
    {
      field: "",
      header: "PAYMENT STATUS",
      bodyClassName: "py-1",
      body: (rowData: IServiceHistory) => renderPaymentStatus(rowData),
    },
    {
      field: "status",
      header: "APPOINTMENT STATUS",
      body: (rowData: IServiceHistory) => renderAppointmentStatus(rowData),
    },
  ];

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
        className={`${rowData.fileUrl ? "font-bold text-purple-900 rounded-full  me-3 focus:shadow-none text-[16px]}" : 'hidden'}`}
        onClick={() => handleViewLabTest('download', rowData)}
      />
    </>
    );
  }

  const rowExpansionTemplate = (data: IServiceHistory) => {
    return (
      <div className="text-center">
        <DataTable value={data?.results} emptyMessage="No Available Results" className="p-0 m-0 lg:max-w-[80%]" rowClassName={() => "border-b custom-row"} tableClassName="p-0">
          <Column field="testName" header="TEST NAME" headerClassName="text-sm font-secondary py-1 border-b bg-gray-300 max-w[15rem]"
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

  const emptyMessage = () => {
    return <div className="w-full justify-center flex">
      No service history available.
    </div>
  }

  const isRowExpandable = (rowData: IServiceHistory) => rowData.results.length > 0;
  const toggleRow = (event: React.MouseEvent, rowData: any) => {
    event.stopPropagation();
    if (!isRowExpandable(rowData)) return;

    setExpandedRows((prevExpanded: any) => {
      const isExpanded = prevExpanded?.some((r: any) => r.id === rowData.id);
      return isExpanded
        ? prevExpanded.filter((r: any) => r.id !== rowData.id)
        : [...(prevExpanded || []), rowData];
    });
  };

  const expanderTemplate = (rowData: IServiceHistory) => {
    const isExpanded = Array.isArray(expandedRows) ? expandedRows.some((r: any) => r.id === rowData.id) : false;
    return (
      <Button
        type="button"
        className={`${isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'} focus:shadow-none`}
        disabled={!isRowExpandable(rowData)}
        onClick={(e) => toggleRow(e, rowData)}
      />
    );
  };

  const showReportsButton = (rowData: IServiceHistory) => {
    return <ReportColumn data={rowData} handleReports={handleReports} />
  }

  return (
    <>
      <div className="h-[calc(100vh-175px)] overflow-auto">
        <DataTable
          value={serviceData?.data}
          emptyMessage={emptyMessage}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          className="mt-2"
          rowClassName={() => "h-10 border-b"}
          selection={selectedService}
          expandedRows={expandedRows}
          rowExpansionTemplate={rowExpansionTemplate}
          stripedRows
        >
          <Column
            exportable={true}
            expander
            body={(row) => expanderTemplate(row)}
            className="w-[4rem]"
            headerClassName="text-sm font-secondary py-1 border-b bg-white"
          />
          {serviceColumns?.map((column) => {
            return (
              <Column
                bodyClassName="py-4 max-w-[10rem]"
                key={column.header}
                field={column?.field}
                header={column?.header}
                body={column?.body}
                headerClassName="text-sm font-secondary py-1 border-b bg-white"
              />
            );
          })}
          <Column
            field=""
            header=""
            headerClassName="text-sm font-secondary py-1 border-b bg-white"
            body={(rowData: IServiceHistory) => showReportsButton(rowData)}
          />
        </DataTable>
        {serviceData?.pagination?.total_pages > 1 && (
          <CustomPaginator
            handlePageChange={(value) => handlePaginator(value)}
            currentPage={serviceData?.pagination?.current_page}
            totalPages={serviceData?.pagination?.total_pages}
          />
        )}
      </div>

      {
        !!Object.keys(selectedImmunization).length && (
          <Sidebar
            className="detailed-view w-[30rem]"
            header={sidebarHeader}
            visible={!!Object.keys(selectedImmunization)?.length && isOpenSidebar}
            position="right"
            onHide={() => {
              setSelectedImmunization({} as IImmunization);
              setIsOpenSidebar(false);
              setSelectedService({} as IServiceHistory);
            }}
          >
            <ImmunizationDetailView data={selectedImmunization} />
          </Sidebar>
        )
      }
      {
        !!Object.keys(selectedTest).length && (
          <Sidebar
            className="detailed-view w-[30rem]"
            header={sidebarHeader}
            visible={!!Object.keys(selectedTest)?.length && isOpenSidebar}
            position="right"
            onHide={() => {
              setSelectedTest({} as ILabTest);
              setIsOpenSidebar(false);
              setSelectedService({} as IServiceHistory);
            }}
          >
            <TestDetailedView test={selectedTest} />
          </Sidebar>
        )
      }
      {
        !!Object.keys(selectedAppointment).length && (
          <Sidebar
            className="detailed-view w-[30rem]"
            header={appointmentHeader}
            visible={!!Object.keys(selectedAppointment)?.length && isOpenSidebar}
            position="right"
            onHide={() => {
              setSelectedAppointment({} as ISidebarAppointment);
              setIsOpenSidebar(false);
              setSelectedService({} as IServiceHistory);
            }}
          >
            <AppointentView appointment={selectedAppointment} />
          </Sidebar>
        )
      }
      <Toast ref={toast} />
    </>
  );
};

const TestDetails = ({ value }: { value: string }) => {
  return <div className="font-tertiary">{value ?? "-"}</div>;
};
const TestStatus = ({ status }: { status: string }) => {
  return (
    <div>
      <span
        className={`${getStatusColors(status)} font-tertiary rounded-full py-[.4rem] px-4 text-sm text-center capitalize`}
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
  data: IServiceHistory;
  handleReports: (data: IServiceHistory) => void;
}) => {
  return (
    <div className="flex flex-row items-center stroke-purple-800 justify-start">
      <Eye className="me-2 cursor-pointer" onClick={() => handleReports(data)} />
    </div>
  );
};
export const AppointentView = ({
  appointment,
}: {
  appointment: ISidebarAppointment;
}) => {
  const columnKeys = [
    {
      key: "ORDER ID",
      wrap: true,
    },
    {
      key: "PAYMENT STATUS",
    },
    {
      key: "TEST TO BE TAKEN AT",
    },
    {
      key: "SERVICE CENTER LOCATION",
    },
    {
      key: "DATE & TIME OF TEST",
      wrap: true,
    },
    { key: "REASON FOR TEST" },

    { key: "MEDICAL CONDITIONS", wrap: true },
    { key: "OTHER MEDICAL CONDITIONS", wrap: true },
    { key: "ALLERGIES", wrap: true },
    { key: "OTHER ALLERGIES", wrap: true },
  ];

  function getReasonForTest() {
    if (appointment.reasonForTest === "Other") {
      return appointment.otherReasonForTest;
    }
    return appointment.reasonForTest;
  }

  const getValue = (title: string | undefined) => {
    if (title) {
      switch (title) {
        case "ORDER ID":
          return appointment.orderId;
        case "DATE & TIME OF TEST":
          return appointment.dateOfTest;
        case "REASON FOR TEST":
          return getReasonForTest();
        case "MEDICAL CONDITIONS":
          return appointment.conditions || "None";
        case "OTHER MEDICAL CONDITIONS":
          return appointment?.otherMedicalConditions || "None";
        case "ALLERGIES":
          return appointment?.allergies || "None";
        case "OTHER ALLERGIES":
          return appointment?.otherAllergies || "None";
        case "SERVICE CENTER LOCATION":
          return appointment?.centerLocation ?? 'N/A';
        case "TEST TO BE TAKEN AT":
          return capitalizeFirstLetter(appointment.takeTestAt);
        case "TOTAL COST":
          return `$${appointment.totalCost ? parseFloat(Number(appointment?.totalCost).toFixed(2)) : "0"}`;
        case "PAYMENT STATUS":
          return appointment.paymentStatus;
        default:
          return "";
      }
    } else return "";
  };
  return (
    <div className="pt-6">
      <p className="font-primary text-sm">Test Details</p>
      <div className="mt-4">
        <TestDetailsTable
          testLocation={appointment.takeTestAt}
          totalCost={appointment.totalCost}
          testDetails={appointment.testDetails}
        />
      </div>
      <div>
        {Boolean(columnKeys?.length) &&
          columnKeys.map((column) => {
            return (
              <TableCell
                label={column.key}
                key={column.key}
                wrap={column.wrap}
                value={getValue(column.key)}
              />
            );
          })}
      </div>
    </div>
  );
};

const TableCell = ({
  label,
  value,
  highlight,
  wrap,
}: {
  label: string | undefined;
  value: string | undefined;
  highlight?: boolean;
  wrap?: boolean;
}) => (
  <div
    title={value}
    className={`'border-b pb-1 max-w-[100%]' ${wrap ? "" : "truncate"}`}
  >
    <div className="text-gray-500 font-secondary text-sm pt-4">
      {label ?? "-"}
    </div>
    <label className={`${highlight && "text-red-600"} font-primary`}>
      {value ?? "-"}
    </label>
  </div>
);

export default ServiceHistory;
