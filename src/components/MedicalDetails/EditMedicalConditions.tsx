import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import { Chips } from "primereact/chips";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ErrorResponse } from "../../interfaces/common";
import { IMedicine } from "../../interfaces/medication";
import {
  ICreateMedicalCondtion,
  IUpdateAllergiesAndConditionsPayload,
} from "../../interfaces/patient";
import {
  createMedicalConditionsThunk,
  getPatientMedicalConditionsThunk,
  selectHasMedicalConditions,
  selectSelectedPatient,
  updateMedicalConditonsThunk,
} from "../../store/slices/PatientSlice";
import {
  getAllergiesByQueryThunk,
  getMedicalConditionsByQueryThunk,
  selectAllergies,
  selectConditions,
} from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import { CODE, PATH_NAME, RESPONSE, SYSTEM } from "../../utils/AppConstants";
import Button from "../Button";
import BackButton from "../backButton/BackButton";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import useToast from "../useToast/UseToast";

interface IConditionFormValue {
  medicalConditions: IMedicine[];
  otherMedicalConditions: IMedicine[];
  allergies: IMedicine[];
  otherAllergies: IMedicine[];
  familyMedicalConditions: IMedicine[];
  areFamilyConditions: boolean;
}

const EditMedicalConditions = () => {

  const hasCondtions = useSelector(selectHasMedicalConditions);
  const filteredAllergies = useSelector(selectAllergies);
  const filteredConditions = useSelector(selectConditions);
  const patient = useSelector(selectSelectedPatient);

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {} as IConditionFormValue,
  });

  useEffect(() => {
    const conditionDetails: IConditionFormValue = {
      allergies:
        patient?.medicalConditionsAndAllergies?.allergies ||
        ([] as IMedicine[]),
      otherAllergies: patient?.medicalConditionsAndAllergies?.otherAllergies,
      familyMedicalConditions:
        patient?.medicalConditionsAndAllergies?.familyMedicalConditions ||
        ([] as IMedicine[]),
      areFamilyConditions:
        !!patient?.medicalConditionsAndAllergies?.familyMedicalConditions
          ?.length || false,
      medicalConditions:
        patient?.medicalConditionsAndAllergies?.medicalConditions ||
        ([] as IMedicine[]),
      otherMedicalConditions:
        patient?.medicalConditionsAndAllergies?.otherMedicalConditions ||
        ([] as IMedicine[]),
    };
    reset({ ...conditionDetails });
  }, [patient.medicalConditionsAndAllergies]);

  useEffect(() => {
    patient?.basicDetails?.id && dispatch(getPatientMedicalConditionsThunk(patient?.basicDetails?.id))
  }, [patient?.basicDetails?.id])

  const areFamilyConditions = watch("areFamilyConditions");
  const { toast, successToast, errorToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleFormSubmit = (data: IConditionFormValue) => {
    const payload: ICreateMedicalCondtion = {
      additional_allergy: data?.otherAllergies,
      additional_condition: data?.otherMedicalConditions,
      current_allergy: data?.allergies,
      current_condition: data?.medicalConditions,
      family_condition: data?.areFamilyConditions,
      family_medications: data?.familyMedicalConditions,
    };
    if (!hasCondtions) {
      dispatch(
        createMedicalConditionsThunk({
          patinetId: patient?.basicDetails?.id,
          payload: payload,
        })
      ).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Updated Successfully",
            "Medical conditions updated successfully"
          );
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Request Failed", errorResponse?.message);
        }
      });
    } else {
      const payload: IUpdateAllergiesAndConditionsPayload = {
        additional_allergy: data?.otherAllergies,
        additional_condition: data?.otherMedicalConditions,
        current_allergy: data?.allergies,
        family_condition: data?.areFamilyConditions,
        current_condition: data?.medicalConditions,
        additional_allergy_id:
          patient?.medicalConditionsAndAllergies?.additional_allergy_id || "",
        additional_condition_id:
          patient?.medicalConditionsAndAllergies?.additional_condition_id || "",
        current_allergy_id:
          patient?.medicalConditionsAndAllergies?.current_allergy_id || "",
        current_condition_id:
          patient?.medicalConditionsAndAllergies?.current_condition_id || "",
        family_condition_id:
          patient?.medicalConditionsAndAllergies?.family_condition_id || "",
        family_medical_condition: data?.familyMedicalConditions,
        patient_id: patient.basicDetails.id || "",
      };

      dispatch(updateMedicalConditonsThunk(payload)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Updated Successfully",
            "Medical Conditions and Allergies have been updated successfully"
          );
        } else if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Unable To Update", errorResponse.message);
        }
      });
    }
    setTimeout(() => {
      navigate(PATH_NAME.PROFILE);
    }, 2000);
  };

  const getStringValues = (chips: IMedicine[] | undefined | null) => {
    if (!chips) {
      return "";
    }
    const chipNames = chips?.map((chip: IMedicine) => {
      return chip.display;
    });
    return chipNames;
  };

  const searchMedicalConditions = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      if (event?.query?.trim()?.length > 1) {
        dispatch(getMedicalConditionsByQueryThunk(event.query));
      }
    }, 300);
  };
  const searchAllergies = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      if (event?.query?.trim()?.length > 1) {
        dispatch(getAllergiesByQueryThunk(event.query));
      }
    }, 300);
  };

  const handleRemoveChip = (
    chip: string,
    fieldName: "otherAllergies" | "otherMedicalConditions",
    values: IMedicine[]
  ) => {
    const newValues = values?.filter((item) => item.display !== chip[0]);
    setValue(fieldName, [...newValues]);
  };

  const handleAddChip = (
    chip: string,
    fieldName: "otherAllergies" | "otherMedicalConditions",
    values: IMedicine[]
  ) => {
    if (chip?.trim()) {
      const matches = values?.some((item) => item?.display === chip?.trim());
      if (!matches) {
        const newValues: IMedicine = {
          code: CODE,
          display: chip,
          system: SYSTEM,
        };
        const objValues = [...(values ?? []), newValues];
        setValue(fieldName, [...objValues]);
      }
    }
  };
  return (
    <>
      <form>
        <div className="flex flex-col md:flex-row justify-between py-2">
          <BackButton
            backLink={PATH_NAME.PROFILE}
            currentPage="Edit Medical Conditions & Allergies"
            previousPage="Medical Conditions & Allergies"
          />
          <div className="flex py-2 justify-between items-center">
            <Link to={PATH_NAME.PROFILE}>
              <Button
                className="ml-3 font-primary text-purple-800"
                variant="primary"
                type="reset"
                style="link"
              >
                <i className="p" />
                <i className="pi pi-times me-2"></i>Cancel
              </Button>
            </Link>
            <PrimeButton
              className="ml-3 font-primary text-purple-800 border px-4 py-2 rounded-full border-purple-700 shadow-none"
              outlined
              onClick={handleSubmit(handleFormSubmit)}
              type="button"
            >
              <i className="pi pi-check me-2" />
              {patient?.medicalConditionsAndAllergies?.medicalConditions?.length
                ? "Save"
                : "Add"}
            </PrimeButton>
          </div>
        </div>
        <div className="p-6 bg-white overflow-auto rounded-lg h-[calc(100vh-200px)]">
          <label htmlFor="medicalConditions" className="font-primary text-xl pb-6">
            Medical Conditions
          </label>
          <div className="pt-4">
            <label
              className="input-label mb-1 block"
              htmlFor="medicalConditions"
            >
              Please select the medical conditions you currently have.
              <Controller
                name="medicalConditions"
                control={control}
                render={({ field }) => (
                  <CustomAutoComplete
                    key="medicalConditions"
                    handleSearch={searchMedicalConditions}
                    inputId="medicalConditions"
                    handleSelection={(data) =>
                      setValue("medicalConditions", data)
                    }
                    items={filteredConditions}
                    selectedItems={field.value}
                  />
                )}
              />
            </label>
          </div>
          <div className="pt-6 pb-4 relative">
            <label
              className="input-label pb-1 block"
              htmlFor="otherMedicalConditions"
            >
              Other Medical Conditions (if any).
            </label>
            <Controller
              name="otherMedicalConditions"
              control={control}
              render={({ field }) => (
                <>
                  <Chips
                    onRemove={(e) =>
                      handleRemoveChip(
                        e.value,
                        "otherMedicalConditions",
                        field.value
                      )
                    }
                    onAdd={(e) =>
                      handleAddChip(
                        e?.value,
                        "otherMedicalConditions",
                        field?.value
                      )
                    }
                    onBlur={(event) => {
                      if (event?.target?.value) {
                        if (
                          !field.value?.some(
                            (item) =>
                              item.display === event?.target?.value?.trim()
                          )
                        ) {
                          const values: IMedicine[] = [
                            ...(field?.value ? field.value : []),
                            {
                              display: event?.target?.value?.trim(),
                              code: CODE,
                              system: SYSTEM,
                            },
                          ];
                          setValue("otherMedicalConditions", values);
                        }
                        event.target.value = "";
                      }
                    }}
                    inputId="otherMedicalConditions"
                    className="min-h-[5rem] border border-gray-300 p-1 block w-full rounded-md"
                    placeholder={
                      !field?.value?.length
                        ? "Enter your Medical Condition(s), seperated by commas"
                        : ""
                    }
                    removeIcon={"pi pi-times"}
                    separator=","
                    value={getStringValues(field.value) || ([] as string[])}
                  />
                  {!!field?.value?.length && (
                    <div className="flex top-[1.2rem] h-full text-sm  font-normal right-5 items-center absolute text-red-500">
                      <button
                        type="button"
                        className="cursor-pointer outline-none"
                        onClick={() => setValue("otherMedicalConditions", [])}
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <p className="font-primary text-xl block py-4">Allergies</p>

          <div className="py-4">
            <label className="input-label block pb-1" htmlFor="allergies">
              Please select the allergies you currently have.
              <Controller
                name="allergies"
                control={control}
                render={({ field }) => (
                  <CustomAutoComplete
                    key="allergies"
                    handleSearch={searchAllergies}
                    inputId="allergies"
                    handleSelection={(data) => setValue("allergies", data)}
                    items={filteredAllergies}
                    selectedItems={field.value}
                  />
                )}
              />
            </label>
          </div>
          <div className="py-3 relative">
            <label className="input-label block pb-1" htmlFor="otherAllergies">
              Other Allergies (if any).
              <Controller
                name="otherAllergies"
                control={control}
                render={({ field }) => (
                  <>
                    <Chips
                      inputId="otherAllergies"
                      className="min-h-[5rem] border border-gray-300 p-1 block w-full rounded-md"
                      placeholder={
                        !field?.value?.length
                          ? "Enter your allergy(ies) names, separated by commas."
                          : ""
                      }
                      removeIcon={"pi pi-times"}
                      separator=","
                      value={getStringValues(field.value) || ([] as string[])}
                      onRemove={(e) =>
                        handleRemoveChip(e.value, "otherAllergies", field.value)
                      }
                      onAdd={(e) =>
                        handleAddChip(e.value, "otherAllergies", field.value)
                      }
                      onBlur={(event) => {
                        if (event?.target?.value) {
                          if (
                            !field.value?.some(
                              (item) =>
                                item.display === event?.target?.value?.trim()
                            )
                          ) {
                            const values: IMedicine[] = [
                              ...(field?.value ? field.value : []),
                              {
                                display: event?.target?.value?.trim(),
                                code: CODE,
                                system: SYSTEM,
                              },
                            ];
                            setValue("otherAllergies", values);
                          }
                          event.target.value = "";
                        }
                      }}
                    />
                    {!!field?.value?.length && (
                      <div className="flex top-[.7rem] h-full right-5 items-center absolute text-red-500">
                        <button type="button"
                          className="cursor-pointer outline-none"
                          onClick={() => setValue("otherAllergies", [])}
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </>
                )}
              />
            </label>
          </div>
          <div className="pt-4">
            <p className="ont-primary text-xl block pb-3">
              Family Medical Conditions.
            </p>
            <p className="input-label">
              Would you like to add your family history medical conditions?
            </p>
            <div className="flex items-center font-primary content-center py-2">
              <Controller
                name="areFamilyConditions"
                control={control}
                render={({ field }) => (
                  <>
                    <RadioButton
                      inputId="yesButton"
                      checked={field.value === true}
                      onChange={() => setValue("areFamilyConditions", true)}
                    />
                    <label
                      htmlFor="yesButton"
                      className={`mx-4 cursor-pointer ${field.value && "active"}`}
                    >
                      Yes
                    </label>
                    <RadioButton
                      inputId="noButton"
                      onChange={() => setValue("areFamilyConditions", false)}
                      checked={field.value === false}
                    />
                    <label
                      htmlFor="noButton"
                      className={`ms-4 cursor-pointer ${!field.value && "active"}`}
                    >No
                    </label>
                  </>
                )}
              />
            </div>
            {areFamilyConditions && (
              <>
                <label htmlFor="familyMedicalConditions" className="input-label">
                  Family Medical Condition(if any)
                </label>
                <Controller
                  name="familyMedicalConditions"
                  control={control}
                  render={({ field }) => (
                    <CustomAutoComplete
                      key="familyMedicalConditions"
                      selectedItems={field.value}
                      handleSearch={searchMedicalConditions}
                      inputId="familyMedicalConditions"
                      handleSelection={(data) =>
                        setValue("familyMedicalConditions", data)
                      }
                      items={filteredConditions}
                    />
                  )}
                />
              </>
            )}
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </>
  );
};
export default EditMedicalConditions;
