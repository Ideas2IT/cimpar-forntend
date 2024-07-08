import { Button as PrimeButton } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IInsuranceResponse } from "../../interfaces/User";
import { ErrorResponse } from "../../interfaces/common";
import {
  INewInsurancePayload,
  IUpdateInsurancePayload,
} from "../../interfaces/insurance";
import { handleKeyPress } from "../../services/commonFunctions";
import {
  addInsuranceThunk,
  deleteInsuranceFileThunk,
  getInsuranceByIdThunk,
  getPatientInsuranceThunk,
  selectSelectedPatient,
  updateInsuranceByIdThunk,
} from "../../store/slices/PatientSlice";
import { getInputDataThunk } from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import {
  INSURANCE_TYPE,
  MESSAGE,
  PATH_NAME,
  RESPONSE,
} from "../../utils/AppConstants";
import Button from "../Button";
import BackButton from "../backButton/BackButton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import ReportImage from "../reportImage/ReportImage";
import useToast from "../useToast/UseToast";
import { FileTile } from "../visitHistory/EditVisitHistory";
import "./Insurance.css";

const EditInsurance = () => {
  const [insuranceCompanies, setInsuranceCompanies] = useState<string[]>([]);
  const selectedPatient = useSelector(selectSelectedPatient);
  const [selectedInsurance, setSelectedInsurance] = useState(
    {} as IInsuranceResponse
  );
  const { successToast, toast, errorToast } = useToast();
  const [showImage, setShowImage] = useState(false);
  const [updatedFile, setUpdatedFile] = useState<File>({} as File);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const insuranceDetails = useSelector(selectSelectedPatient)?.InsuranceDetails;
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

  const insuranceCompany = watch("insuranceCompany");
  const insuranceCard = watch("insuranceCard");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;
  const { id } = useParams();
  const fileUploadRef = useRef<FileUpload | null>(null);

  useEffect(() => {
    dispatch(getInputDataThunk("company")).then((response) => {
      if (response.meta?.requestStatus === RESPONSE.FULFILLED) {
        const companies = response.payload as string[];
        if (companies?.length > 0) {
          setInsuranceCompanies(["Other", ...companies]);
        } else {
          setInsuranceCompanies(["Other"]);
        }
      } else {
        errorToast("Failed to load", "Failed to get Insurance Companies");
      }
    });
  }, []);

  useEffect(() => {
    vaidateInsurance(selectedInsurance?.insuranceType);
    if (selectedInsurance?.insuranceCompany) {
      selectedInsurance.otherCompany =
        selectedInsurance?.insuranceCompany || "";
    }
    if (
      insuranceCompanies?.length &&
      !validateCompanyName() &&
      selectedInsurance &&
      Object.keys(selectedInsurance)?.length
    ) {
      selectedInsurance.insuranceCompany = "Other";
    }
    reset({ ...selectedInsurance });
  }, [selectedInsurance, insuranceCompanies]);

  const vaidateInsurance = (inusuranceType: string) => {
    setDisabledOptions(
      disabledOptions.filter(
        (option) => inusuranceType?.toLowerCase() !== option
      )
    );
  };

  useEffect(() => {
    if (insuranceDetails?.length) {
      setDisabledOptions(
        insuranceDetails?.map((ins) => ins?.insuranceType?.toLowerCase())
      );
    }
  }, [insuranceDetails]);

  const validateCompanyName = (): boolean => {
    const isPresent = insuranceCompanies
      ?.slice(0, insuranceCompanies?.length - 1)
      ?.some((c) => {
        return selectedInsurance?.insuranceCompany === c;
      });
    return isPresent;
  };

  useEffect(() => {
    if (selectedPatient?.basicDetails?.id) {
      dispatch(getPatientInsuranceThunk(selectedPatient?.basicDetails?.id));
      if (id) {
        dispatch(
          getInsuranceByIdThunk({
            patinetId: selectedPatient.basicDetails.id,
            insuranceId: id,
          })
        ).then((response) => {
          if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
            const insurance = response?.payload as IInsuranceResponse;
            const _insurance: IInsuranceResponse = {
              id: insurance.id,
              groupNumber: insurance.groupNumber,
              insuranceType: insurance.insuranceType,
              insuranceCompany: insurance.insuranceCompany,
              insuranceNumber: insurance.insuranceNumber,
              policyNumber: insurance.policyNumber,
              insuranceCard: insurance.insuranceCard,
              otherCompany: insurance.otherCompany,
              insuranceId: insurance.id,
            };
            setSelectedInsurance(_insurance);
          }
        });
      }
    }
  }, [selectedPatient?.basicDetails?.id, id]);

  const handleFormSubmit = (data: IInsuranceResponse) => {
    const payload: INewInsurancePayload = {
      file: updatedFile && Object.keys(updatedFile).length ? updatedFile : null,
      beneficiary_id: patientId,
      groupNumber: data?.groupNumber || "",
      insurance_type: data?.insuranceType || "",
      policyNumber: data?.policyNumber || "",
      providerName:
        data?.insuranceCompany?.toLowerCase() !== "other"
          ? data?.insuranceCompany
          : data.otherCompany || "",
    };
    if (selectedInsurance && !Object.keys(selectedInsurance)?.length) {
      dispatch(addInsuranceThunk(payload)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Insurance Added",
            "Insurance details has been added successfully"
          );
          setTimeout(() => {
            navigate(PATH_NAME.PROFILE);
          }, 1000);
        } else if (response?.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Failed to add Insurance", errorResponse?.message);
        }
      });
    } else {
      const updationPayload: IUpdateInsurancePayload = {
        ...payload,
        insurance_id: selectedInsurance?.id,
      };
      dispatch(updateInsuranceByIdThunk(updationPayload)).then((response) => {
        if (response?.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Updation Successful",
            "Insurance has been updated successfully"
          );
          setTimeout(() => {
            navigate(PATH_NAME.PROFILE);
          }, 1500);
        } else {
          const errorResponse = response?.payload as ErrorResponse;
          errorToast("Updation Failed", errorResponse?.message);
        }
      });
    }
  };
  const validateFileSize = () => {
    errorToast("File Size Exceeded", "File size should not exceed 1MB");
  };

  const handleRemoveFile = () => {
    if (
      selectedInsurance &&
      !updatedFile.size &&
      Object.keys(selectedInsurance)?.length > 0 &&
      typeof selectedInsurance.insuranceCard === "string"
    ) {
      const path = selectedInsurance.insuranceCard.split("?")[0];
      const filePath = path.split("/").slice(-2).join("/");
      dispatch(deleteInsuranceFileThunk(filePath)).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "File successfully",
            "Inusrance Card has been deleted successfully"
          );
        } else {
          errorToast("File deleted", "Insurance Card could not be deleted");
        }
      });
    } else {
      setUpdatedFile({} as File);
    }

    setValue("insuranceCard", "");
  };

  return (
    <div className="px-6">
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => handleKeyPress(event)}
      >
        <div className="flex flex-row justify-between pb-6">
          <BackButton
            previousPage="Insurance"
            currentPage={
              selectedInsurance && Object.keys(selectedInsurance).length
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
                <i className="pi pi-times me-2" />
                Cancel
              </Button>
            </Link>
            <PrimeButton
              className="ml-3 font-primary button-purple border px-4 py-2 h-[40px] rounded-full border-purple shadow-none"
              outlined
              onClick={() => handleSubmit}
            >
              <i className="pi pi-check me-2" />
              Save
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
              defaultValue={selectedInsurance?.insuranceType || ""}
              rules={{
                required: "Insurance Type is required",
              }}
              render={({ field }) => (
                <div
                  className="font-primary text-xl flex flex-row items-center"
                  title="You can't add multiple insurances with the same type."
                >
                  <label
                    className={`capitalize ${field.value?.toLowerCase() === INSURANCE_TYPE.PRIMARY ? "active" : disabledOptions.includes(INSURANCE_TYPE.PRIMARY) && "in-active"} type-label`}
                  >
                    <RadioButton
                      {...field}
                      disabled={disabledOptions.includes(
                        INSURANCE_TYPE.PRIMARY
                      )}
                      inputId="insuranceTypeSelector"
                      className="me-2"
                      value={INSURANCE_TYPE.PRIMARY}
                      inputRef={field.ref}
                      checked={
                        control._formValues?.insuranceType?.toLowerCase() ===
                        INSURANCE_TYPE.PRIMARY
                      }
                    />
                    {INSURANCE_TYPE.PRIMARY}
                  </label>
                  <label
                    className={`${field.value === INSURANCE_TYPE.SECONDARY ? "active" : disabledOptions.includes(INSURANCE_TYPE.SECONDARY) && "in-active"} type-label capitalize`}
                  >
                    <RadioButton
                      {...field}
                      disabled={disabledOptions.includes(
                        INSURANCE_TYPE.SECONDARY
                      )}
                      className="me-2 h-full w-full"
                      inputRef={field.ref}
                      value={INSURANCE_TYPE.SECONDARY}
                      checked={
                        field.value?.toLowerCase() === INSURANCE_TYPE.SECONDARY
                      }
                    />
                    {INSURANCE_TYPE.SECONDARY}
                  </label>
                  <label
                    className={`${control._formValues?.insuranceType === INSURANCE_TYPE.TERTIARY ? "active" : disabledOptions.includes(INSURANCE_TYPE.TERTIARY) && "in-active"} type-label capitalize`}
                  >
                    <RadioButton
                      {...field}
                      disabled={disabledOptions.includes(
                        INSURANCE_TYPE.TERTIARY
                      )}
                      className="me-2"
                      inputRef={field.ref}
                      value={INSURANCE_TYPE.TERTIARY}
                      checked={
                        field.value?.toLowerCase() === INSURANCE_TYPE.TERTIARY
                      }
                    />
                    {INSURANCE_TYPE.TERTIARY}
                  </label>
                </div>
              )}
            />
            {errors?.insuranceType && (
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
              defaultValue={selectedInsurance?.insuranceCompany}
              rules={{
                required: "Insurance Company is required",
              }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  id="company"
                  options={insuranceCompanies}
                  placeholder="Select Insurance Company"
                  ariaLabel="Select Insurance Company"
                  className="pe-2 w-full border rounded-lg h-[2.5rem] border-gray-300 text-xs px-0 shadow-none items-center"
                />
              )}
            />
            {errors?.insuranceCompany && (
              <span className="text-red-500 text-xs">
                {errors?.insuranceCompany.message}
              </span>
            )}
            {insuranceCompany?.toLowerCase() === "other" && (
              <div className="pt-2">
                <label htmlFor="otherCompanyName" className="input-label">
                  Other Insurance Company*
                </label>
                <Controller
                  name="otherCompany"
                  control={control}
                  rules={{
                    required:
                      insuranceCompany?.toLowerCase() === "other"
                        ? "Other Insurance Company is required"
                        : false,
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      value={field.value}
                      id="otherCompanyName"
                      className="input-field text-xs w-full"
                      placeholder="Enter insurance company name"
                    />
                  )}
                />
                {errors.otherCompany && (
                  <ErrorMessage message={errors.otherCompany.message} />
                )}
              </div>
            )}
          </div>
          <div className="grid lg:grid-cols-4 pt-4 gap-6">
            <div className="md:col-span-2 sm:col-span-4 lg:col-span-1">
              <label className="block input-label pb-1" htmlFor="policyNumber">
                Policy Number*
              </label>
              <Controller
                name="policyNumber"
                control={control}
                defaultValue={selectedInsurance?.policyNumber || ""}
                rules={{
                  required: "Policy Number is required",
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
            <div className="md:col-span-2 sm:col-span-4 lg:col-span-1">
              <label className="block input-label pb-1" htmlFor="groupNumber">
                Group Number*
              </label>
              <Controller
                name="groupNumber"
                control={control}
                defaultValue={selectedInsurance?.groupNumber}
                rules={{
                  required: "Group Number is required",
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
            <div className="col-span-4">
              <label className="input-label my-3 block">
                Upload your insurance ID (Max 1MB)
              </label>
              {insuranceCard ||
              (selectedInsurance && !!Object.keys(updatedFile).length) ? (
                <FileTile
                  handleView={() => {
                    setShowImage(true);
                  }}
                  fileName={
                    updatedFile && !!Object.keys(updatedFile)?.length
                      ? updatedFile.name
                      : "Insurance-Card"
                  }
                  handleRemoveFile={() => {
                    handleRemoveFile();
                  }}
                />
              ) : (
                <FileUpload
                  auto
                  ref={fileUploadRef}
                  customUpload
                  multiple
                  uploadHandler={(e) => {
                    if (e?.files?.[0]?.type?.split("/")?.[0] === "image") {
                      setUpdatedFile(e.files[0]);
                    } else {
                      errorToast(
                        MESSAGE.INVALID_FILE_FORMAT_TITLE,
                        MESSAGE.INVALID_IMAGE_FORMAT
                      );
                      fileUploadRef?.current && fileUploadRef?.current.clear();
                    }
                  }}
                  chooseOptions={{
                    label: "Upload",
                    icon: <i className="pi pi-file-plus pe-2" />,
                    className: "custom-file-uploader",
                  }}
                  accept="image/*"
                  maxFileSize={1000000}
                  onValidationFail={validateFileSize}
                />
              )}
            </div>
          </div>
        </div>
      </form>
      <Toast ref={toast} />
      {showImage && (
        <ReportImage
          image_url={
            updatedFile && !!Object.keys(updatedFile).length
              ? URL.createObjectURL(updatedFile)
              : typeof selectedInsurance?.insuranceCard === "string"
                ? selectedInsurance?.insuranceCard
                : ""
          }
          closeModal={() => setShowImage(false)}
        />
      )}
    </div>
  );
};
export default EditInsurance;
