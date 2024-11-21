import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import {
  DATE_FORMAT,
  PAGE_LIMIT,
  PATH_NAME,
  RESPONSE,
  ROLE,
} from "../../utils/AppConstants";
import { useDispatch, useSelector } from "react-redux";
// import { selectedRole } from "../../store/slices/commonSlice";
import { getRowClasses } from "../../services/commonFunctions";
import {
  deleteVisitHistoryByIdThunk,
  getVisitHistoryByPatientIdThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { AppDispatch } from "../../store/store";
import {
  IDeleteVisitHistoryPayload,
  IVisitHistory,
} from "../../interfaces/visitHistory";
import { dateFormatter } from "../../utils/Date";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { selectRole } from "../../store/slices/loginSlice";
import { IGetEncounterPaylaod } from "../../interfaces/patient";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { ErrorResponse } from "../../interfaces/common";
// import CustomModal from "../customModal/CustomModal";
// import PdfViewer from "../PdfViewer/PdfViewer";

const VisitHistory = () => {
  const selectedPatinet = useSelector(selectSelectedPatient);
  const [selectedHistory, setSelectedHistory] = useState({} as IVisitHistory);
  // const [selectedReport, setSelectedReport] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast, successToast } = useToast();
  const [encounterPayload, setEncounterPayload] = useState({
    count: PAGE_LIMIT,
    page: 1,
    patient_id: selectedPatinet?.basicDetails?.id,
  } as IGetEncounterPaylaod);

  useEffect(() => {
    encounterPayload?.patient_id &&
      dispatch(getVisitHistoryByPatientIdThunk(encounterPayload)).then(
        ({ meta }) => {
          if (meta.requestStatus === RESPONSE.REJECTED) {
            errorToast("Failed to fetch", "Not able to load Visit History");
          }
        }
      );
  }, [encounterPayload]);

  const downloadDocument = (fileUrl: string) => {
    if (!fileUrl) {
      return;
    }
    if (fileUrl) {
      const downloadUrl = fileUrl;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const handleDeleteEncounter = (id: string) => {
    if (selectedPatinet?.basicDetails?.id && id) {
      const payload: IDeleteVisitHistoryPayload = {
        patinetId: selectedPatinet.basicDetails.id,
        visitHistoryId: id,
      };
      dispatch(deleteVisitHistoryByIdThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to delete Visit History", errorResponse.message);
        } else {
          successToast(
            "Deleted Visit History",
            "Visit history has been removed successfully"
          );
        }
      });
    }
  };
  const columnList = [
    {
      id: 1,
      field: "vistLocation",
      header: "VISIT LOCATION",
      body: (row: IVisitHistory) => <TableCell value={row.visitLocation} />,
    },
    {
      id: 2,
      field: "admissionDate",
      header: "ADMISSION DATE",
      body: (row: IVisitHistory) => (
        <TableCell
          value={dateFormatter(row.admissionDate, DATE_FORMAT.DD_MMM_YYYY)}
        />
      ),
    },
    {
      id: 3,
      field: "dischargeDate",
      header: "DISCHARGE DATE",
      body: (row: IVisitHistory) => (
        <TableCell
          value={dateFormatter(row.dischargeDate, DATE_FORMAT.DD_MMM_YYYY)}
        />
      ),
    },
    {
      id: 4,
      field: "visitReason",
      header: "VISIT REASON",
      body: (row: IVisitHistory) => <TableCell value={row.visitReason} />,
    },
    {
      id: 5,
      field: "",
      header: "",
      body: (row: IVisitHistory) => (
        <MediaColumn
          handleView={viewRecord}
          data={row}
          handleDelete={handleDeleteEncounter}
        />
      ),
    },
  ];

  const historyField = [
    {
      field: "VISIT LOCATION",
      value: selectedHistory.visitLocation,
    },
    {
      field: "HOSPITAL CONTACT INFORMATION",
      value: selectedHistory.hospitalContact,
    },
    {
      field: "ADMISSION DATE",
      value: dateFormatter(
        selectedHistory.admissionDate,
        DATE_FORMAT.DD_MMM_YYYY
      ),
    },
    {
      field: "DISCHARGE DATE",
      value: dateFormatter(
        selectedHistory.dischargeDate,
        DATE_FORMAT.DD_MMM_YYYY
      ),
    },
    {
      field: "REASON FOR VISIT",
      value: selectedHistory.visitReason,
      full: true,
    },
    {
      field: "PRIMARY CARE TEAM",
      value: selectedHistory.primaryCareTeam,
      full: true,
    },
    {
      field: "TREATMENT SUMMARY",
      value: selectedHistory.treatmentSummary,
      full: true,
    },
    {
      field: "FOLLOW-UP CARE",
      value: selectedHistory.followUpCare,
      full: true,
    },
    {
      field: "PATIENT NOTES",
      value: selectedHistory.patientNotes,
      full: true,
    },
  ];

  const TableCell = ({ value }: { value: string }) => {
    return (
      <div className="font-tertiary text-[16px]">{value ? value : "-"}</div>
    );
  };

  const viewRecord = (record: IVisitHistory) => {
    setSelectedHistory(record);
  };

  const DetailedHistory = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {historyField.map((field, index) => {
          return (
            <div key={index} className={`${field.full ? "col-span-2" : ""}`}>
              <FiledDetails label={field.field} value={field?.value || ""} />
            </div>
          );
        })}
        {!!selectedHistory?.files?.length && (
          <div className="col-span-2">
            <label className="text-lg pb-4 font-primary block">
              Related Documents
            </label>
            {selectedHistory?.files?.map((report, index) => {
              {
                return (
                  <Button
                    style="outline"
                    className="font-primary bg-white text-lg m-1"
                    onClick={() => downloadDocument(report)}
                    // onClick={() => setSelectedReport(report)}
                  >
                    <>
                      <i className="pi pi-eye px-2" />
                      {`Medical Report${index + 1}.pdf`}
                    </>
                  </Button>
                );
              }
            })}
          </div>
        )}
        {/* {selectedReport && (
          <CustomModal
            closeButton={true}
            handleClose={() => {
              setSelectedReport("");
            }}
            styleClass="h-full w-[90%]"
          >
            <PdfViewer fileUrl={selectedReport} />
          </CustomModal>
        )} */}
      </div>
    );
  };

  const handlePageChange = (value: number) => {
    setEncounterPayload((prev) => ({ ...prev, page: value }));
  };

  return (
    <>
      <div className="h-[calc(100vh-200px)] overflow-auto">
        <DataTable
          selection={selectedHistory}
          emptyMessage={
            <div className="flex justify-center">No visit history to show!</div>
          }
          value={selectedPatinet?.visitHistory?.data}
          selectionMode="single"
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          className="mt-2 max-h-[90%] rowHoverable"
          rowClassName={() => getRowClasses("h-10 border-b")}
          scrollHeight="40rem"
        >
          {columnList.map((column) => {
            return (
              <Column
                headerClassName="py-1 border-b"
                key={column.id}
                field={column.field}
                header={column.header}
                body={column.body}
              />
            );
          })}
        </DataTable>
      </div>
      <Sidebar
        onHide={() => setSelectedHistory({} as IVisitHistory)}
        className="detailed-view w-[35rem]"
        header={"Visit Details"}
        visible={!!Object.keys(selectedHistory).length}
        position="right"
      >
        <DetailedHistory />
      </Sidebar>
      {selectedPatinet?.visitHistory?.pagination?.total_pages > 1 && (
        <CustomPaginator
          currentPage={selectedPatinet?.visitHistory?.pagination?.current_page}
          handlePageChange={handlePageChange}
          totalPages={selectedPatinet?.visitHistory?.pagination?.total_pages}
        />
      )}
      <Toast ref={toast} />
    </>
  );
};

