import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { IInsurance } from "../../interfaces/User";
import { IDeleteInsurancePayload } from "../../interfaces/insurance";
import { getRowClasses } from "../../services/commonFunctions";
import {
  deleteInsuranceByIdThunk,
  getPatientInsuranceThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { selectIsAdmin } from "../../store/slices/loginSlice";
import { AppDispatch } from "../../store/store";
import { PATH_NAME, RESPONSE } from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { ErrorResponse } from "../../interfaces/common";

const InsuranceDetails = () => {

  const dispatch = useDispatch<AppDispatch>();
  const selectedPatient = useSelector(selectSelectedPatient);

  const { toast, errorToast } = useToast();

  const [selectedPolicy] = useState({} as IInsurance);

  useEffect(() => {
    selectedPatient?.basicDetails?.id &&
      dispatch(getPatientInsuranceThunk(selectedPatient.basicDetails.id)).then(
        (response) => {
          if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
            errorToast(
              "Failed to Load",
              "Failed to fetch insurance details. Please try again later."
            );
          }
        }
      );
  }, [selectedPatient?.basicDetails?.id]);

  const renderPolicyColumn = (columnData: string) => {
    return <PolicyColumn value={columnData} />
  }

  const renderActionColumn = (rowData: IInsurance) => {
    return <PolicyHandler
      data={rowData}
      patinetId={selectedPatient?.basicDetails?.id}
    />
  }


  const columns = [
    {
      field: "insuranceName",
      header: "INSURANCE COMPANY",
      body: (rowData: IInsurance) => renderPolicyColumn(rowData.insuranceCompany)

    },
    {
      field: "policyNumber",
      header: "POLICY NUMBER",
      body: (rowData: IInsurance) => renderPolicyColumn(rowData.policyNumber),
    },
    {
      field: "groupNumber",
      header: "GROUP NUMBER",
      body: (rowData: IInsurance) => renderPolicyColumn(rowData.groupNumber),
    },
    {
      field: "insuranceType",
      header: "TYPE",
      body: (rowData: IInsurance) => renderPolicyColumn(rowData.insuranceType?.toUpperCase()),
    },
    {
      field: "",
      header: "ACTION",
      body: (rowData: IInsurance) => renderActionColumn(rowData),
    },
  ];



  return (
    <>
      <DataTable
        selection={selectedPolicy}
        value={selectedPatient.InsuranceDetails}
        selectionMode="single"
        dataKey="id"
        emptyMessage={
          <div className="flex justify-center">
            It looks like you don't have any insurance records at the moment.
          </div>
        }
        tableStyle={{ minWidth: "50rem" }}
        className="mt-2 max-h-[50%] rowHoverable"
        rowClassName={() => getRowClasses("h-10 border-b")}
        scrollHeight="30rem"
      >
        {columns.map((column, index) => {
          return (
            <Column
              key={column.header + index}
              field={column.field}
              bodyClassName="py-4"
              header={column.header}
              headerClassName="text-sm font-secondary py-1 border-b bg-white"
              body={column.body}
            />
          );
        })}
      </DataTable>
      <Toast ref={toast} />
      <ConfirmDialog />
    </>
  );
};

const PolicyColumn = ({ value }: { value: string }) => {
  return <div className="font-tertiary">{value || "-"}</div>;
};

const PolicyHandler = ({
  data,
  patinetId,
}: {
  data: IInsurance;
  patinetId: string;
}) => {
  const isAdmin = useSelector(selectIsAdmin);
  const { toast, successToast, errorToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteInsurance = () => {
    if (patinetId && data) {
      const payload: IDeleteInsurancePayload = {
        patinetId: patinetId,
        insuranceId: data.id,
      };
      dispatch(deleteInsuranceByIdThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Insurance deleted",
            "Insurance has been deleted successfully"
          );
          dispatch(getPatientInsuranceThunk(patinetId));
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to Delete", errorResponse.message);
        }
      });
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      header: "Confirmation",
      className: "max-w-[50vw]",
      message: "Are you sure want to delete this insurance?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName:
        "py-2 px-5 bg-purple-100 text-purple rounded-lg border-purple-900 mx-2",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      rejectLabel: "Cancel",
      accept() {
        handleDeleteInsurance();
      },
    });
  };

  return (
    <div className="flex flex-row max-w-[4rem] items-center justify-between">
      <NavLink to={`${PATH_NAME.EDIT_INSURANCE}/${data.id}`}>
        <button disabled={isAdmin} className={`${isAdmin && "hidden"}`}>
          <i className="pi pi-pen-to-square text-purple-800" />
        </button>
      </NavLink>
      <button
        onClick={confirmDelete}
        disabled={isAdmin}
        className={`${isAdmin && "cursor-not-allowed outline-none hidden"}`}
      >
        <i className="pi pi-trash  mx-2 text-red-500" />
      </button>
      <Toast ref={toast} />
    </div>
  );
};
export default InsuranceDetails;
