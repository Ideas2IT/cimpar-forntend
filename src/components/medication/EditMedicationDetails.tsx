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
import { useState } from "react";

const EditMedicationDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  const handleFormSubmit = (data: IUser) => {
    console.log(data);
  };

  const RadioButtonPassThroughOptions = {
    input: { className: "bg-red-300" },
  };

  const [values, setValues] = useState<string[]>([]);
  return (
    <>
      <div className="px-6 ">
        <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
          <div className="flex flex-row justify-between pb-6">
            <BackButton
              previousPage="Medication"
              currentPage="Edit Medication"
              backLink="/profile"
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
          <div className="bg-white !h-[35rem] p-6">
            <div>
              <label className="">
                Are you currently taking any medication?*
              </label>
              <Controller
                name="isOnMedicine"
                control={control}
                defaultValue={user.isOnMedicine} // Default value
                render={({ field }) => (
                  <div className="font-primary text-xl flex flex-row items-center py-4">
                    <label
                      className={`${field.value && "active"} pe-4 flex items-center text-[16px]`}
                      onChange={() => setValue("isOnMedicine", true)}
                    >
                      <RadioButton
                        className="me-2"
                        value="Primary"
                        inputRef={field.ref}
                        checked={field.value}
                      />
                      Yes
                    </label>
                    <label
                      className={`${!field.value && "active"} pe-4 flex items-center text-[16px]`}
                      onChange={() => setValue("isOnMedicine", false)}
                    >
                      <RadioButton
                        className="me-2 h-full w-full"
                        inputRef={field.ref}
                        {...field}
                        value="Secondary"
                        checked={!field.value}
                      />
                      No
                    </label>
                  </div>
                )}
              />
            </div>
            <div className="mt-4">
              <label className="">Have you been on medication before?*</label>
              <Controller
                name="medicationalHistory"
                control={control}
                defaultValue={user.medicationalHistory} // Default value
                render={({ field }) => (
                  <div className="font-primary text-xl flex flex-row items-center py-4">
                    <label
                      className={`${field.value && "active"} pe-4 flex items-center text-[16px]`}
                      onChange={() => setValue("medicationalHistory", true)}
                    >
                      <RadioButton
                        className="me-2"
                        value="Primary"
                        inputRef={field.ref}
                        checked={field.value}
                      />
                      Yes
                    </label>
                    <label
                      className={`${!field.value && "active"} pe-4 flex items-center text-[16px]`}
                      onChange={() => setValue("medicationalHistory", false)}
                    >
                      <RadioButton
                        className="me-2 h-full w-full"
                        {...field}
                        value="Secondary"
                        checked={!field.value}
                      />
                      No
                    </label>
                  </div>
                )}
              />
            </div>
            <label className="pb-2">Medication Names</label>
            <div className="pt-4 w-[50%] min-h-[10rem] border border-gray-300 rounded-lg">
              <Controller
                name="currentMedication"
                control={control}
                defaultValue={user.currentMedication} // Default value
                render={({ field }) => (
                  <Chips
                    // {...field}
                    removeIcon={"pi pi-times"}
                    placeholder={
                      !values.length
                        ? "Enter your medication name(s), separated by commas"
                        : ""
                    }
                    value={values}
                    onChange={(e) =>
                      e.value ? setValues(e.value) : setValues([])
                    }
                    separator=","
                  />
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default EditMedicationDetails;
