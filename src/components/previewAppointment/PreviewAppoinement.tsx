import { Button } from "primereact/button";
import { ITest } from "../../assets/MockData";
import { IFormData, IItem } from "../appointmentForm/AppointmentForm";
import { PatientDetails } from "../userDetails/UserDetails";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import { getDobAndAge, getPolicyDetails } from "../../services/commonFunctions";

const PreviewAppointment = ({
  details,
  handleResponse,
}: {
  details: IFormData;
  handleResponse: (response: boolean) => void;
}) => {
  const profileDetails = useSelector(selectSelectedPatient);
  const getStringFromObjects = (values: ITest[] | IItem[]) => {
    const testString = values
      .map((value: ITest) => {
        return value.name;
      })
      .join(", ");
    return testString;
  };

  const fields = [
    {
      header: "TEST NAME",
      value: getStringFromObjects(details.testToTake),
      full: true,
    },
    {
      header: "DATE OF TEST",
      value: format(details.dateOfAppointment, "dd MMM, yyyy"),
    },
    {
      header: "TIME OF TEST",
      value: format(details.scheduledTime, "hh:mm a"),
    },
    {
      header: "REASON FOR TEST",
      value: details?.testReason.name || "-",
      full: true,
    },
    {
      header: "MEDICAL CONDITIONS",
      full: true,
      value: "",
    },
    {
      header: "OTHER MEDICAL CONDITIONS",
      value: details?.otherMedicalConditions?.length
        ? details?.otherMedicalConditions.join(", ")
        : "",
      full: true,
    },
    {
      header: "ALLERGIES",
      value: details?.allergies?.length ? details?.allergies.join(", ") : "",
      full: true,
    },
    {
      header: "NAME(GENDER)",
      value:
        profileDetails?.basicDetails.firstName +
          " " +
          profileDetails?.basicDetails?.middleName +
          "(" +
          profileDetails?.basicDetails?.gender +
          ")" || "",
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
    <div className="h-full relative flex flex-col">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 max-h-[90%] overflow-scroll">
        <label className="font-primary text-xl py-5 block h-[10%]">
          Test Details
        </label>
        {fields.slice(0, 7).map((field) => {
          return (
            <div
              key={field.header}
              className={`${field?.full && "col-span-2"}`}
            >
              <PatientDetails label={field.header} value={field.value} />
            </div>
          );
        })}
        <label className="font-primary text-xl py-5 col-span-2 h-[10%]">
          Basic Details
        </label>
        {fields.slice(7, 10).map((field) => {
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
      <div className="h-[10%] text-purple-800 flex justify-between font-primary border-t absolute bottom-0 right-0 left-0">
        <Button
          onClick={() => handleResponse(false)}
          icon="pi pi-times px-2"
          className="py-1 rounded-full max-h-[2.5rem] border border-purple-800 h-full w-[48%] justify-center"
        >
          No, I want to edit
        </Button>
        <Button
          onClick={() => handleResponse(true)}
          icon="pi pi-check px-2"
          className="py-1 rounded-full max-h-[2.5rem]  border border-purple-800 bg-purple-100 w-[48%] justify-center"
        >
          Yes, Confirm my Appointment
        </Button>
      </div>
    </div>
  );
};
export default PreviewAppointment;
