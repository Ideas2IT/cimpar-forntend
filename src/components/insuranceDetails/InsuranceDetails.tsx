import { DataTable } from "primereact/datatable";
import { user } from "../userProfilePage/UserProfilePage";
import { Column } from "primereact/column";
import { IInsurance } from "../../interfaces/User";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { selectedRole } from "../../store/slices/commonSlice";
import { ROLE } from "../../utils/AppConstants";
import { getRowClasses } from "../../services/commonFunctions";

const InsuranceDetails = () => {
  const [selectedPolicy] = useState({} as IInsurance);

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
    <DataTable
      selection={selectedPolicy}
      value={user.insurance}
      selectionMode="single"
      dataKey="id"
      tableStyle={{ minWidth: "50rem" }}
      className="mt-2 max-h-[50%] rowHoverable"
      rowClassName={() => getRowClasses("h-10 border-b")}
      scrollHeight="30rem"
    >
      {columns.map((column, index) => {
        return (
          <Column
            key={index}
            field={column.field}
            bodyClassName="py-4"
            header={column.header}
            headerClassName="text-sm font-secondary py-1 border-b bg-white"
            body={column.body}
          />
        );
      })}
    </DataTable>
  );
};

const PolicyColumn = ({ value }: { value: string }) => {
  return <div className="font-tertiary">{value ? value : "-"}</div>;
};

const PolicyHandler = ({ data }: { data: IInsurance }) => {
  const role = useSelector(selectedRole);
  const { toast, successToast } = useToast();
  return (
    <div className="flex flex-row max-w-[4rem] items-center justify-between">
      <NavLink to={`/edit-insurance/${data.id}`}>
        <button
          disabled={role === ROLE.ADMIN}
          className={`${role === ROLE.ADMIN && "cursor-not-allowed"}`}
        >
          <i className="pi pi-pen-to-square text-purple-800" />
        </button>
      </NavLink>
      <button
        disabled={role === ROLE.ADMIN}
        className={`${role === ROLE.ADMIN && "cursor-not-allowed"}`}
      >
        <i
          className="pi pi-trash  mx-2 text-red-500"
          onClick={() => {
            successToast(
              "Deleted Successfully",
              "Your insurance has been deleted successfully"
            );
          }}
        />
      </button>
      <Toast ref={toast} />
    </div>
  );
};
export default InsuranceDetails;