const MediaColumn = ({
  data,
  handleView,
  handleDelete,
}: {
  data: IVisitHistory;
  handleView: (data: IVisitHistory) => void;
  handleDelete: (encounterId: string) => void;
}) => {
  const role = useSelector(selectRole);
  const navigate = useNavigate();
  return (
    <div
      className={`flex flex-row font-bold justify-between items-center font-bold max-w-[5rem] text-purple-800`}
    >
      <button className="flex items-center" onClick={() => handleView(data)}>
        <i className="pi pi-eye" />
      </button>
      <button
        className={`items-center p-0 m-0 ${role === ROLE.ADMIN && "hidden"}`}
        disabled={role === ROLE.ADMIN}
      >
        <i
          className={`pi pi-pen-to-square px-3 ${role === ROLE.ADMIN && "hidden"}`}
          onClick={() => navigate(`${PATH_NAME.EDIT_VISIT_HISTORY}/${data.id}`)}
        />
      </button>
      <button className={`${role === ROLE.ADMIN && "hidden"}`}>
        <i
          onClick={() => handleDelete(data?.id || "")}
          className={`pi pi-trash text-red-500 me-2 ${role === ROLE.ADMIN && "hidden"}`}
        />
      </button>
    </div>
  );
};

export const FiledDetails = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="border-b">
    <div className="input-label text-gray-1000 font-secondary pt-4 pb-1">
      {label}
    </div>
    <label className="font-primary max-h-[100%] text-ellpisis">
      {value ? value : "-"}
    </label>
  </div>
);

export default VisitHistory;
