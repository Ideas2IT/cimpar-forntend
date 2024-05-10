import { patientMedicalDetails } from "../../assets/MockData";
import { IItem } from "../appointmentForm/AppointmentForm";
import { PatientDetails } from "../userDetails/UserDetails";

const MedicalConditionDetails = () => {
  const processString = (data: IItem[]) => {
    const medicalIssues = data.map((medicine) => medicine.name).join(", ");
    if (medicalIssues.length > 0) {
      return medicalIssues;
    } else {
      return "None";
    }
  };
  return (
    <div className="p-6 flex flex-col gap-6 ">
      <PatientDetails
        label="MEDICAL CONDITIONS YOU HAVE"
        value={processString(patientMedicalDetails.medicalConditions)}
      />
      <PatientDetails
        label="OTHER MEDICAL CONDITIONS"
        value={(patientMedicalDetails.otherMedicalConditions).join(", ")}
      />
      <PatientDetails
        label="ALLERGIES YOU HAVE"
        value={processString(patientMedicalDetails.allergies)}
      />
      <PatientDetails
        label="FAMILY MEDICAL CONDITIONS"
        value={patientMedicalDetails.familyMedicalConditions}
      />
    </div>
  );
};

export default MedicalConditionDetails;
