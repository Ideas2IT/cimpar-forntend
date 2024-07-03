import { Link, useNavigate } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { RadioButton } from "primereact/radiobutton";
import "./Medication.css";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { PATH_NAME, RESPONSE } from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import { handleKeyPress } from "../../services/commonFunctions";
import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import {
  getMedicationByQueryThunk,
  selectMedications,
} from "../../store/slices/masterTableSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  addMedicationDetailsThunk,
  getPatientMedicationThunk,
  selectSelectedPatient,
  updateMedicationByPatientIdThunk,
} from "../../store/slices/PatientSlice";
import {
  ICreateMedication,
  IMedicationFormValues,
  IUpdateMedicationPayload,
} from "../../interfaces/medication";
import { useEffect, useRef } from "react";
const EditMedicationDetails = () => {
  const selectedPatinet = useSelector(selectSelectedPatient);
  const initialRef = useRef(true);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {} as IMedicationFormValues,
  });
  useEffect(() => {
    const medicationDetails: IMedicationFormValues = {
      currentMedication:
        selectedPatinet?.medicationDetails?.currentTakingMedication,
      hasMedicalHistory:
        !!selectedPatinet?.medicationDetails?.medicationTakenBefore,
      isOnMedicine:
        !!selectedPatinet?.medicationDetails?.currentTakingMedication,
      medicationTakenBefore:
        selectedPatinet?.medicationDetails?.medicationTakenBefore,
    };
    reset({ ...medicationDetails });
  }, [selectedPatinet.medicationDetails]);

  useEffect(() => {
    if (initialRef?.current) {
      initialRef.current = false;
      return;
    }
    dispatch(getPatientMedicationThunk(selectedPatinet?.basicDetails?.id));
  }, [selectedPatinet?.basicDetails?.id]);

  const dispatch = useDispatch<AppDispatch>();
  const filteredMedications = useSelector(selectMedications);

  const { successToast, errorToast, toast } = useToast();
  const navigate = useNavigate();
  const handleFormSubmit = (data: IMedicationFormValues) => {
    const payload: IUpdateMedicationPayload = {
      patient_id: selectedPatinet?.basicDetails?.id || "",
      request: data?.currentMedication || "",
      statement: data?.medicationTakenBefore || "",
      request_approved: data?.hasMedicalHistory,
      statement_approved: data?.isOnMedicine,
      request_id: selectedPatinet?.medicationDetails?.requestId || "",
      statement_id: selectedPatinet?.medicationDetails?.statementId || "",
    };
    if (payload.statement_id || payload.request_id) {
      dispatch(updateMedicationByPatientIdThunk(payload)).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Updated Successfully!",
            "Medication details has been updated successfully"
          );
        } else {
          errorToast("Updation Failed", "Failed to update medication details");
        }
      });
    } else {
      const payload: ICreateMedication = {
        request: data.medicationTakenBefore,
        statement: data.currentMedication,
        request_approved: data.isOnMedicine,
        statement_approved: data.hasMedicalHistory,
        patient_id: selectedPatinet?.basicDetails?.id || "",
      };
      payload.patient_id &&
        dispatch(addMedicationDetailsThunk(payload)).then(({ meta }) => {
          if (meta.requestId === RESPONSE.FULFILLED) {
            successToast(
              "Created Successfully",
              "Medication has been created successfully"
            );
          } else {
            errorToast(
              "Failed to Create Medication",
              "Failed to create medication for the patient. Please try again. "
            );
          }
        });
    }
  };

  const validateBoolean = (value: boolean, message: string) => {
    return value === true || value === false || message;
  };

  const searchMedications = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      if (event.query.trim()?.length > 2) {
        dispatch(getMedicationByQueryThunk(event.query));
      }
    }, 300);
  };

  const hasMedicalHistory = watch("hasMedicalHistory");
  const isOnMedication = watch("isOnMedicine");
  return (
    <>
      <div className="px-6 h-[100%]">
        <form
          onSubmit={handleSubmit((data) => handleFormSubmit(data))}
          onKeyDown={(event) => handleKeyPress(event)}
        >
          <div className="flex flex-row justify-between pb-6">
            <BackButton
              previousPage="Medication"
              currentPage="Edit Medication"
              backLink={PATH_NAME.PROFILE}
            />
            <div>
              <div className="flex py-2 justify-between items-center">
                <Link to={PATH_NAME.PROFILE}>
                  <Button
                    className="ml-3 font-primary text-purple-800"
                    variant="primary"
                    type="reset"
                    style="link"
                  >
                    <i className="p" />
                    <i className="pi pi-times me-2" />
                    Cancel
                  </Button>
                </Link>
                <PrimeButton
                  onClick={() => handleSubmit}
                  className="ml-3 font-primary text-purple-800 border px-4 py-2 rounded-full border-purple-700 shadow-none"
                  outlined
                  type="submit"
                >
                  <i className="pi pi-check me-2" />
                  {selectedPatinet?.medicationDetails?.medicationTakenBefore
                    ?.length
                    ? "Save"
                    : "Add"}
                </PrimeButton>
              </div>
            </div>
          </div>
          <div className="bg-white !h-[35rem] p-6 rounded-xl">
            <div>
              <label className="">
                Are you currently taking any medication?*
              </label>
              <Controller
                name="isOnMedicine"
                control={control}
                rules={{
                  validate: (value) =>
                    validateBoolean(value, `On Medication field is required`),
                }}
                render={({ field }) => (
                  <div className="font-primary text-xl flex items-center py-4">
                    <RadioButton
                      className="me-2"
                      value="Primary"
                      inputRef={field.ref}
                      onChange={() => setValue("isOnMedicine", true)}
                      checked={field.value}
                    />
                    <label
                      className={`${field.value && "active"} pe-4 text-[16px] cursor-pointer`}
                      onClick={() => {
                        setValue("isOnMedicine", true);
                      }}
                    >
                      Yes
                    </label>
                    <RadioButton
                      className="me-2"
                      inputRef={field.ref}
                      {...field}
                      value="Secondary"
                      onChange={() => setValue("isOnMedicine", false)}
                      checked={field.value === false}
                    />
                    <label
                      className={`${field.value === false && "active"} pe-4 text-[16px] cursor-pointer`}
                      onClick={() => setValue("isOnMedicine", false)}
                    >
                      No
                    </label>
                  </div>
                )}
              />
              {errors.isOnMedicine && (
                <ErrorMessage message={errors.isOnMedicine.message} />
              )}
            </div>
            {isOnMedication && (
              <>
                <label
                  className="mb-1 pt-4 block input-label"
                  htmlFor="currentMedication"
                >
                  Medication Names
                </label>
                <div className="rounded-lg">
                  <Controller
                    name="currentMedication"
                    control={control}
                    render={({ field }) => (
                      <CustomAutoComplete
                        {...field}
                        handleSearch={searchMedications}
                        selectedItems={field.value}
                        handleSelection={(medicines) => {
                          setValue("currentMedication", medicines);
                        }}
                        placeholder="Select Medicine"
                        items={filteredMedications}
                        inputId="currentMedication"
                      />
                    )}
                  />
                </div>
              </>
            )}
            <div className="mt-4">
              <label className="pb-3 block">
                Have you been on medication before?*
              </label>
              <Controller
                name="hasMedicalHistory"
                control={control}
                rules={{
                  validate: (value) =>
                    validateBoolean(value, `On Medication field is required`),
                }}
                render={({ field }) => (
                  <div className="flex font-primary text-xl items-center">
                    <RadioButton
                      checked={field.value}
                      onChange={() => setValue("hasMedicalHistory", true)}
                    />
                    <label
                      className={`${field.value && "active"} me-4 text-[16px] cursor-pointer ms-3`}
                      onClick={() => setValue("hasMedicalHistory", true)}
                    >
                      Yes
                    </label>
                    <RadioButton
                      onChange={() => setValue("hasMedicalHistory", false)}
                      checked={!field.value}
                    />
                    <label
                      className={`${!field.value && "active"} me-4 text-[16px] cursor-pointer ms-3`}
                      onClick={() => setValue("hasMedicalHistory", false)}
                    >
                      No
                    </label>
                  </div>
                )}
              />
              {errors.hasMedicalHistory && (
                <ErrorMessage message={errors.hasMedicalHistory.message} />
              )}
            </div>
            {hasMedicalHistory && (
              <>
                <label
                  className="pt-4 mb-1 block input-label"
                  htmlFor="beforeMedication"
                >
                  Medication Names
                </label>
                <div className="rounded-lg">
                  <Controller
                    name="medicationTakenBefore"
                    control={control}
                    render={({ field }) => (
                      <CustomAutoComplete
                        {...field}
                        handleSearch={searchMedications}
                        selectedItems={field.value}
                        handleSelection={(medicines) => {
                          setValue("medicationTakenBefore", medicines);
                        }}
                        placeholder="Select Medicine"
                        items={filteredMedications}
                        inputId="beforeMedication"
                      />
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </form>
        <Toast ref={toast} onHide={() => navigate(PATH_NAME.PROFILE)} />
      </div>
    </>
  );
};
export default EditMedicationDetails;
