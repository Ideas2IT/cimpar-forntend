import { Link, useLocation, useNavigate } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Controller, useForm } from "react-hook-form";
import { user } from "../userProfilePage/UserProfilePage";
import { IInsurance } from "../../interfaces/User";
import { useEffect, useState } from "react";
import { insuranceCompanies } from "../../assets/MockData";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { PATH_NAME } from "../../utils/AppConstants";
import { FileUpload } from "primereact/fileupload";
import { FileTile } from "../visitHistory/EditVisitHistory";
import ReportImage from "../reportImage/ReportImage";

const EditInsurance = () => {
  const location = useLocation();
  const [selectedInsurance, setSelectedInsurance] = useState({} as IInsurance);
  const { successToast, toast } = useToast();
  const [showImage, setShowImage] = useState(false);
  const [selectedReport, setSelectedReport] = useState({} as File);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: selectedInsurance,
  });

  const insuranceId = watch("insuranceId");
  // const insuranceCard = watch("insuranceCard");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.insurance?.length) {
      const insurance = user.insurance.find(
        (ins) => ins.id == Number(location.pathname.split("/")[2])
      );
      if (insurance !== undefined) {
        setSelectedInsurance(insurance);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    reset({ ...selectedInsurance });
  }, [selectedInsurance]);

  const handleFormSubmit = (data: IInsurance) => {
    successToast(
      "Insurance updated",
      "Insurance details has been updated successfully"
    );
    setTimeout(() => {
      navigate(PATH_NAME.PROFILE);
    }, 1500);
    console.log(data);
  };

  return (
    <div className="px-6">
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
            previousPage="Insurance"
            currentPage={
              Object.keys(selectedInsurance).length
                ? "Edit Insurance"
                : "Add Insurance"
            }
            backLink={PATH_NAME.PROFILE}
          />

          <div className="flex py-2 justify-between items-center">
            <Link to={PATH_NAME.PROFILE}>
              <Button
                className="ml-3 font-primary text-purple-800"
                variant="primary"
                type="button"
                style="link"
              >
                <i className="pi pi-times me-2"></i>Cancel
              </Button>
            </Link>
            <PrimeButton
              className="ml-3 font-primary text-purple-800 border px-4 py-2 rounded-full border-purple-700 shadow-none"
              outlined
              onClick={() => handleSubmit}
            >
              <i className="pi pi-check me-2"></i>Save
            </PrimeButton>
          </div>
        </div>
        <div className="min-h-[70vh] bg-white rounded-lg p-6">
          <label
            className="font-ternary text-sm"
            htmlFor="insuranceTypeSelector"
          >
            Select Your Insurance Type based on your priority
          </label>
          <div className="py-4">
            <Controller
              name="insuranceType"
              control={control}
              defaultValue={selectedInsurance.insuranceType}
              rules={{
                required: "Insurance Type can't be empty",
              }}
              render={({ field }) => (
                <div className="font-primary text-xl flex flex-row items-center">
                  <label
                    className={`${field.value === "Primary" ? "active" : "in-active"} pe-4 flex items-center`}
                    onClick={() => setValue("insuranceType", "Primary")}
                  >
                    <RadioButton
                      {...field}
                      inputId="insuranceTypeSelector"
                      className="me-2"
                      value="Primary"
                      inputRef={field.ref}
                      checked={control._formValues.insuranceType === "Primary"}
                    />
                    Primary
                  </label>
                  <label
                    className={`${field.value === "Secondary" ? "active" : "in-active"} pe-4 flex items-center`}
                    onClick={() => setValue("insuranceType", "Secondary")}
                  >
                    <RadioButton
                      className="me-2 h-full w-full"
                      inputRef={field.ref}
                      {...field}
                      value="Secondary"
                      checked={field.value === "Secondary"}
                    />
                    Secondary
                  </label>
                  <label
                    className={`${control._formValues.insuranceType === "Tertiary" ? "active" : "in-active"} pe-4 flex items-center`}
                    onClick={() => setValue("insuranceType", "Tertiary")}
                  >
                    <RadioButton
                      className="me-2"
                      inputRef={field.ref}
                      {...field}
                      value="Tertiary"
                      checked={field.value === "Tertiary"}
                    />
                    Tertiary
                  </label>
                </div>
              )}
            />
            {errors.insuranceType && (
              <span className="text-red-500 text-xs">
                {errors.insuranceType.message}
              </span>
            )}
          </div>
          <div className="pt-4 lg:w-[50%] sm:w-[100%]">
            <label
              className="block input-label pb-1"
              onClick={() => document.getElementById("company")?.click()}
            >
              Insurance Company*
            </label>
            <Controller
              name="insuranceCompany"
              control={control}
              defaultValue={selectedInsurance.insuranceCompany}
              rules={{
                required: "Race can't be empty",
              }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  id="company"
                  options={insuranceCompanies}
                  optionLabel="value"
                  placeholder="Select Insurance Company"
                  ariaLabel="Select Insurance Company"
                  className="pe-2 w-full border rounded-lg h-[2.5rem] border-gray-300 text-xs px-0 shadow-none"
                />
              )}
            />
            {errors.insuranceCompany && (
              <span className="text-red-500 text-xs">
                {errors.insuranceCompany.message}
              </span>
            )}
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 pt-4 gap-6">
            <div>
              <label
                className="block input-label pb-1"
                htmlFor="insuranceNumber"
              >
                Insurance Number*
              </label>
              <Controller
                name="insuranceNumber"
                control={control}
                defaultValue={selectedInsurance.insuranceNumber}
                rules={{
                  required: "Insurance number can't be empty",
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="insuranceNumber"
                    placeholder="Enter insurance Number"
                    aria-label="Insurance number"
                    className="p-0 w-full border rounded-lg h-[2.5rem] border-gray-300 text-xs px-0 shadow-none"
                  />
                )}
              />
              {errors.insuranceNumber && (
                <span className="text-red-500 text-xs">
                  {errors.insuranceNumber.message}
                </span>
              )}
              <>
                <label className="input-label my-5 block">
                  Upload your insurance ID
                </label>
                {insuranceId?.name ? (
                  <FileTile
                    handleView={() => {
                      setShowImage(true);
                      setSelectedReport(insuranceId);
                    }}
                    fileName={insuranceId?.name || ""}
                    handleRemoveFile={() => setValue("insuranceId", {} as File)}
                  />
                ) : (
                  <FileUpload
                    auto
                    customUpload
                    multiple
                    uploadHandler={(e) => setValue("insuranceId", e.files[0])}
                    chooseOptions={{
                      label: "Upload",
                      icon: <i className="pi pi-file-plus pe-2" />,
                      className: "custom-file-uploader",
                    }}
                    accept="image/*"
                    maxFileSize={1000000}
                  />
                )}
              </>
            </div>
            <div>
              <label className="block input-label pb-1" htmlFor="policyNumber">
                Policy Number*
              </label>
              <Controller
                name="policyNumber"
                control={control}
                defaultValue={selectedInsurance.policyNumber}
                rules={{
                  required: "Policy number can't be empty",
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="policyNumber"
                    placeholder="Enter Policy Number"
                    aria-label="Policy number"
                    className="p-0 w-full border rounded-lg h-[2.5rem] border-gray-300 text-xs px-0 shadow-none"
                  />
                )}
              />
              {errors.policyNumber && (
                <span className="text-red-500 text-xs">
                  {errors.policyNumber.message}
                </span>
              )}
            </div>
            <div>
              <label className="block input-label pb-1" htmlFor="groupNumber">
                Group Number*
              </label>
              <Controller
                name="groupNumber"
                control={control}
                defaultValue={selectedInsurance.groupNumber}
                rules={{
                  required: "Group number can't be empty",
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="groupNumber"
                    placeholder="Enter Group Number"
                    aria-label="Group number"
                    className="p-0 w-full border rounded-lg h-[2.5rem] border-gray-300 text-xs px-0 shadow-none"
                  />
                )}
              />
              {errors.groupNumber && (
                <span className="text-red-500 text-xs">
                  {errors.groupNumber.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
      <Toast ref={toast} />
      {showImage && (
        <ReportImage
          closeModal={() => setShowImage(false)}
          file={selectedReport}
        />
      )}
    </div>
  );
};
export default EditInsurance;
