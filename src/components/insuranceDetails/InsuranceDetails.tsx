import { DataTable } from "primereact/datatable";
import { user } from "../userProfilePage/UserProfilePage";
import { Column } from "primereact/column";
import { IInsurance } from "../../interfaces/User";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";

const InsuranceDetails = () => {
  const [selectedPolicy, setSelectedPolicy] = useState({} as IInsurance);
  const tableProps = {
    selection: selectedPolicy,
    value: user.insurance,
    selectionMode: "single" as const,
    dataKey: "id",
    tableStyle: { minWidth: "50rem" },
    className: "mt-2 max-h-[50%] rowHoverable",
    rowClassName: "h-10 border-b",
    scrollHeight: "30rem",
  };

  const columns = [
    {
      field: "insuranceName",
      header: "INSURANCE COMPANY",
      body: (rowData: IInsurance) => (
        <PolicyColumn value={rowData.insuranceCompany} />
      ),
    },
    {
      field: "InsuranceNumber",
      header: "INSURANCE NUMBER",
      body: (rowData: IInsurance) => (
        <PolicyColumn value={rowData.insuranceNumber} />
      ),
    },
    {
      field: "policyNumber",
      header: "POLICY NUMBER",
      body: (rowData: IInsurance) => (
        <PolicyColumn value={rowData.policyNumber} />
      ),
    },
    {
      field: "groupNumber",
      header: "GROUP NUMBER",
      body: (rowData: IInsurance) => (
        <PolicyColumn value={rowData.groupNumber} />
      ),
    },
    {
      field: "insuranceType",
      header: "TYPE",
      body: (rowData: IInsurance) => (
        <PolicyColumn value={rowData.insuranceType} />
      ),
    },
    {
      field: "",
      header: "",
      body: (rowData: IInsurance) => <PolicyHandler data={rowData} />,
    },
  ];
  return (
    <DataTable {...tableProps}>
      {columns.map((column, index) => {
        return (
          <Column
            key={index}
            field={column.field}
            bodyClassName="py-4"
            header={column.header}
            headerClassName="text-sm font-secondary py-6 border-b bg-white"
            body={column.body}
          />
        );
      })}
    </DataTable>
  );
};

const PolicyColumn = ({ value }: { value: String }) => {
  return <div className="font-tertiary">{value ? value : "-"}</div>;
};

const PolicyHandler = ({ data }: { data: IInsurance }) => {
  const { toast, successToast, errorToast } = useToast();
  return (
    <div className="flex flex-row items-center justify-between">
      <NavLink to={`/edit-insurance/${data.id}`}>
        <i className="pi pi-pen-to-square text-purple-800" />
      </NavLink>
      <i
        className="pi pi-trash  mx-2 text-red-500"
        onClick={() => {
          successToast(
            "Deleted Successfully",
            "Your insurance has been deleted successfully"
          );
        }}
      />
      <Toast ref={toast} />
    </div>
  );
};
export default InsuranceDetails;
