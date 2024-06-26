import { Link, useNavigate } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { IUser } from "../../interfaces/User";
import { RadioButton } from "primereact/radiobutton";
import "./Medication.css";
// import { Chips } from "primereact/chips";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { PATH_NAME } from "../../utils/AppConstants";
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
  selectSelectedPatient,
  updateMedicalConditonsThunk,
  updateMedicationByPatientIdThunk,
} from "../../store/slices/PatientSlice";
import {
  IMedicationFormValues,
  IUpdateMedicationPayload,
} from "../../interfaces/medication";
import { useEffect, useState } from "react";

const EditMedicationDetails = () => {
  const selectedPatinet = useSelector(selectSelectedPatient);
  const [formValues, setFormValurs] = useState<IMedicationFormValues>();
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
        selectedPatinet.medicationDetails.currentTakingMedication,
      hasMedicalHistory:
        !!selectedPatinet.medicationDetails.medicationTakenBefore.length,
      isOnMedicine: !!selectedPatinet.medicationDetails.currentTakingMedication,
      medicationTakenBefore:
        selectedPatinet.medicationDetails.medicationTakenBefore,
    };
    reset({ ...medicationDetails });
  }, [selectedPatinet.medicationDetails]);

  const dispatch = useDispatch<AppDispatch>();
  const filteredMedications = useSelector(selectMedications);

  const { successToast, toast } = useToast();
  const navigate = useNavigate();
  const handleFormSubmit = (data: IMedicationFormValues) => {
    const payload: IUpdateMedicationPayload = {
      patient_id: selectedPatinet?.basicDetails?.id,
      request: data.currentMedication,
      request_approved: data.isOnMedicine,
      statement_approved: data.hasMedicalHistory,
      request_id: data.currentMedication[0].id,
      statement_id: data.medicationTakenBefore[0].id,
    };
    // dispatch(updateMedicationByPatientIdThunk({} as IUpdateMedicationPayload));
    successToast(
      "Update Successful",
      "Medication Details has been updated successfully"
    );
  };

  const searchMedications = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      if (event.query.trim().length > 1) {
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
                  {selectedPatinet.medicationDetails.medicationTakenBefore
                    .length
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
                rules={{ required: "Field is required" }}
                // defaultValue={user.isOnMedicine}
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
                        // selectedItems={field.value}
                        selectedItems={[] as string[]}
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
                rules={{ required: "Field is required" }}
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
                    // defaultValue={user.medicationTakenBefore}
                    render={({ field }) => (
                      // <Chips
                      //   {...field}
                      //   tooltipOptions={{ position: "bottom" }}
                      //   className="chips"
                      //   tooltip="Enter your medication name(s), separated by commas"
                      //   removeIcon={"pi pi-times"}
                      //   placeholder={
                      //     !field.value.length
                      //       ? "Enter your medication name(s), separated by commas"
                      //       : ""
                      //   }
                      //   separator=","
                      // />
                      <CustomAutoComplete
                        {...field}
                        handleSearch={searchMedications}
                        // selectedItems={field.value}
                        selectedItems={[] as string[]}
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
