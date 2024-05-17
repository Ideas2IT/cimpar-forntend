import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "./Immunization.css";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { IImmunization, immunizations } from "../../assets/MockData";

const TestResult = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedpatient] = useState({} as IImmunization);
  const tableProps = {
    selection: selectedPatient,
    value: immunizations,
    selectionMode: "single" as const,
    dataKey: "id",
    tableStyle: { minWidth: "50rem" },
    className: "mt-2 max-h-[50%] rowHoverable",
    rowClassName: "h-10 border-b",
    scrollHeight: "30rem",
  };

  const columnsConfig = [
    {
      field: "vaccineName",
      header: "VACCINE NAME",
    },
    {
      field: "adminDate",
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
    {
      field: "site",
      header: "SITE",
    },
  ];

  const handleViewRecord = (data: IImmunization) => {
    setSelectedpatient(data);
    setIsSidebarOpen(true);
  };

  const handlePageChange = (event: any) => {
    console.log("page changed", event);
  };

  return (
    <>
      <DataTable {...tableProps}>
        {!!columnsConfig.length &&
          columnsConfig.map((column) => {
            return (
              <Column
                key={column.header}
                field={column.field}
                header={column.header}
                bodyClassName="py-4"
                headerClassName="text-sm font-secondary py-1 border-b bg-white"
                body={(rowData) => (
                  <ColumnData content={rowData[column.field]} />
                )}
              />
            );
          })}
        <Column
          field="view"
          header=""
          bodyClassName="py-5  max-w-[2rem]"
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
        header={"Immunization Details"}
        visible={isSidebarOpen}
        position="right"
        onHide={() => {
          setIsSidebarOpen(false);
          setSelectedpatient({} as IImmunization);
        }}
      >
        <ImmunizationDetailView data={selectedPatient} />
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
      case "ADMINISTRATION DATE":
        return data["adminDate"];
      case "DOSE NUMBER":
        return data["doseNumber"];
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
            VMANUFACTURER NAME
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

  const handleShare = (data: IImmunization) => {
    console.log("share", data);
  };

  return (
    <div className="flex flex-row gap-2 text-purple-800">
      <i className="pi pi-eye" onClick={() => handleView(data)} />
      {/* <i className="pi pi-share-alt" onClick={() => handleShare(data)} /> */}
    </div>
  );
};

const ColumnData = ({ content }: { content: string }) => {
  return (
    <div className="text-[16px] font-tertiary">{content ? content : "-"}</div>
  );
};
export default TestResult;
