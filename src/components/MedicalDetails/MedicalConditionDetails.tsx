import { useDispatch, useSelector } from "react-redux";
import { patientMedicalDetails } from "../../assets/MockData";
import { PatientDetails } from "../userDetails/UserDetails";
import { AppDispatch } from "../../store/store";
import {
  getPatientMedicalConditionsThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { useEffect, useRef } from "react";

const MedicalConditionDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender?.current) {
      initialRender.current = false;
      return;
    }
    patientId && dispatch(getPatientMedicalConditionsThunk(patientId));
  }, [patientId]);

  const medicalConditonFields = [
    {
      label: "MEDICAL CONDITIONS YOU HAVE",
      value: patientMedicalDetails.medicalConditions.join(", "),
    },
    {
      label: "OTHER MEDICAL CONDITIONS",
      value: patientMedicalDetails.otherMedicalConditions.join(", "),
    },
    {
      label: "ALLERGIES YOU HAVE",
      value: patientMedicalDetails.allergies.join(", "),
    },
    {
      label: "FAMILY MEDICAL CONDITIONS",
      value: patientMedicalDetails.familyMedicalConditions,
    },
  ];
  return (
    <div className="p-6 flex flex-col gap-6 ">
      {medicalConditonFields.map((medicalCondition, index) => {
        return (
          <PatientDetails
            key={index}
            label={medicalCondition.label}
            value={medicalCondition.value}
          />
        );
      })}
    </div>
  );
};

export default MedicalConditionDetails;
