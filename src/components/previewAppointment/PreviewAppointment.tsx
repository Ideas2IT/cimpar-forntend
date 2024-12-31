import { format } from "date-fns";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useSelector } from "react-redux";
import { ILabTestService } from "../../interfaces/common";
import {
  getDobAndAge,
  getPolicyDetails,
  getRowClasses,
  getStringValuesFromObjectArray,
} from "../../services/commonFunctions";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import { DATE_FORMAT, NONE, SERVICE_LOCATION } from "../../utils/AppConstants";
import { IFormData } from "../appointmentForm/AppointmentForm";
import { LargeDataField } from "../medication/Medication";
import { PatientDetails } from "../userDetails/UserDetails";

const PreviewAppointment = ({
  totalCost,
  details,
  handleResponse,
}: {
  totalCost: number;
  details: IFormData;
  handleResponse: (response: boolean) => void;
}) => {
  const profileDetails = useSelector(selectSelectedPatient);
  const getNameAndGender = () => {
    const firstName = profileDetails?.basicDetails?.firstName ?? "";
    const middleName = profileDetails?.basicDetails?.middleName ?? "";
    const lastName = profileDetails?.basicDetails?.lastName ?? "";
    const gender = profileDetails?.basicDetails?.gender
      ? `(${profileDetails.basicDetails.gender})`
      : "";
    return `${firstName} ${middleName} ${lastName} ${gender}`;
  };

  const getPreferedLocation = () => {
    if (details.serviceType === SERVICE_LOCATION.HOME) {
      return "-";
    }
    return `${details?.location?.center_name}, ${details?.location?.city}, ${details?.location?.state}`;
  };
  const fields = [
    {
      header: "TEST TO BE TAKEN AT",
      value:
        details?.serviceType === SERVICE_LOCATION.CENTER
          ? "Service Center"
          : details.serviceType,
    },
    {
      header: "PREFFERED LOCATION",
      value: getPreferedLocation() || "-",
    },
    {
      header: "DATE OF TEST",
      value: format(details.dateOfAppointment, DATE_FORMAT.DD_MMM_YYYY),
    },
    {
      header: "TIME OF TEST",
      value: format(details.scheduledTime, DATE_FORMAT.HH_MM_A),
    },
    {
      header: "REASON FOR TEST",
      value:
        details?.testReason.name === "Other"
          ? details?.otherReasonForTest || "-"
          : details.testReason.name,
      full: true,
    },
    {
      header: "MEDICAL CONDITIONS",
      full: true,
      value: details?.medicalConditions?.length
        ? getStringValuesFromObjectArray(details?.medicalConditions)
        : NONE,
    },
    {
      header: "OTHER MEDICAL CONDITIONS",
      value: details?.otherMedicalConditions?.length
        ? details?.otherMedicalConditions.join(", ")
        : NONE,
      full: true,
    },
    {
      header: "ALLERGIES",
      value: details?.allergies?.length
        ? getStringValuesFromObjectArray(details.allergies)
        : NONE,
      full: true,
    },
    {
      header: "OTHER ALLERGIES",
      value: details?.otherAllergies?.length
        ? details?.otherAllergies.join(", ")
        : NONE,
      full: true,
    },

    {
      header: "NAME (GENDER)",
      value: getNameAndGender(),
      full: false,
    },
    {
      header: "DOB(AGE)",
      value: getDobAndAge(profileDetails?.basicDetails?.dob) || "",
      full: false,
    },
    {
      header: "INSURANCE PROVIDER & NUMBER",
      value: getPolicyDetails(profileDetails?.InsuranceDetails) || "",
      full: true,
    },
  ];
  return (
    <>
      <div className="h-full relative flex flex-col">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 max-h-[90%] overflow-scroll">
          <label className="font-primary text-xl py-5 block h-[10%]">
            Test Details
          </label>
          <div className="col-span-2 rounded-lg mx-1 mb-2">
            <TestDetailsTable
              totalCost={totalCost}
              tests={details.testToTake}
              serviceType={details.serviceType}
            />
          </div>
          {fields.slice(0, 10).map((field) => {
            return (
              <div
                key={field.header}
                className={`${field?.full && "col-span-2"}`}
              >
                <LargeDataField label={field.header} value={field.value} />
              </div>
            );
          })}
          <label className="font-primary text-xl py-5 col-span-2 h-[10%]">
            Basic Details
          </label>
          {fields.slice(10, 13).map((field) => {
            return (
              <div
                key={field.header}
                className={`${field?.full && "col-span-2"}`}
              >
                <PatientDetails label={field.header} value={field.value} />
              </div>
            );
          })}
        </div>
        <div className="pt-2 text-purple-800 flex justify-between font-primary border-t relative bottom-0 right-0 left-0">
          <Button
            onClick={() => handleResponse(false)}
            icon="pi pi-times px-2"
            className="py-2 rounded-full max-h-[2.5rem] border border-purple-800 h-full w-[48%] justify-center"
          >
            No, I want to edit
          </Button>
          <Button
            onClick={() => {
              handleResponse(true);
            }}
            icon="pi pi-check px-2"
            className="py-2 rounded-full max-h-[2.5rem] border border-purple-800 bg-purple-100 w-[48%] justify-center"
          >
            Yes, Confirm & Pay ${totalCost || 0}
          </Button>
        </div>
      </div>
    </>
  );
};

const TestDetailsTable = ({
  totalCost,
  tests,
  serviceType,
}: {
  totalCost: number;
  tests: ILabTestService[];
  serviceType: string;
}) => {
  const columns = [
    {
      field: "display",
      header: "Test Name",
      bodyClass: "max-w-[10rem] break-all font-tertiary",
    },
    {
      field: "is_telehealth_required",
      header: "Telehealth Visit",
      headerClass: "justify-items-center",
      bodyClass: "text-center max-w-[3rem] font-tertiary",
      body: (rowData: any) => (
        <div className="text-center">
          {rowData.is_telehealth_required ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Test Price",
      headerClass: "justify-items-end pe-2",
      body: (rowData: ILabTestService) => (
        <div className="text-end pe-1">
          {serviceType === SERVICE_LOCATION.HOME
            ? "$" + rowData?.home_price
            : "$" + rowData?.center_price}
        </div>
      ),
    },
  ];

  const tableFooter = () => {
    return (
      <div className="flex w-full justify-between font-primary">
        <label>Total Price</label>
        <label className="w-[40%] text-right pe-1 text-ellipsis overflow-hidden">
          ${totalCost}
        </label>
      </div>
    );
  };
  return (
    <div className="rounded-lg py-1 border w-full">
      <DataTable
        scrollable
        scrollHeight="10rem"
        value={tests}
        rowClassName={() => getRowClasses("border-b")}
        footer={tableFooter}
      >
        {columns.map((column, index) => (
          <Column
            key={index}
            header={column.header}
            field={column.field}
            headerClassName={`${column.headerClass} border-b uppercase font-secondary text-sm`}
            bodyClassName={column.bodyClass}
            body={column.body}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default PreviewAppointment;
