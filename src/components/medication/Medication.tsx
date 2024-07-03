import { useEffect, useRef } from "react";
import { PatientDetails } from "../userDetails/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getPatientMedicationThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { IMedicaine } from "../../interfaces/medication";

const Medication = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedPatinet = useSelector(selectSelectedPatient);
  const initialRender = useRef(true);

  const getMedicationNames = (medication: IMedicaine[]) => {
    if (medication && medication?.length > 0) {
      const medicines = medication
        .map((medicine) => {
          return medicine.display;
        })
        .join(", ");
      return medicines;
    } else {
      return "None";
    }
  };

  useEffect(() => {
    if (initialRender?.current) {
      initialRender.current = false;
      return;
    }
    if (selectedPatinet?.basicDetails?.id) {
      dispatch(getPatientMedicationThunk(selectedPatinet.basicDetails.id));
    }
  }, [selectedPatinet?.basicDetails?.id]);

  return (
    <div className="p-6">
      <PatientDetails
        label="CURRENT MEDICATION"
        value={getMedicationNames(
          selectedPatinet?.medicationDetails?.currentTakingMedication
        )}
      />
      <div className="pt-4">
        <PatientDetails
          label="MEDICATION TAKEN BEFORE"
          value={getMedicationNames(
            selectedPatinet?.medicationDetails?.medicationTakenBefore
          )}
        />
      </div>
    </div>
  );
};
export default Medication;
