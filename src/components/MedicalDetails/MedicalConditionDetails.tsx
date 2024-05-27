import { patientMedicalDetails } from "../../assets/MockData";
import { processString } from "../../services/commonFunctions";
import { PatientDetails } from "../userDetails/UserDetails";

const MedicalConditionDetails = () => {
  return (
    <div className="p-6 flex flex-col gap-6 ">
      <PatientDetails
        label="MEDICAL CONDITIONS YOU HAVE"
        value={processString(patientMedicalDetails.medicalConditions)}
      />
      <PatientDetails
        label="OTHER MEDICAL CONDITIONS"
        value={patientMedicalDetails.otherMedicalConditions.join(", ")}
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
