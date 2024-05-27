import { IItem } from "../appointmentForm/AppointmentForm";
import { PatientDetails } from "../userDetails/UserDetails";
import { user } from "../userProfilePage/UserProfilePage";

const Medication = () => {
  const getMedicationNames = (medication: IItem[]) => {
    if (medication.length > 0) {
      const medicines = medication.map((medicine) => medicine.name).join(", ");
      return medicines;
    } else {
      return "None";
    }
  };

  return (
    <div className="p-6">
      <PatientDetails
        label="CURRENT MEDICATION"
        value={getMedicationNames(user.currentMedication)}
      />
      <div className="pt-4">
        <PatientDetails
          label="MEDICATION TAKEN BEFORE"
          value={getMedicationNames(user.medicationTakenBefore)}
        />
      </div>
    </div>
  );
};
export default Medication;
