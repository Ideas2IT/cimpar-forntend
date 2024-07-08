import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Download from "../../assets/icons/download.svg?react";
import Eye from "../../assets/icons/eye.svg?react";
import {
  IDetailedAppointment,
  IGetAppointmentByIdPayload,
  SidebarAppointment,
} from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import {
  IGetTestByIdPayload,
  IImmunization,
  IImmunizationPayload,
  ILabTest,
  IServiceHistory,
} from "../../interfaces/immunization";
import {
  appointmentStatus,
  getRowClasses,
  getStatusColor,
  getStatusColors,
} from "../../services/commonFunctions";
import { getAppointmentByIdThunk } from "../../store/slices/appointmentSlice";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import {
  getImmunizationByIdThunk,
  getLabTestByIdThunk,
  selectServiceHistory,
} from "../../store/slices/serviceHistorySlice";
import { AppDispatch } from "../../store/store";
import {
  APPOINTMENT,
  IMMUNIZATION,
  RESPONSE,
  SERVICE_CATEGORY
} from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { ImmunizationDetailView } from "../testResult/Immunization";
import { TestDetailedView } from "../testResult/TestResult";
import useToast from "../useToast/UseToast";

const ServiceHistory = ({
  handlePageChange,
}: {
  handlePageChange: (value: number) => void;
}) => {
  const [selectedService, setSelectedService] = useState<IServiceHistory>(
    {} as IServiceHistory
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const serviceData = useSelector(selectServiceHistory);
  const [selectedTest, setSelectedTest] = useState<ILabTest>({} as ILabTest);
  const [selectedAppointment, setSelectedAppointment] =
    useState<SidebarAppointment>({} as SidebarAppointment);
  const [selectedImmunization, setSelectedImmunization] =
    useState<IImmunization>({} as IImmunization);
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;
  const { toast, errorToast } = useToast();

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

  const handleReports = (action: string, row: IServiceHistory) => {
    if (row?.type?.toLowerCase() === IMMUNIZATION && patientId) {
      const payload: IImmunizationPayload = {
        immunization_id: row.id?.toString(),
        patient_id: patientId,
      };
      dispatch(getImmunizationByIdThunk(payload)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          if (response?.payload) {
            setSelectedImmunization(response?.payload as IImmunization);
            setIsOpenSidebar(true);
            setSelectedService(row);
          }
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Failed to load", errorResponse.message);
        }
      });
    } else if (row?.type?.toLowerCase() === SERVICE_CATEGORY.LAB_TEST) {
      const payload: IGetTestByIdPayload = {
        patient_id: patientId,
        test_id: row?.id?.toString(),
      };
      dispatch(getLabTestByIdThunk(payload)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          if (action === "view") {
            if (response?.payload) {
              setSelectedTest(response?.payload as ILabTest);
              setIsOpenSidebar(true);
              setSelectedService(row);
            }
          } else if (action === "download") {
            if (response?.payload && "fileUrl" in response.payload) {
              const fileUrl = (response.payload as ILabTest).fileUrl;

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
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Failed to load", errorResponse.message);
        }
      });
    } else if (row?.type?.toLowerCase() === APPOINTMENT) {
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
            const appointmentDate: SidebarAppointment = {
              allergies: appointment?.currentAllergies || "",
              conditions: appointment?.currentConditions || "",
              dateOfTest:
                dateFormatter(
                  appointment?.appointmentDate,
                  "dd MMM yyyy, hh:mm a"
                ) || "",
              testName: appointment?.appointmentFor || "",
              orderId: appointment?.id || "",
              otherAllergies: appointment?.otherAllergies || "",
              otherMedicalConditions: appointment?.otherConditions || "",
              status: appointmentStatus(appointment?.appointmentDate),
            };
            setSelectedAppointment(appointmentDate);
          }
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Failed to load", errorResponse.message);
        }
      });
    }
  };

  const SidebarHeader = () => {
    const getValue = (status: string) => {
      if (!status) return status;
      return status
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    return selectedService?.category?.toLowerCase() === "immunization" ? (
      <div>
        <label className="pe-3">Immunization Details</label>
        <span
          className={`sidebar-header capitalize ${getStatusColor(selectedImmunization.status)}`}
        >
          {selectedImmunization?.status
            ? getValue(selectedImmunization?.status)
            : "-"}
        </span>
      </div>
    ) : (
      <div className="flex items-center justify-between w-full">
        <div className="capitalize">
          <span className="pe-3">Lab Result</span>
          <span
            className={`${getStatusColors(selectedTest?.status)} py-2 capitalize px-3 rounded-full text-sm font-tertiary`}
          >
            {selectedTest?.status ? getValue(selectedTest.status) : "-"}
          </span>
        </div>
        {selectedTest?.fileUrl && (
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
      <div>
        <label className="pe-3">Lab Results</label>
        <span
          className={`sidebar-header ${getStatusColors(selectedAppointment.status)}`}
        >
          {getValue() || "-"}
        </span>
      </div>
    );
  };

  const serviceColumns = [
    {
      field: "category",
      header: "CATEGORY",
      bodyClassName: "py-2",
      body: (rowData: IServiceHistory) => (
        <div className="font-tertiary capitalize">{rowData?.category} </div>
      ),
    },
    {
      field: "serviceFor",
      header: "SERVICE FOR",
      body: (rowData: IServiceHistory) => (
        <TestDetails value={rowData.serviceFor || ""} />
      ),
    },
    {
      field: "dateOfService",
      header: "DATE OF SERVICE",
      body: (rowData: IServiceHistory) => (
        <TestDetails
          value={
            rowData?.dateOfService
              ? dateFormatter(rowData?.dateOfService, "dd MMM,yyyy")
              : ""
          }
        />
      ),
    },
    {
      field: "status",
      header: "STATUS",
      body: (rowData: IServiceHistory) => (
        <TestStatus status={rowData?.status || "-"} />
      ),
    },
  ];

  return (
    <>
      <div className="h-[calc(100vh-200px)] overflow-auto">
        <DataTable
          selection={selectedService}
          value={serviceData?.data}
          emptyMessage={
            <div className="w-full justify-center flex">
              No service history available.
            </div>
          }
          selectionMode="single"
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          className="mt-2 rowHoverable"
          rowClassName={() => getRowClasses("h-10 border-b")}
        >
          {serviceColumns?.map((column, index) => {
            return (
              <Column
                bodyClassName="py-4 max-w-[10rem]"
                key={index}
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
            body={(rowData) => (
              <ReportColumn data={rowData} handleReports={handleReports} />
            )}
          />
        </DataTable>
      </div>

      {serviceData?.pagination?.total_pages > 1 && (
        <CustomPaginator
          handlePageChange={handlePageChange}
          currentPage={serviceData?.pagination?.current_page}
          totalPages={serviceData?.pagination?.total_pages}
        />
      )}

      {!!Object.keys(selectedImmunization).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          header={<SidebarHeader />}
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
      )}
      {!!Object.keys(selectedTest).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          header={<SidebarHeader />}
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
      )}
      {!!Object.keys(selectedAppointment).length && (
        <Sidebar
          className="detailed-view w-[30rem]"
          header={<AppointmentHeader />}
          visible={!!Object.keys(selectedAppointment)?.length && isOpenSidebar}
          position="right"
          onHide={() => {
            setSelectedAppointment({} as SidebarAppointment);
            setIsOpenSidebar(false);
            setSelectedService({} as IServiceHistory);
          }}
        >
          <AppointentView appointment={selectedAppointment} />
        </Sidebar>
      )}
      <Toast ref={toast} />
    </>
  );
};

const TestDetails = ({ value }: { value: string }) => {
  return <div className="font-tertiary">{value ? value : "-"}</div>;
};
const TestStatus = ({ status }: { status: string }) => {
  return (
    <div>
      <span
        className={`${getStatusColors(status)} font-tertiary rounded-full py-[.4rem] px-4 text-sm text-center capitalize`}
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
  data: IServiceHistory;
  handleReports: (action: string, data: IServiceHistory) => void;
}) => {
  return (
    <div className="flex flex-row items-center stroke-purple-800 justify-start">
      <Eye className="me-2" onClick={() => handleReports("view", data)} />
      {data?.fileUrl && (
        <Download onClick={() => handleReports("download", data)} />
      )}
    </div>
  );
};

export const AppointentView = ({
  appointment,
}: {
  appointment: SidebarAppointment;
}) => {
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
        {label ? label : "-"}
      </div>
      <label className={`${highlight && "text-red-600"} font-primary`}>
        {value ? value : "-"}
      </label>
    </div>
  );

  const columnKeys = [
    {
      key: "ORDER ID",
      wrap: true,
    },
    {
      key: "DATE OF TEST",
      wrap: true,
    },
    { key: "MEDICAL CONDITIONS", wrap: true },
    { key: "OTHER MEDICAL CONDITIONS", wrap: true },
    { key: "ALLERGIES", wrap: true },
    { key: "OTHER ALLERGIES", wrap: true },
  ];

  const getValue = (title: string | undefined) => {
    if (title) {
      switch (title) {
        case "ORDER ID":
          return appointment["orderId"];
        case "DATE OF TEST":
          return appointment["dateOfTest"];
        case "MEDICAL CONDITIONS":
          return appointment["conditions"];
        case "OTHER MEDICAL CONDITIONS":
          return appointment["otherMedicalConditions"];
        case "ALLERGIES":
          return appointment["allergies"];
        case "OTHER ALLERGIES":
          return appointment["otherAllergies"];
        default:
          return "";
      }
    } else return "";
  };
  return (
    <div className="pt-6">
      <label className="font-primary text-sm">Test details</label>
      <div>
        <TableCell wrap={true} label="TEST NAME" value={appointment.testName} />
      </div>
      <div>
        {Boolean(columnKeys.length) &&
          columnKeys.map((column, index) => {
            return (
              <TableCell
                label={column.key}
                key={index}
                wrap={column.wrap}
                value={getValue(column.key)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ServiceHistory;
