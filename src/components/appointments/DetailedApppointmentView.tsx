import { IAppointment } from "../../assets/MockData";
import { getFullPhoneNUmber } from "../../services/commonFunctions";
import { PatientDetails } from "../userDetails/UserDetails";
import { format } from "date-fns";

const DetailedAppointmentView = ({ details }: { details: IAppointment }) => {
  const personalFields = [
    { label: "NAME", value: details.patientName },
    { label: "GENDER", value: details.gender },
    {
      label: "DOB (AGE)",
      value:
        format(details.dateOfBirth, "dd MMM, yyyy") + " (" + details.age + ")",
    },
    {
      label: "CONTACT NUMBER",
      value: getFullPhoneNUmber(details.countryCode, details.phoneNumber),
    },
    {
      label: "INSURANCE PROVIDER & NUMBER",
      value: details.insuranceProvider + " - " + details.insuranceNumber,
      full: true,
    },
  ];

  const appointmentFields = [
    {
      label: "APPOINTMENT FOR",
      value: details.appointmentFor.join(", "),
      full: true,
    },
    {
      label: "DATE OF APPOINTMENT FOR TEST",
      value: details.dateOfAppointment,
    },
    {
      label: "SCHEDULED TIME",
      value: details.dateAndTime,
    },
    {
      label: "REASON FOR TEST",
      value: details.testReason,
      full: true,
    },
  ];

  return (
    <div className="pt-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {personalFields.map((field) => {
          return (
            <div className={`${field.full && "col-span-2"}`}>
              <PatientDetails label={field.label} value={field.value} />
            </div>
          );
        })}
      </div>
      <label className="font-primary text-xl pt-6 pb-3 block">
        Appointement
      </label>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {appointmentFields.map((field) => {
          return (
            <div className={`${field.full && "col-span-2"}`}>
              <PatientDetails label={field.label} value={field.value} />
            </div>
          );
        })}
      </div>
      <label className="font-primary text-xl pt-6 block">Remarks</label>
      <PatientDetails
        label="MEDICAL CONDITIONS"
        value={details.medicalConditions.join(", ")}
      />
    </div>
  );
};
export default DetailedAppointmentView;
