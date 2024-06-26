import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "./Immunization.css";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useRef, useState } from "react";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { getRowClasses } from "../../services/commonFunctions";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import EyeIcon from "../../assets/icons/eye.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import { AppDispatch } from "../../store/store";
import {
  getImmunizationsByPatientIdThunk,
  selectImmunizations,
} from "../../store/slices/serviceHistorySlice";
import { IImmunization } from "../../interfaces/immunization";
import { dateFormatter } from "../../utils/Date";

const TestResult = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImmunization, setSelectedImmunization] = useState(
    {} as IImmunization
  );
  const selectedPatient = useSelector(selectSelectedPatient);
  const dispatch = useDispatch<AppDispatch>();
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender?.current) {
      initialRender.current = false;
      return;
    }
    if (selectedPatient?.basicDetails?.id)
      dispatch(
        getImmunizationsByPatientIdThunk(selectedPatient.basicDetails.id)
      );
  }, [selectedPatient]);
  const immunizations = useSelector(selectImmunizations);

  const columnsConfig = [
    {
      field: "vaccineName",
      header: "VACCINE NAME",
    },
    {
      field: "administrationDate",
      header: "ADMINISTRATION DATE",
    },
    {
      field: "doseNumber",
      header: "DOSE NUMBER",
    },
    {
      field: "administrator",
      header: "ADMINISTRATOR",
    },
  ];

  const handleViewRecord = (data: IImmunization) => {
    setSelectedImmunization(data);
    setIsSidebarOpen(true);
  };

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    console.log("page changed", event);
  };

  const ImmunizationHeader = () => {
    return (
      <div>
        <label className="pe-3">"Immunization Details"</label>
        <span
          className={`sidebar-header ${getStatusColor(selectedImmunization.status)}`}
        >
          {selectedImmunization.status}
        </span>
      </div>
    );
  };

  const getStatusColor = (value: string) => {
    if (value) {
      switch (value.toLowerCase()) {
        case "vaccinated":
          return "bg-[#FCEBDB]";
        case "icare":
          return "bg-[#D3EADD]";
        default:
          return "bg-white";
      }
    } else return "bg-white";
  };

  return (
    <>
      <DataTable
        selection={selectedImmunization}
        value={immunizations}
        emptyMessage={
          <div className="flex justify-center font-secondary">
            No data to display
          </div>
        }
        selectionMode="single"
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        className="mt-2 max-h-[50%] rowHoverable"
        rowClassName={() => getRowClasses("h-10 border-b")}
        scrollHeight="30rem"
      >
        {!!columnsConfig.length &&
          columnsConfig.map((column) => {
            return (
              <Column
                key={column.header}
                field={column.field}
                header={column.header}
                bodyClassName="py-4"
                headerClassName="text-sm font-secondary py-1 border-b bg-white"
                body={(rowData) =>
                  column.header === "ADMINISTRATION DATE" ? (
                    <ColumnData
                      content={dateFormatter(
                        rowData[column.field],
                        "dd MMM, yyyy"
                      )}
                    />
                  ) : (
                    <ColumnData content={rowData[column.field]} />
                  )
                }
              />
            );
          })}
        <Column
          field="status"
          header="Status"
          bodyClassName="py-4"
          headerClassName="text-sm font-secondary py-1 border-b bg-white"
          body={(rowData) => (
            <span
              className={`sidebar-header ${getStatusColor(rowData.status)}`}
            >
              {rowData.status || "-"}
            </span>
          )}
        />
        <Column
          field="view"
          header=""
          bodyClassName="py-5  max-w-[3rem]"
          headerClassName="text-sm font-secondary py-1 border-b bg-white"
          body={(rowData) => (
            <ViewColumn
              data={rowData}
              handleViewRecord={() => handleViewRecord(rowData)}
            />
          )}
        />
      </DataTable>
      {
        //TODO: show the pagenator only if total records are more than page limit
        immunizations.length > 20 && (
          <CustomPaginator
            handlePageChange={handlePageChange}
            totalRecords={immunizations.length}
            rowLimit={20}
          />
        )
      }
      <Sidebar
        className="detailed-view w-[28rem]"
        header={<ImmunizationHeader />}
        visible={isSidebarOpen}
        position="right"
        onHide={() => {
          setIsSidebarOpen(false);
          setSelectedImmunization({} as IImmunization);
        }}
      >
        <ImmunizationDetailView data={selectedImmunization} />
      </Sidebar>
    </>
  );
};

export const ImmunizationDetailView = ({ data }: { data: IImmunization }) => {
  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="border-b">
      <div className="input-label text-gray-900 font-secondary pt-4">
        {label}
      </div>
      <label className="font-primary">{value}</label>
    </div>
  );

  const columnKeys = [
    "ADMINISTRATION DATE",
    "ADMINISTRATOR",
    "DOSE NUMBER",
    "DOSAGE FORM",
    "ADMINISTERED CODE",
    "LOT NUMBER",
    "ROUTE",
    "SITE",
  ];

  const getValue = (title: string) => {
    switch (title) {
      case "ADMINISTRATOR":
        return data["administrator"];
      case "ADMINISTRATION DATE" || "-":
        return dateFormatter(data["administrationDate"], "dd MMM,yyyy") || "-";
      case "DOSE NUMBER":
        return data["doseNumber"] || "-";
      case "DOSAGE FORM":
        return data["dosageForm"];
      case "ADMINISTERED CODE":
        return data["administeredCode"];
      case "LOT NUMBER":
        return data["lotNumber"];
      case "ROUTE":
        return data["route"];
      case "SITE":
        return data["site"];
      default:
        return "";
    }
  };

  return (
    <div className="pt-6">
      <label className="font-primary text-sm">Vaccine details</label>
      <div className="border-b">
        <DetailRow label="VACCINE NAME" value={data.vaccineName} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Boolean(columnKeys.length) &&
          columnKeys.map((column) => {
            return <DetailRow label={column} value={getValue(column)} />;
          })}
      </div>
      <div className="font-primary text-primary pt-4">Manufacturer details</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b">
          <div className="input-label font-secondary pt-4">
            MANUFACTURER NAME
          </div>
          <label className="font-primary">{data.vaccineName}</label>
        </div>
        <div className="border-b mt-1">
          <div className="input-label font-secondary pt-4 pb-1">
            EXPIRATION DATE
          </div>
          <label className="font-primary">{data.vaccineName}</label>
        </div>
      </div>
    </div>
  );
};

const ViewColumn = ({
  data,
  handleViewRecord,
}: {
  data: IImmunization;
  handleViewRecord: (value: IImmunization) => void;
}) => {
  const handleView = (data: IImmunization) => {
    handleViewRecord(data);
  };

  return (
    <div
      className="flex flex-row gap-2 text-purple-800"
      onClick={() => handleView(data)}
    >
      <EyeIcon className="stroke-purple-800" />
    </div>
  );
};

const ColumnData = ({ content }: { content: string }) => {
  return (
    <div className="text-[16px] font-tertiary">{content ? content : "-"}</div>
  );
};
export default TestResult;
