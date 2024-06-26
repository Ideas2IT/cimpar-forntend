import { Button } from "primereact/button";
import { ITest } from "../../assets/MockData";
import { IFormData, IItem } from "../appointmentForm/AppointmentForm";
import { PatientDetails } from "../userDetails/UserDetails";
import { format } from "date-fns";

const PreviewAppointment = ({
  details,
  handleResponse,
}: {
  details: IFormData;
  handleResponse: (response: boolean) => void;
}) => {
  console.log(details);
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
      value: details?.medicalConditions?.length
        ? getStringFromObjects(details?.medicalConditions)
        : "",
      full: true,
    },
    {
      header: "OTHER MEDICAL CONDITIONS",
      value: details?.otherMedicalConditon,
      full: true,
    },
    {
      header: "ALLERGIES",
      value: details?.allergies,
      full: true,
    },
    {
      header: "NAME(GENDER)",
      value: "David WARNER (MALE)",
      full: false,
    },
    {
      header: "DOB(AGE)",
      value: "12 june, 1922(82)",
      full: false,
    },
    {
      header: "INSURANCE PROVIDER & NUMBER",
      value: "Medcicare 123123********24",
      full: true,
    },
  ];

  return (
    <div className="h-full relative flex flex-col">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 max-h-[85%] overflow-scroll">
        <label className="font-primary text-lg py-5 block h-[10%]">
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
        <label className="font-primary text-lg py-5 col-span-2 h-[10%]">
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
      <div className="h-[15%] text-purple-800 lg:py-3 flex justify-between font-primary border-t absolute bottom-0 right-0 left-0">
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
