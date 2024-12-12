import { Button as PrimeButton } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadFilesEvent } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorResponse } from "../../interfaces/common";
import {
  ICreateVisitHistoryPayload,
  IUpdateVisitHistoryPayload,
  IVisitHistory,
} from "../../interfaces/visitHistory";
import {
  cleanString,
  compareDates,
  handleKeyPress,
  splitCodeWithPhoneNumber,
} from "../../services/commonFunctions";
import {
  createVistiHistoryThunk,
  deleteVisitHistoryFileThunk,
  getVisitHistoryByIdThunk,
  selectSelectedPatient,
  updateVisitHistoryByIdThunk,
} from "../../store/slices/PatientSlice";
import { AppDispatch } from "../../store/store";
import {
  DATE_FORMAT,
  MESSAGE,
  PATH_NAME,
  RESPONSE,
} from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import "./VisitHistory.css";
// import CustomModal from "../customModal/CustomModal";
// import PdfViewer from "../PdfViewer/PdfViewer";

const EditVisitHistory = () => {
  const { toast, successToast, errorToast } = useToast();
  const uploaderRef = useRef<FileUpload | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDisabed, setIsDisabled] = useState(false);
  // const [showReport, setShowReport] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<string>({} as string);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectedpatient = useSelector(selectSelectedPatient);
  const { id } = useParams();
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
    trigger,
  } = useForm({
    defaultValues: {
      admissionDate: new Date().toString(),
      dischargeDate: new Date().toString(),
    } as IVisitHistory,
  });

  useEffect(() => {
    fetchVisitHistory();
  }, [selectedpatient?.basicDetails?.id, id]);

  const fetchVisitHistory = () => {
    if (selectedpatient?.basicDetails?.id && id)
      dispatch(
        getVisitHistoryByIdThunk({
          patinetId: selectedpatient?.basicDetails?.id,
          visitHistoryId: id,
        })
      ).then((response) => {
        const oldDetails = response.payload as IVisitHistory;
        setUploadedDocs(oldDetails?.files || []);
        reset({
          ...oldDetails,
          hospitalContact: splitCodeWithPhoneNumber(
            oldDetails?.hospitalContact
          )?.toString(),
        });
      });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const navigateBackMenu = () => {
    setTimeout(() => {
      navigate(PATH_NAME.PROFILE);
    }, 1000);
  };
  const admissionDate = watch("admissionDate");

  const handleFormSubmit = (formData: IVisitHistory) => {
    setIsDisabled(true);
    const payload: ICreateVisitHistoryPayload = {
      admission_date: dateFormatter(formData?.admissionDate, "yyyy-MM-dd"),
      class_code: "R",
      discharge_date: dateFormatter(formData?.dischargeDate, "yyyy-MM-dd"),
      location: cleanString(formData?.visitLocation) || "",
      patient_id: selectedpatient?.basicDetails?.id || "",
      phone_number: formData?.hospitalContact || "",
      primary_care_team: cleanString(formData?.primaryCareTeam) || "",
      reason: cleanString(formData?.visitReason) || "",
      status: "in-progress",
      treatment_summary: cleanString(formData?.treatmentSummary) || "",
      follow_up_care: cleanString(formData?.followUpCare) || "",
      activity_notes: cleanString(formData?.patientNotes) || "",
      files: uploadedFiles,
    };
    if (!id) {
      dispatch(createVistiHistoryThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Created Successfully",
            "Visit history is added successfully"
          );
          navigateBackMenu();
        } else {
          setIsDisabled(false);
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Creation Failed", errorResponse.message);
        }
      });
    } else {
      const updationPayload: IUpdateVisitHistoryPayload = {
        ...payload,
        id: id,
      };
      dispatch(updateVisitHistoryByIdThunk(updationPayload)).then(
        ({ meta }) => {
          if (meta.requestStatus === RESPONSE.FULFILLED) {
            successToast(
              "Updated Successfully",
              "Visit history has been updated successfully"
            );
            navigateBackMenu();
          } else {
            setIsDisabled(false);
            errorToast("Updation failed", "Visit history updation failed");
          }
        }
      );
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles;
    updatedFiles.splice(index, 1);
    setUploadedFiles([...updatedFiles]);
    successToast(MESSAGE.FILE_DELETE_TOAST_TITLE, MESSAGE.FILE_DELETE_TOAST);
  };

  const handleFileUpload = (event: FileUploadFilesEvent) => {
    let invalidFile = false;
    !!event?.files?.length &&
      event.files.map((file: File) => {
        if (file.type !== "application/pdf") {
          invalidFile = true;
        }
      });
    if (invalidFile) {
      const validFiles: File[] = event?.files?.filter((file) => {
        return file.type === "application/pdf";
      });
      if (validFiles?.length) {
        uploaderRef.current && uploaderRef.current.setFiles(validFiles);
        setUploadedFiles(validFiles);
      } else {
        uploaderRef.current?.clear();
        setUploadedFiles([]);
      }

      errorToast(
        MESSAGE.INVALID_FILE_FORMAT_TITLE,
        "Report should be in PDF format only"
      );
    } else {
      setUploadedFiles([...event.files]);
    }
  };

  useEffect(() => {
    if (uploaderRef.current) {
      uploaderRef.current.setFiles([...uploadedFiles]);
    }
  }, [uploadedFiles]);

  // const viewReport = (file: File) => {
  //   setShowReport(true);
  //   setSelectedFile(URL.createObjectURL(file));
  // };

  // const viewUrl = (url: string) => {
  //   setShowReport(true);
  //   setSelectedFile(url);
  // };

  const handleDeleteRemoteFile = (file: string) => {
    const path = file.split("?")[0];
    const filePath = path.split("/").slice(-2).join("/");
    filePath &&
      dispatch(deleteVisitHistoryFileThunk(filePath)).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            MESSAGE.FILE_DELETE_TOAST_TITLE,
            MESSAGE.FILE_DELETE_TOAST
          );
          setUploadedDocs(uploadedDocs.filter((f) => f !== file));
        } else {
          errorToast("Failed to delete file", "Failed to delete document file");
        }
      });
  };

  const validateDischargeDate = (date: string) => {
    if (compareDates(admissionDate, date)) {
      return true;
    } else {
      return "Discharge date can't be before admission date ";
    }
  };

  const confirmCancle = () => {
    confirmDialog({
      header: "Confirmation",
      message:
        "Are you sure you want to leave? Any unsaved changes will be lost",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      accept() {
        goBack();
      },
    });
  };

  const goBack = () => {
    navigate(PATH_NAME.PROFILE);
  };
  // const downloadDocument = () => {
  //   if (!Object.keys(selectedFile).length) {
  //     return;
  //   }
  //   const url = selectedFile;
  //   if (url) {
  //     const downloadUrl = url;
  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.download = "document";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(downloadUrl);
  //   }
  // };

  const downloadDocument = (fileUrl: string) => {
    if (!fileUrl) {
      return;
    }
    if (fileUrl) {
      const downloadUrl = fileUrl;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const validateFileSize = () => {
    errorToast("File Size Exceeded", "File size should not exceed 5MB");
  };

  const validateRequiredField = (value: string, field: string) => {
    if (value?.trim()) {
      return true;
    } else {
      return `${field} is required`;
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => handleKeyPress(event)}
      >
        <div className="flex flex-row justify-between px-6">
          <BackButton
            popupText="Your changes have not been saved. Are you sure you want to go back and discard the current details?"
            showConfirmDialog={true}
            backLink={PATH_NAME.PROFILE}
            previousPage="visit History"
            currentPage={id ? "Edit Visit History" : "Add Visit History"}
          />
          <div className="flex py-2 justify-between items-center">
            <ConfirmDialog />
            <Button
              onClick={confirmCancle}
              className="ml-3 font-primary text-purple-800"
              variant="primary"
              style="link"
            >
              <i className="p" />
              <i className="pi pi-times me-2"></i>Cancel
            </Button>
            <PrimeButton
              disabled={isDisabed}
              className="ml-3 font-primary text-purple-800 border px-4 py-2 rounded-full border-purple-700 shadow-none"
              outlined
              type="submit"
            >
              <i className="pi pi-check me-2"></i>Save
            </PrimeButton>
          </div>
        </div>
        <div className="bg-white rounded-lg mx-6 p-6 pb-2 h-[calc(100vh-175px)] overflow-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div className="relative">
              <label className="input-label block pb-1" htmlFor="visitLocation">
                Hospital Name*
              </label>
              <Controller
                name="visitLocation"
                control={control}
                rules={{
                  validate: (value) =>
                    validateRequiredField(value, "Hospital Name"),
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="visitLocation"
                    placeholder="Enter Hospital Name"
                    className="input-field w-full"
                  />
                )}
              />
              {errors.visitLocation && (
                <span className="text-xs text-red-500">
                  {errors.visitLocation.message}
                </span>
              )}
            </div>
            <div>
              <label className="block input-label pb-1" htmlFor="phoneNumber">
                Hospital Contact*
              </label>
              <div className="p-inputgroup buttonGroup  flex-1 w-full">
                <span className="country-code w-[40%] p-inputgroup-addon h-[2.5rem]">
                  <Dropdown
                    value="+1"
                    placeholder="+1-US"
                    disabled
                    className="border p-0 w-full h-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                  />
                </span>
                <Controller
                  name="hospitalContact"
                  control={control}
                  rules={{
                    required: "Phone Number must be 10 digits",
                    minLength: {
                      value: 10,
                      message: "Phone Number must be 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Phone Number must be 10 digits",
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      value={field.value || ""}
                      id="phoneNumber"
                      keyfilter="pint"
                      onChange={(e) => {
                        setValue("hospitalContact", e.target.value);
                        trigger("hospitalContact");
                      }}
                      placeholder="Phone Number"
                      className="border border-gray-300  rounded-r-lg w-[60%]"
                    />
                  )}
                />
              </div>
              {(errors.hospitalContact || errors.hospitalContact) && (
                <span className="text-red-500 text-xs">
                  {errors.hospitalContact.message}
                </span>
              )}
            </div>
            <div className="relative">
              <label className="pb-1 block input-label" htmlFor="admissionDate">
                Admission Date*
              </label>
              <Controller
                name="admissionDate"
                control={control}
                rules={{
                  required: "Admission Date is required",
                }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    onChange={(e) => {
                      e?.target?.value &&
                        setValue("admissionDate", e.target.value.toString());
                      trigger("dischargeDate");
                      trigger("admissionDate");
                    }}
                    value={field.value ? new Date(field?.value) : new Date()}
                    inputId="admissionDate"
                    dateFormat={DATE_FORMAT.DD_MM_YY}
                    className="calander border rounded-lg h-[2.5rem]"
                    showIcon={true}
                    icon="pi pi-calendar-minus"
                    placeholder="Selet Date"
                    maxDate={new Date()}
                  />
                )}
              />
              {errors.admissionDate && (
                <span className="text-red-500 text-xs">
                  {errors.admissionDate.message}
                </span>
              )}
            </div>
            <div className="relative">
              <label className="pb-1 input-label" htmlFor="dischargeDate">
                Discharge Date*
              </label>
              <Controller
                name="dischargeDate"
                control={control}
                rules={{
                  validate: (value) => validateDischargeDate(value),
                  required: "Discharge Date is required",
                }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    onChange={(e) => {
                      e?.target?.value &&
                        setValue("dischargeDate", e.target.value.toString());
                      trigger("dischargeDate");
                      trigger("admissionDate");
                    }}
                    inputId="dischargeDate"
                    value={field.value ? new Date(field?.value) : new Date()}
                    dateFormat={DATE_FORMAT.DD_MM_YY}
                    className="calander input-field"
                    showIcon={true}
                    icon="pi pi-calendar-minus"
                    placeholder="Select Date"
                    minDate={new Date(admissionDate)}
                  />
                )}
              />
              {errors.dischargeDate && (
                <span className="text-red-500 text-xs">
                  {errors.dischargeDate.message}
                </span>
              )}
            </div>
            <div className="relative col-span-2">
              <label className="input-label block pb-1" htmlFor="visitReason">
                Reason For Visit*
              </label>
              <Controller
                name="visitReason"
                control={control}
                rules={{
                  required: "Reason For Visit is required",
                  validate: (value) =>
                    validateRequiredField(value, "Reason For Visit"),
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="visitReason"
                    className="input-field w-full"
                    placeholder="Enter Reason For Visit"
                  />
                )}
              />
              {errors.visitReason && (
                <ErrorMessage message={errors.visitReason.message} />
              )}
            </div>
            <div className="relative col-span-2">
              <label className="input-label block pb-1" htmlFor="careTeam">
                Primary Care Team*
              </label>
              <Controller
                name="primaryCareTeam"
                control={control}
                rules={{
                  required: "Primary Care Team is required",
                  validate: (value) =>
                    validateRequiredField(value, "Primary Care Team"),
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="careTeam"
                    placeholder="Enter Names"
                    className="input-field w-full"
                  />
                )}
              />
              {errors.primaryCareTeam && (
                <ErrorMessage message={errors.primaryCareTeam.message} />
              )}
            </div>
            <div className="relative col-span-2">
              <label
                className="input-label block pb-1"
                htmlFor="treatmentSummary"
              >
                Treatment Summary*
              </label>
              <Controller
                name="treatmentSummary"
                control={control}
                rules={{
                  required: "Treatment Summary is required",
                  validate: (value) =>
                    validateRequiredField(value, "Treatment Summary"),
                }}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    id="treatmentSummary"
                    placeholder="Enter Treatment Summary"
                    className="large-input pt-2"
                  />
                )}
              />
              {errors.treatmentSummary && (
                <ErrorMessage message={errors.treatmentSummary.message} />
              )}
            </div>
            <div className="relative col-span-2">
              <label className="input-label pb-1" htmlFor="followUpCare">
                Follow-up Care*
              </label>
              <Controller
                name="followUpCare"
                control={control}
                rules={{
                  required: "Follow-up Care is required",
                  validate: (value) =>
                    validateRequiredField(value, "Follow-up Care"),
                }}
                render={({ field }) => (
                  <InputTextarea
                    id="followUpCare"
                    {...field}
                    placeholder="Enter Follow-up Care"
                    className="large-input pt-2"
                  />
                )}
              />
              {errors.followUpCare && (
                <ErrorMessage message={errors.followUpCare.message} />
              )}
            </div>
            <div className="relative col-span-2">
              <label className="input-label pb-1" htmlFor="activityNotes">
                Activity Notes*
              </label>
              <Controller
                name="patientNotes"
                control={control}
                rules={{
                  required: "Activity Notes is required",
                  validate: (value) =>
                    validateRequiredField(value, "Activity Notes"),
                }}
                render={({ field }) => (
                  <InputTextarea
                    id="activityNotes"
                    {...field}
                    placeholder="Enter Activity Notes"
                    autoResize={false}
                    className="large-input pt-2"
                  />
                )}
              />
              {errors.patientNotes && (
                <ErrorMessage message={errors.patientNotes.message} />
              )}
            </div>
          </div>
          <div className="w-[100%]">
            <label className="input-label pb-2">
              If you have any documents related,Please add them (Max 5MB)
            </label>
            <div className="grid md:grid-cols-4 md:grid-cols-2 gap-x-4 gap-y-5 py-4 max-w-[100%] overflow-wrap">
              {!!uploadedFiles?.length &&
                uploadedFiles.map((file, index) => {
                  return (
                    <FileTile
                      key={file.name}
                      // handleView={() => viewReport(file)}
                      handleView={() =>
                        downloadDocument(URL.createObjectURL(file))
                      }
                      handleRemoveFile={handleRemoveFile}
                      fileName={file.name}
                      index={index}
                    />
                  );
                })}
              {!!uploadedDocs?.length &&
                uploadedDocs.map((file, index) => {
                  return (
                    <FileTile
                      key={file}
                      // handleView={() => viewUrl(file)}
                      handleView={() => downloadDocument(file)}
                      handleRemoveFile={() => handleDeleteRemoteFile(file)}
                      fileName={"Document-" + [index]}
                      index={index}
                    />
                  );
                })}
            </div>
            <FileUpload
              name="pdf[]"
              ref={uploaderRef}
              auto
              customUpload
              multiple
              uploadHandler={(e) => handleFileUpload(e)}
              chooseOptions={{
                label: "Add",
                icon: <i className="pi pi-file-plus pe-2" />,
                className: "custom-file-uploader",
              }}
              accept="application/pdf"
              maxFileSize={6000000}
              onValidationFail={validateFileSize}
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} />
      {/* {showReport && selectedFile && (
        <CustomModal
          handleClose={() => {
            setShowReport(false);
          }}
          styleClass="h-[90%] w-[90%]"
        >
          <PdfViewer fileUrl={selectedFile} />
        </CustomModal>
      )} */}
    </div>
  );
};

export const FileTile = ({
  fileName,
  index,
  handleRemoveFile,
  handleView,
}: {
  fileName: string;
  index?: number;
  handleRemoveFile: (index: number) => void;
  handleView: (index: number) => void;
}) => {
  return (
    <div key={fileName} className="flex flex-row w-[8rem]">
      <div
        className="cursor-pointer w-[90%] text-[#2D6D80]"
        onClick={() => handleView(index || 0)}
      >
        <label
          title={fileName}
          className="block overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis"
        >
          {fileName}
        </label>
      </div>
      <div title="Delete" className="font-bold w-[10%] text-end">
        <i
          onClick={() => handleRemoveFile(index || 0)}
          className="pi pi-trash text-red-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
export default EditVisitHistory;
