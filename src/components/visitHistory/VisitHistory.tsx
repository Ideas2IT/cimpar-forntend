import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { PATH_NAME, ROLE } from "../../utils/AppConstants";
import { useDispatch, useSelector } from "react-redux";
import { selectedRole } from "../../store/slices/commonSlice";
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

const VisitHistory = () => {
  const selectedPatinet = useSelector(selectSelectedPatient);
  const [selectedHistory, setSelectedHistory] = useState({} as IVisitHistory);
  const dispatch = useDispatch<AppDispatch>();
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender?.current) {
      initialRender.current = false;
      return;
    }
    dispatch(
      getVisitHistoryByPatientIdThunk(selectedPatinet?.basicDetails?.id)
    );
  }, []);

  const handleDeleteEncounter = (id: string) => {
    if (selectedPatinet?.basicDetails?.id && id) {
      const payload: IDeleteVisitHistoryPayload = {
        patinetId: selectedPatinet.basicDetails.id,
        visitHistoryId: id,
      };
      dispatch(deleteVisitHistoryByIdThunk(payload));
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
        <TableCell value={dateFormatter(row.admissionDate, "dd MMM,yyyy")} />
      ),
    },
    {
      id: 3,
      field: "dischargeDate",
      header: "DISCHARGE DATE",
      body: (row: IVisitHistory) => (
        <TableCell value={dateFormatter(row.dischargeDate, "dd MMM,yyyy")} />
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
      value: selectedHistory.admissionDate,
    },
    {
      field: "DISCHARGE DATE",
      value: selectedHistory.dischargeDate,
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
    return <div className="font-tertiary text-[16px]">{value}</div>;
  };

  const viewRecord = (record: IVisitHistory) => {
    setSelectedHistory(record);
  };

  const DetailedHistory = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {historyField.map((field) => {
          return (
            <div className={`${field.full ? "col-span-2" : ""}`}>
              <FiledDetails label={field.field} value={field.value} />
            </div>
          );
        })}
        <div className="col-span-2">
          <label className="text-lg pb-4 font-primary block">
            Related Documents
          </label>

          <Button style="outline" className="font-primary bg-white text-lg">
            <>
              <i className="pi pi-eye px-2" />
              Medical Report2.pdf
            </>
          </Button>
          <Button
            style="outline"
            className="font-primary bg-white text-lg mx-5"
          >
            <>
              <i className="pi pi-eye px-2" />
              Medical Report1.pdf
            </>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <DataTable
        selection={selectedHistory}
        emptyMessage={
          <div className="flex justify-center">No visit history to show!</div>
        }
        value={selectedPatinet.visitHistory}
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
      <Sidebar
        onHide={() => setSelectedHistory({} as IVisitHistory)}
        className="detailed-view w-[35rem]"
        header={"Visit Details"}
        visible={!!Object.keys(selectedHistory).length}
        position="right"
      >
        <DetailedHistory />
      </Sidebar>
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
  const role = useSelector(selectedRole);
  const navigate = useNavigate();
  return (
    <div className="flex flex-row font-bold justify-between items-center font-bold max-w-[5rem] text-purple-800">
      <button className="flex items-center" onClick={() => handleView(data)}>
        <i className="pi pi-eye" />
      </button>
      <button className="items-center p-0 m-0" disabled={role === ROLE.ADMIN}>
        <i
          className={`pi pi-pen-to-square px-3 ${role === ROLE.ADMIN && "cursor-not-allowed	"}`}
          onClick={() => navigate(`${PATH_NAME.EDIT_VISIT_HISTORY}/${data.id}`)}
        />
      </button>
      <i
        onClick={() => handleDelete(data?.id || "")}
        className={`pi pi-trash text-red-500 me-2 ${role === ROLE.ADMIN && "cursor-not-allowed"}`}
      />
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
