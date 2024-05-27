import {
  IPatientMedicalDetails,
  allergies,
  medicalConditons,
  patientMedicalDetails,
} from "../../assets/MockData";
import { InputText } from "primereact/inputtext";
import { Chips } from "primereact/chips";
import { RadioButton } from "primereact/radiobutton";
import { Controller, useForm } from "react-hook-form";
import BackButton from "../backButton/BackButton";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { PATH_NAME } from "../../utils/AppConstants";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { user } from "../userProfilePage/UserProfilePage";

const EditMedicalConditions = () => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: patientMedicalDetails,
  });
  const areFamilyConditions = watch("areFamilyConditions");
  const { toast, successToast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = (data: IPatientMedicalDetails) => {
    
    successToast(
      "Updated Successfully",
      "Medical conditions updated successfully"
    );

    setTimeout(() => {
      navigate(PATH_NAME.PROFILE);
    }, 1500);
    console.log(data);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            if (document.activeElement?.tagName !== "BUTTON") {
              event.preventDefault();
            }
          }
        }}
      >
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
              type="submit"
            >
              <i className="pi pi-check me-2"></i>
              {user.hasMedicalConditions ? "Save" : "Add"}
            </PrimeButton>
          </div>
        </div>
        <div className="p-6 bg-white overflow-auto rounded-lg">
          <label className="font-primary text-xl pb-6">
            Medical Conditions
          </label>
          <div className="pt-4">
            <label
              className="input-label mb-1 block"
              htmlFor="medicalConditions"
            >
              Please Select the medical conditions you currently have.
            </label>
            <Controller
              name="medicalConditions"
              control={control}
              defaultValue={patientMedicalDetails.medicalConditions}
              render={({ field }) => (
                <CustomAutoComplete
                  inputId="medicalConditions"
                  handleSelection={(data) =>
                    setValue("medicalConditions", data)
                  }
                  items={medicalConditons}
                  selectedItems={field.value}
                />
              )}
            />
          </div>
          <div className="pt-6 pb-4">
            <label
              className="input-label pb-1 block"
              htmlFor="otherMedicalConditions"
            >
              Other Medical Conditions (if any).
            </label>
            <Controller
              name="otherMedicalConditions"
              control={control}
              defaultValue={patientMedicalDetails.otherMedicalConditions}
              render={({ field }) => (
                <Chips
                  {...field}
                  inputId="otherMedicalConditions"
                  className="min-h-[5rem] border border-gray-300 p-1 block w-full rounded-md"
                  placeholder={
                    !field.value.length
                      ? "Enter your medication name(s), separated by commas"
                      : ""
                  }
                  removeIcon={"pi pi-times"}
                  separator=","
                  value={field.value}
                />
              )}
            />
          </div>
          <label className="font-primary text-xl block py-4">Allergies</label>

          <div className="py-4">
            <label className="input-label block pb-1" htmlFor="allergies">
              Please Select the allergies you currently have.
            </label>
            <Controller
              name="allergies"
              control={control}
              defaultValue={patientMedicalDetails.allergies}
              render={({ field }) => (
                <CustomAutoComplete
                  inputId="allergies"
                  handleSelection={(data) => setValue("allergies", data)}
                  items={allergies}
                  selectedItems={field.value}
                />
              )}
            />
          </div>
          <div className="py-3">
            <label className="input-label block pb-1" htmlFor="otherAllergies">
              Other Allergies (if any).
            </label>
            <Controller
              name="otherAllergies"
              control={control}
              defaultValue={patientMedicalDetails.otherAllergies}
              render={({ field }) => (
                <Chips
                  {...field}
                  inputId="otherAllergies"
                  className="min-h-[5rem] border border-gray-300 p-1 block w-full rounded-md"
                  placeholder={
                    !field.value.length
                      ? "Enter your allergy(s), separated by commas"
                      : ""
                  }
                  removeIcon={"pi pi-times"}
                  separator=","
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="pt-4">
            <label className="ont-primary text-xl block pb-3">
              Family Medical Conditions.
            </label>
            <label className="input-label">
              Would you like to add your family history medical conditions?
            </label>
            <div className="flex items-center font-primary content-center py-2">
              <Controller
                name="areFamilyConditions"
                control={control}
                defaultValue={patientMedicalDetails.areFamilyConditions}
                render={({ field }) => (
                  <>
                    <RadioButton
                      checked={field.value === true}
                      onChange={() => setValue("areFamilyConditions", true)}
                    />
                    <label
                      className={`mx-4 cursor-pointer ${field.value && "active"}`}
                      onClick={() => setValue("areFamilyConditions", true)}
                    >
                      Yes
                    </label>
                    <RadioButton
                      onChange={() => setValue("areFamilyConditions", false)}
                      checked={field.value === false}
                    />
                    <label
                      className={`ms-4 cursor-pointer ${!field.value && "active"}`}
                      onClick={() => setValue("areFamilyConditions", false)}
                    >
                      No
                    </label>
                  </>
                )}
              />
            </div>
            {areFamilyConditions && (
              <>
                <label className="input-label">
                  Family Medications(if any)
                </label>
                <Controller
                  name="familyMedicalConditions"
                  control={control}
                  defaultValue={patientMedicalDetails.familyMedicalConditions}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      placeholder="Enter family medical conditions"
                      className="border min-h-[5rem] w-full border-gray-300 rounded-lg placeholder:font-light"
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
