import { Link, useNavigate } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { user } from "../userProfilePage/UserProfilePage";
import { IUser } from "../../interfaces/User";
import { RadioButton } from "primereact/radiobutton";
import "./Medication.css";
// import { Chips } from "primereact/chips";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { PATH_NAME } from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { CustomAutoComplete } from "../customAutocomplete/CustomAutocomplete";
import { IItem } from "../appointmentForm/AppointmentForm";
import { allergies } from "../../assets/MockData";
import { useState } from "react";

const EditMedicationDetails = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  const { successToast, toast } = useToast();
  const navigate = useNavigate();
  const handleFormSubmit = (data: IUser) => {
    successToast(
      "Update Successful",
      "Medication Details has been updated successfully"
    );
    setTimeout(() => {
      navigate(PATH_NAME.PROFILE);
    }, 1500);
    console.log(data);
  };

  const isMedicalHistory = watch("medicationalHistory");
  const isOnMedication = watch("isOnMedicine");
  const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
  return (
    <>
      <div className="px-6 h-[100%]">
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
                    <i className="pi pi-times me-2"></i>Cancel
                  </Button>
                </Link>
                <PrimeButton
                  onClick={() => handleSubmit}
                  className="ml-3 font-primary text-purple-800 border px-4 py-2 rounded-full border-purple-700 shadow-none"
                  outlined
                  type="submit"
                >
                  <i className="pi pi-check me-2"></i>
                  {user.medicationalHistory ? "Save" : "Add"}
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
                defaultValue={user.isOnMedicine}
                render={({ field }) => (
                  <div className="font-primary text-xl flex items-center py-4">
                    <RadioButton
                      className="me-2"
                      value="Primary"
                      inputRef={field.ref}
                      onChange={() => setValue("isOnMedicine", "yes")}
                      checked={field.value === "yes"}
                    />
                    <label
                      className={`${field.value === "yes" && "active"} pe-4 text-[16px] cursor-pointer`}
                      onClick={() => {
                        console.log("clicked");
                        setValue("isOnMedicine", "yes");
                      }}
                    >
                      Yes
                    </label>
                    <RadioButton
                      className="me-2"
                      inputRef={field.ref}
                      {...field}
                      value="Secondary"
                      onChange={() => setValue("isOnMedicine", "no")}
                      checked={field.value === "no"}
                    />
                    <label
                      className={`${field.value === "no" && "active"} pe-4 text-[16px] cursor-pointer`}
                      onClick={() => setValue("isOnMedicine", "no")}
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
            {isOnMedication === "yes" && (
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
                    defaultValue={user.currentMedication}
                    render={({ field }) => (
                      <CustomAutoComplete
                        {...field}
                        selectedItems={field.value}
                        handleSelection={(medicines) => {
                          setValue("currentMedication", medicines);
                        }}
                        placeholder="Select Medicine"
                        items={allergies}
                        inputId="currentMedication"
                      />
                      // <Chips
                      //   tooltip="Enter your medication name(s), separated by commas"
                      //   tooltipOptions={{ position: "bottom" }}
                      //   className="chips"
                      //   {...field}
                      //   removeIcon={"pi pi-times"}
                      //   placeholder={
                      //     !field.value.length
                      //       ? "Enter your medication name(s), separated by commas"
                      //       : ""
                      //   }
                      //   separator=","
                      // />
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
                name="medicationalHistory"
                control={control}
                rules={{ required: "Field is required" }}
                defaultValue={user.medicationalHistory}
                render={({ field }) => (
                  <div className="flex font-primary text-xl items-center">
                    <RadioButton
                      checked={field.value === "yes"}
                      onChange={() => setValue("medicationalHistory", "yes")}
                    />
                    <label
                      className={`${field.value === "yes" && "active"} me-4 text-[16px] cursor-pointer ms-3`}
                      onClick={() => setValue("medicationalHistory", "yes")}
                    >
                      Yes
                    </label>
                    <RadioButton
                      onChange={() => setValue("medicationalHistory", "no")}
                      checked={field.value === "no"}
                    />
                    <label
                      className={`${field.value === "no" && "active"} me-4 text-[16px] cursor-pointer ms-3`}
                      onClick={() => setValue("medicationalHistory", "no")}
                    >
                      No
                    </label>
                  </div>
                )}
              />
              {errors.medicationalHistory && (
                <ErrorMessage message={errors.medicationalHistory.message} />
              )}
            </div>
            {isMedicalHistory === "yes" && (
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
                    defaultValue={user.medicationTakenBefore}
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
                        selectedItems={field.value}
                        handleSelection={(medicines) => {
                          setValue("medicationTakenBefore", medicines);
                        }}
                        placeholder="Select Medicine"
                        items={allergies}
                        inputId="beforeMedication"
                      />
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </form>
        <Toast ref={toast} />
      </div>
    </>
  );
};
export default EditMedicationDetails;
