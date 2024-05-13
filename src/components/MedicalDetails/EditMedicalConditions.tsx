import { useState } from "react";
import {
  IPatientMedicalDetails,
  allergies,
  medicalConditons,
  patientMedicalDetails,
} from "../../assets/MockData";
import { CustomAutoComplete, IItem } from "../appointmentForm/AppointmentForm";
import { InputText } from "primereact/inputtext";
import { Chips } from "primereact/chips";
import { RadioButton } from "primereact/radiobutton";
import { Controller, useForm } from "react-hook-form";
import BackButton from "../backButton/BackButton";
import { Link } from "react-router-dom";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { PATH_NAME } from "../../utils/AppConstants";

const EditMedicalConditions = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: patientMedicalDetails,
  });
  const areFamilyConditions = watch("areFamilyConditions");

  const handleFormSubmit = (data: IPatientMedicalDetails) => {
    console.log(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <div className="flex flex-row justify-between py-2">
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
              <i className="pi pi-check me-2"></i>Save
            </PrimeButton>
          </div>
        </div>
        <div className="p-6 bg-white overflow-auto rounded-lg">
          <label className="font-primary text-xl pb-6">Medical Conditons</label>
          <div className="pt-4">
            <label className="input-label pb-1">
              Please Select the medical conditions you currently have
            </label>
            <Controller
              name="medicalConditions"
              control={control}
              defaultValue={patientMedicalDetails.medicalConditions}
              render={({ field }) => (
                <CustomAutoComplete
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
            <label className="input-label">
              Other Medical Conditions (if any)
            </label>
            <Controller
              name="otherMedicalConditions"
              control={control}
              defaultValue={patientMedicalDetails.otherMedicalConditions}
              render={({ field }) => (
                <Chips
                  {...field}
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
            <label className="input-label pb-1">
              Please Select the allergies you currently have
            </label>
            <Controller
              name="allergies"
              control={control}
              defaultValue={patientMedicalDetails.allergies}
              render={({ field }) => (
                <CustomAutoComplete
                  handleSelection={(data) => setValue("allergies", data)}
                  items={allergies}
                  selectedItems={field.value}
                />
              )}
            />
          </div>
          <div className="py-3">
            <label className="input-label">Other Allergies (if any)</label>
            <Controller
              name="otherAllergies"
              control={control}
              defaultValue={patientMedicalDetails.otherAllergies}
              render={({ field }) => (
                <Chips
                  {...field}
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
              Family Medical Conditions
            </label>
            <label className="input-label">
              Would you like to add your family history medical conditions?
            </label>
            <div className="flex flex-row py-2">
              <Controller
                name="areFamilyConditions"
                control={control}
                defaultValue={patientMedicalDetails.areFamilyConditions}
                render={({ field }) => (
                  <>
                    <label className="flex items-center pe-6">
                      <RadioButton
                        className="me-2"
                        checked={field.value === true}
                        onChange={() => setValue("areFamilyConditions", true)}
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <RadioButton
                        onChange={() => setValue("areFamilyConditions", false)}
                        className="me-2"
                        checked={field.value === false}
                      />
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
    </>
  );
};
export default EditMedicalConditions;
