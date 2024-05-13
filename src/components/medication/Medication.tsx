import { IMedication } from "../../interfaces/User";
import { PatientDetails } from "../userDetails/UserDetails";
import { user } from "../userProfilePage/UserProfilePage";

const Medication = () => {

  //TODO: this function can be useful only the the medication will be in object format
  const getMedicationNames = (medication: IMedication[]) => {
    const medicines = medication.map((medicine) => medicine.name).join(", ");
    if (medicines.length > 0) {
      return medicines;
    } else {
      return "None";
    }
  };
  
  return (
    <div className="p-6">
      <PatientDetails
        label="CURRENT MEDICATION"
        value={user.currentMedication.join(", ")}
      />
      <div className="pt-4">
        <PatientDetails
          label="MEDICATION TAKEN BEFORE"
          value={user.medicationTakenBefore.join(", ")}
        />
      </div>
    </div>
  );
};
export default Medication;
