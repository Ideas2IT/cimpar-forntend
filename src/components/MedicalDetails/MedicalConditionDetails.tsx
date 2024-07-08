import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStringValuesFromObjectArray } from "../../services/commonFunctions";
import {
  getPatientMedicalConditionsThunk,
  selectSelectedPatient,
} from "../../store/slices/PatientSlice";
import { AppDispatch } from "../../store/store";
import { LargeDataField } from "../medication/Medication";
import { RESPONSE } from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";

const MedicalConditionDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const patient = useSelector(selectSelectedPatient);
  const { errorToast, toast } = useToast();
  useEffect(() => {
    patient?.basicDetails?.id &&
      dispatch(
        getPatientMedicalConditionsThunk(patient?.basicDetails?.id)
      ).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.REJECTED) {
          errorToast("Failed to fetch", "Not able to load medical conditions");
        }
      });
  }, [patient?.basicDetails?.id]);

  const medicalConditonFields = [
    {
      label: "MEDICAL CONDITIONS YOU HAVE",
      value:
        getStringValuesFromObjectArray(
          patient?.medicalConditionsAndAllergies?.medicalConditions
        ) || "-",
    },
    {
      label: "OTHER MEDICAL CONDITIONS",
      value:
        getStringValuesFromObjectArray(
          patient?.medicalConditionsAndAllergies?.otherMedicalConditions
        ) || "-",
    },
    {
      label: "ALLERGIES YOU HAVE",
      value:
        getStringValuesFromObjectArray(
          patient?.medicalConditionsAndAllergies?.allergies
        ) || "-",
    },
    {
      label: "OTHER ALLERGIES",
      value:
        getStringValuesFromObjectArray(
          patient?.medicalConditionsAndAllergies?.otherAllergies
        ) || "-",
    },
    {
      label: "FAMILY MEDICAL CONDITIONS",
      value:
        getStringValuesFromObjectArray(
          patient?.medicalConditionsAndAllergies?.familyMedicalConditions
        ) || "-",
    },
  ];
  return (
    <div className="p-6 flex flex-col gap-6 ">
      {medicalConditonFields.map((medicalCondition, index) => {
        return (
          <LargeDataField
            key={index}
            label={medicalCondition.label}
            value={medicalCondition.value}
          />
        );
      })}
      <Toast ref={toast} />
    </div>
  );
};

export default MedicalConditionDetails;
