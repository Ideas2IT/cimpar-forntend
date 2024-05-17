import { Link } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { user } from "../userProfilePage/UserProfilePage";
import { IUser } from "../../interfaces/User";
import { RadioButton } from "primereact/radiobutton";
import "./Medication.css";
import { Chips } from "primereact/chips";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { PATH_NAME } from "../../utils/AppConstants";

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

  const handleFormSubmit = (data: IUser) => {
    console.log(data);
  };

  const isMedicalHistory = watch("medicationalHistory");
  return (
    <>
      <div className="px-6 h-[100%]">
        <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
          <div className="flex flex-row justify-between pb-6">
            <BackButton
              previousPage="Medication"
              currentPage="Edit Medication"
              backLink={PATH_NAME.PROFILE}
            />
            <div>
              <div className="flex py-2 justify-between items-center">
                <Link to="/">
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
                  <i className="pi pi-check me-2"></i>Save
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
            <div className="mt-4">
              <label className="">Have you been on medication before?*</label>
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
            <label className="pb-2">Medication Names</label>
            {isMedicalHistory === "yes" && (
              <div className="pt-4 lg:w-[50%] min-h-[10rem] border border-gray-300 rounded-lg">
                <Controller
                  name="currentMedication"
                  control={control}
                  defaultValue={user.currentMedication}
                  render={({ field }) => (
                    <Chips
                      className="chips"
                      {...field}
                      removeIcon={"pi pi-times"}
                      placeholder={
                        !field.value.length
                          ? "Enter your medication name(s), separated by commas"
                          : ""
                      }
                      separator=","
                    />
                  )}
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
export default EditMedicationDetails;
