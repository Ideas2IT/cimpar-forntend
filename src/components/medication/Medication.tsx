import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMedicine } from "../../interfaces/medication";
import {
  getPatientMedicationThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { AppDispatch } from "../../store/store";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { RESPONSE } from "../../utils/AppConstants";

const Medication = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedPatinet = useSelector(selectSelectedPatient);
  const { toast, errorToast } = useToast();

  const getMedicationNames = (medication: IMedicine[]) => {
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
    if (selectedPatinet?.basicDetails?.id) {
      dispatch(getPatientMedicationThunk(selectedPatinet.basicDetails.id)).then(
        ({ meta }) => {
          if (meta.requestStatus === RESPONSE.REJECTED) {
            errorToast("Unable To Fetch", "Unable to fetch Medication Details");
          }
        }
      );
    }
  }, [selectedPatinet?.basicDetails?.id]);

  return (
    <div
      className="p-6 overflow-auto"
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >
      <LargeDataField
        label="CURRENT MEDICATION"
        value={getMedicationNames(
          selectedPatinet?.medicationDetails?.currentTakingMedication
        )}
      />
      <div className="pt-4">
        <LargeDataField
          label="MEDICATION TAKEN BEFORE"
          value={getMedicationNames(
            selectedPatinet?.medicationDetails?.medicationTakenBefore
          )}
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
};
export const LargeDataField = ({
  label,
  value,
}: {
  value: string;
  label: string;
}) => {
  return (
    <div className="border-b border-gray-100">
      <div className="font-secondary text-sm text-[#283956] opacity-65 py-2">
        {label ? label : "-"}
      </div>
      <div
        title={value}
        className="font-primary pb-2 text-[#283956] capitalize"
      >
        {!value ? "" : value}
      </div>
    </div>
  );
};
export default Medication;
