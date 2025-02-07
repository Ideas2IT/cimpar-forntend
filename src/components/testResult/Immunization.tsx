import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { useSelector } from "react-redux";
import EyeIcon from "../../assets/icons/eye.svg?react";
import { IImmunization } from "../../interfaces/immunization";
import { getRowClasses, getStatusColor } from "../../services/commonFunctions";
import { selectImmunizations } from "../../store/slices/serviceHistorySlice";
import { dateFormatter } from "../../utils/Date";
import "./Immunization.css";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { DATE_FORMAT } from "../../utils/AppConstants";

const Immunization = ({
  handlePageChange,
}: {
  handlePageChange: (value: number) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImmunization, setSelectedImmunization] = useState(
    {} as IImmunization
  );
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

  const immunizationHeader = () => {
    return (
      <div>
        <span className="pe-3">Immunization Details</span>
        <span
          className={`sidebar-header font-tertiary capitalize ${getStatusColor(selectedImmunization.status)}`}
        > {selectedImmunization.status}</span>
      </div>
    );
  };

  return (
    <>
      <div className="h-[calc(100vh-200px)] overflow-auto">
        <DataTable
          selection={selectedImmunization}
          value={immunizations.data}
          emptyMessage={
            <div className="flex justify-center">
              No Immunization available.
            </div>
          }
          selectionMode="single"
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          className="mt-2 rowHoverable"
          rowClassName={() => getRowClasses("h-10 border-b")}
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
                          DATE_FORMAT.DD_MMM_YYYY
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
            header="STATUS"
            bodyClassName="py-4"
            headerClassName="text-sm font-secondary py-1 border-b bg-white"
            body={(rowData) => (
              <span
                className={`sidebar-header font-tertiary ${getStatusColor(rowData.status)}`}
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
      </div>
      {immunizations?.pagination?.total_pages > 1 && (
        <CustomPaginator
          totalPages={immunizations?.pagination?.total_pages || 0}
          currentPage={immunizations?.pagination?.current_page || 0}
          handlePageChange={handlePageChange}
        />
      )}
      <Sidebar
        className="detailed-view w-[28rem]"
        header={immunizationHeader}
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
        {label || ""}
      </div>
      <label className="font-primary">{value || ""}</label>
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
      case "ADMINISTRATION DATE":
        return (
          dateFormatter(data["administrationDate"], DATE_FORMAT.DD_MMM_YYYY) ||
          "-"
        );
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
      <label className="font-primary text-xl">Vaccine details</label>
      <div className="border-b">
        <DetailRow label="VACCINE NAME" value={data.vaccineName} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Boolean(columnKeys.length) &&
          columnKeys?.map((column, index) => {
            return (
              <DetailRow key={index} label={column} value={getValue(column)} />
            );
          })}
      </div>
      <div className="font-primary text-primary pt-4">Manufacturer details</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b mt-1">
          <div className="input-label font-secondary pt-4">
            MANUFACTURER NAME
          </div>
          <label className="font-primary">
            {data?.manufacturerName || "-"}
          </label>
        </div>
        <div className="border-b mt-1">
          <div className="input-label font-secondary pt-4">EXPIRATION DATE</div>
          <label className="font-primary">{data?.expirationDate || "-"}</label>
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
export default Immunization;
