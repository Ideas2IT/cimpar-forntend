import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Button as PrimeButton } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ErrorResponse } from "../../interfaces/common";
import { ICreateMedication, IMedicationFormValues, IMedicine, IUpdateMedicationPayload } from "../../interfaces/medication";
import { getMedicationByQueryThunk, selectMedications, } from "../../store/slices/masterTableSlice";
import { addMedicationDetailsThunk, getPatientMedicationThunk, selectSelectedPatient, updateMedicationByPatientIdThunk } from "../../store/slices/PatientSlice";
import { AppDispatch } from "../../store/store";
import { PATH_NAME, RESPONSE } from "../../utils/AppConstants";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import "./Medication.css";
const EditMedicationDetails = () => {

  const selectedPatient = useSelector(selectSelectedPatient);
  const dispatch = useDispatch<AppDispatch>();
  const filteredMedications = useSelector(selectMedications);

  const { successToast, errorToast, toast } = useToast();

  const navigate = useNavigate();



  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {} as IMedicationFormValues,
  });

  const hasMedicalHistory = watch("hasMedicalHistory");
  const isOnMedication = watch("isOnMedicine");

  useEffect(() => {
    if (Object.keys(selectedPatient)?.length) {
      const medicationDetails: IMedicationFormValues = {
        currentMedication:
          selectedPatient?.medicationDetails?.currentTakingMedication,
        hasMedicalHistory:
          !!selectedPatient?.medicationDetails?.medicationTakenBefore,
        isOnMedicine:
          !!selectedPatient?.medicationDetails?.currentTakingMedication,
        medicationTakenBefore:
          selectedPatient?.medicationDetails?.medicationTakenBefore,
      };
      reset({ ...medicationDetails });
    }
  }, [selectedPatient.medicationDetails]);

  useEffect(() => {
    selectedPatient?.basicDetails?.id && dispatch(getPatientMedicationThunk(selectedPatient?.basicDetails?.id));
  }, [selectedPatient?.basicDetails?.id]);


  const handleFormSubmit = (data: IMedicationFormValues) => {
    const payload: IUpdateMedicationPayload = {
      patient_id: selectedPatient?.basicDetails?.id || "",
      request: data?.medicationTakenBefore || [],
      statement: data?.currentMedication || [],
      request_approved:
        data?.medicationTakenBefore?.length == 0
          ? false
          : data.hasMedicalHistory,
      statement_approved:
        data?.currentMedication?.length == 0 ? false : data?.isOnMedicine,
      request_id: selectedPatient?.medicationDetails?.requestId || "",
      statement_id: selectedPatient?.medicationDetails?.statementId || "",
    };
    if (payload?.statement_id || payload?.request_id) {
      dispatch(updateMedicationByPatientIdThunk(payload)).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Updated Successfully!",
            "Medication details has been updated successfully"
          );
        } else {
          errorToast("Unable To Update", "Unable to update Medication Details");
        }
      });
    } else {
      const payload: ICreateMedication = {
        request: data?.medicationTakenBefore,
        statement: data?.currentMedication,
        request_approved: data?.hasMedicalHistory,
        statement_approved: data?.isOnMedicine,
        patient_id: selectedPatient?.basicDetails?.id || "",
      };
      payload.patient_id &&
        dispatch(addMedicationDetailsThunk(payload)).then((response) => {
          if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
            successToast(
              "Created Successfully",
              "Medication has been created successfully"
            );
          } else {
            const errorResponse = response?.payload as ErrorResponse;
            errorToast("Medication Creation Failed", errorResponse.message);
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

  const validateCurrentMedication = (
    IMedicationFormValues: IMedicine[] | undefined | null
  ) => {
    if (isOnMedication && !IMedicationFormValues?.length) {
      return "Medication name is required";
    }
  };

  const validateBeforeMedication = (
    IMedicationFormValues: IMedicine[] | undefined | null
  ) => {
    if (hasMedicalHistory && !IMedicationFormValues?.length) {
      return "Medication name is required";
    }
  };
  return (

    <div className="px-6 h-[100%]">
      <form>
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
                  <i className="pi pi-times me-2" />Cancel
                </Button>
              </Link>
              <PrimeButton
                onClick={handleSubmit(handleFormSubmit)}
                className="ml-3 font-primary text-purple-800 border px-4 py-2 rounded-full border-purple-700 shadow-none"
                outlined
                type="button"
              >
                <i className="pi pi-check me-2" />
                {selectedPatient?.medicationDetails?.medicationTakenBefore
                  ?.length
                  ? "Save"
                  : "Add"}
              </PrimeButton>
            </div>
          </div>
        </div>
        <div className="bg-white !h-[calc(100vh-200px)] p-6 rounded-xl overflow-auto">
          <div>
            <p>
              Are you currently taking any medication?*
            </p>
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
                    inputId="yesButton"
                    inputRef={field.ref}
                    onChange={() => setValue("isOnMedicine", true)}
                    checked={field.value}
                  />
                  <label
                    htmlFor="yesButton"
                    className={`${field.value && "active"} pe-4 text-[16px] cursor-pointer`}
                  >
                    Yes
                  </label>
                  <RadioButton
                    {...field}
                    className="me-2"
                    inputRef={field.ref}
                    inputId="noButton"
                    value="Secondary"
                    onChange={() => setValue("isOnMedicine", false)}
                    checked={field.value === false}
                  />
                  <label
                    htmlFor="noButton"
                    className={`${field.value === false && "active"} pe-4 text-[16px] cursor-pointer`}
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

            <label
              className="mb-1 pt-4 block input-label"
              htmlFor="currentMedication"
            >
              Medication Names*
              <div className="rounded-lg">
                <Controller
                  name="currentMedication"
                  control={control}
                  rules={{
                    validate: validateCurrentMedication,
                  }}
                  render={({ field }) => (
                    <CustomAutoComplete
                      {...field}
                      key="medication"
                      handleSearch={searchMedications}
                      selectedItems={field.value}
                      handleSelection={(medicines) => {
                        setValue("currentMedication", medicines);
                        trigger("currentMedication");
                      }}
                      items={filteredMedications}
                      inputId="currentMedication"
                    />
                  )}
                />
                {errors.currentMedication && (
                  <ErrorMessage
                    message={errors.currentMedication.message}
                  />
                )}
              </div>
            </label>

          )}
          <div className="mt-4">
            <p className="pb-3 block">
              Have you been on medication before?*
            </p>
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
                    inputId="yesButtonBefore"
                    checked={field.value}
                    onChange={() => setValue("hasMedicalHistory", true)}
                  />
                  <label
                    htmlFor="yesButtonBefore"
                    className={`${field.value && "active"} me-4 text-[16px] cursor-pointer ms-3`}
                  >
                    Yes
                  </label>
                  <RadioButton
                    inputId="noButtonBefore"
                    onChange={() => setValue("hasMedicalHistory", false)}
                    checked={!field.value}
                  />
                  <label
                    htmlFor="noButtonBefore"
                    className={`${!field.value && "active"} me-4 text-[16px] cursor-pointer ms-3`}
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
            <label
              className="pt-4 mb-1 block input-label"
              htmlFor="beforeMedication"
            >
              Medication Names*
              <div className="rounded-lg">
                <Controller
                  name="medicationTakenBefore"
                  control={control}
                  rules={{
                    validate: validateBeforeMedication,
                  }}
                  render={({ field }) => (
                    <CustomAutoComplete
                      key="medicationtakenBefore"
                      {...field}
                      handleSearch={searchMedications}
                      selectedItems={field.value}
                      handleSelection={(medicines) => {
                        setValue("medicationTakenBefore", medicines);
                        trigger("medicationTakenBefore");
                      }}
                      items={filteredMedications}
                      inputId="beforeMedication"
                    />
                  )}
                />
                {errors.medicationTakenBefore && (
                  <ErrorMessage
                    message={errors.medicationTakenBefore.message}
                  />
                )}
              </div>
            </label>

          )}
        </div>
      </form>
      <Toast ref={toast} onHide={() => navigate(PATH_NAME.PROFILE)} />
    </div>
  );
};
export default EditMedicationDetails;
