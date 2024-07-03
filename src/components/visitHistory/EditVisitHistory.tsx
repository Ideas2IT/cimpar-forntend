import { Link, useLocation, useNavigate } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "./VisitHistory.css";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload, FileUploadFilesEvent } from "primereact/fileupload";
import { MESSAGE, PATH_NAME, RESPONSE } from "../../utils/AppConstants";
import { Toast } from "primereact/toast";
import useToast from "../useToast/UseToast";
import ReportImage from "../reportImage/ReportImage";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { handleKeyPress } from "../../services/commonFunctions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  createVistiHistoryThunk,
  selectSelectedPatient,
  updateVisitHistoryByIdThunk,
} from "../../store/slices/PatientSlice";
import {
  ICreateVisitHistoryPayload,
  IUpdateVisitHistoryPayload,
  IVisitHistory,
} from "../../interfaces/visitHistory";
import { dateFormatter } from "../../utils/Date";

const EditVisitHistory = () => {
  const [selectedHistory, setSelectedHistory] = useState({} as IVisitHistory);
  const location = useLocation();
  const { toast, successToast, errorToast } = useToast();
  const uploaderRef = useRef<FileUpload | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [selectedFile, setSelectedFile] = useState({} as File);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectedpatient = useSelector(selectSelectedPatient);

  useEffect(() => {
    if (selectedpatient?.visitHistory.length) {
      const visit = selectedpatient?.visitHistory.find(
        (vst) => vst.id == location.pathname.split("/")[2]
      );
      if (visit !== undefined) {
        setSelectedHistory(visit);
      }
    }
  }, [location.pathname]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: selectedHistory,
  });

  useEffect(() => {
    reset({ ...selectedHistory });
  }, [selectedHistory]);

  //TODO: Need to write the logic to handle API
  const handleFormSubmit = (formData: IVisitHistory) => {
    const payload: ICreateVisitHistoryPayload = {
      admission_date: dateFormatter(formData?.admissionDate, "yyyy-MM-dd"),
      class_code: "R",
      discharge_date: dateFormatter(formData?.dischargeDate, "yyyy-MM-dd"),
      location: formData.visitLocation,
      patient_id: selectedpatient?.basicDetails?.id,
      phone_number: "+1" + formData.hospitalContact,
      primary_care_team: formData.primaryCareTeam,
      reason: formData.visitReason,
      status: "in-progress",
      treatment_summary: formData.treatmentSummary,
      follow_up_care: formData.followUpCare,
    };
    if (!Object.keys(selectedHistory).length) {
      dispatch(
        createVistiHistoryThunk(payload as ICreateVisitHistoryPayload)
      ).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Created Successfully",
            "Visit history is added successfully"
          );
        }
      });
    } else {
      const updationPayload: IUpdateVisitHistoryPayload = {
        ...payload,
        id: selectedHistory.id,
      };
      dispatch(updateVisitHistoryByIdThunk(updationPayload)).then(
        ({ meta }) => {
          if (meta.requestStatus === RESPONSE.FULFILLED) {
            successToast(
              "Updated Successfully",
              "Visit history has been updated successfully"
            );
          } else {
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
    !!event.files.length &&
      event.files.map((file: File) => {
        if (file.type.split("/")[0] !== "image") {
          invalidFile = true;
        }
      });
    if (invalidFile) {
      errorToast(
        MESSAGE.INVALID_FILE_FORMAT_TITLE,
        MESSAGE.INVALID_FILE_FORMAT
      );
    } else {
      setUploadedFiles([...event.files]);
      successToast(MESSAGE.FILE_UPLOAD_TOAST_TITLE, MESSAGE.FILE_UPLOAD_TOAST);
    }
  };

  useEffect(() => {
    if (uploaderRef.current) {
      uploaderRef.current.setFiles([...uploadedFiles]);
    }
  }, [uploadedFiles]);

  const viewReport = (index: number) => {
    setShowReport(true);
    setSelectedFile(uploadedFiles[index]);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        onKeyDown={(event) => handleKeyPress(event)}
      >
        <div className="flex flex-row justify-between px-6">
          <BackButton
            backLink={PATH_NAME.PROFILE}
            previousPage="visit History"
            currentPage={
              Boolean(Object.keys(selectedHistory).length)
                ? "Edit Visit History"
                : "Add Visit History"
            }
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
        <div className="bg-white rounded-lg m-6 p-6">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div className="relative">
              <label className="input-label block pb-1" htmlFor="visitLocation">
                Visit Location*
              </label>
              <Controller
                name="visitLocation"
                control={control}
                defaultValue={selectedHistory.visitLocation}
                rules={{
                  required: "Visit location can't be empty",
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="visitLocation"
                    placeholder="Enter Hospitan Name"
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
                Phone Number*
              </label>
              <div className="p-inputgroup buttonGroup  flex-1 w-full">
                <span className="country-code w-[40%] p-inputgroup-addon h-[2.5rem]">
                  {/* <Controller
                    name="phoneCode"
                    control={control}
                    defaultValue={selectedHistory?.hospitalContact}
                    rules={{
                      required: "Country code is required",
                      minLength: {
                        value: 2,
                        message: "Country code can't be empty",
                      },
                    }}
                    render={({ field }) => ( */}
                  <Dropdown
                    value="+!"
                    placeholder="+1-US"
                    disabled
                    className="border p-0 w-full h-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                  />
                  {/* )}
                  /> */}
                </span>
                <Controller
                  name="hospitalContact"
                  control={control}
                  defaultValue={selectedHistory.hospitalContact}
                  rules={{
                    required: "Phone number is required",
                    minLength: {
                      value: 6,
                      message: "Phone number can't be less than 6 digit",
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
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
                  Invalid Phone Number/Code
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
                defaultValue={selectedHistory.admissionDate}
                rules={{
                  required: "Admission date is required",
                }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    onChange={(e) =>
                      e?.target?.value &&
                      setValue("admissionDate", e.target.value.toString())
                    }
                    value={new Date(field.value)}
                    inputId="admissionDate"
                    dateFormat="dd MM, yy"
                    className="calander border rounded-lg h-[2.5rem]"
                    showIcon={true}
                    icon="pi pi-calendar-minus"
                    placeholder="Selet Date"
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
                defaultValue={selectedHistory.dischargeDate}
                rules={{
                  required: "Discharge date is required",
                }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    onChange={(e) =>
                      e?.target?.value &&
                      setValue("dischargeDate", e.target.value.toString())
                    }
                    inputId="dischargeDate"
                    value={new Date(field.value)}
                    dateFormat="dd MM, yy"
                    className="calander input-field"
                    showIcon={true}
                    icon="pi pi-calendar-minus"
                    placeholder="Select Date"
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
                Reason for visit*
              </label>
              <Controller
                name="visitReason"
                control={control}
                rules={{
                  required: "Visit reason can't be empty",
                }}
                defaultValue={selectedHistory.visitReason}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="visitReason"
                    className="input-field w-full"
                    placeholder="Enter reason for visit"
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
                  required: "Test list can't be empty",
                }}
                defaultValue={selectedHistory.primaryCareTeam}
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
                  required: "Treatment summary can't be empty",
                }}
                defaultValue={selectedHistory.treatmentSummary}
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
                  required: "Follow-up care can't be empty",
                }}
                defaultValue={selectedHistory.followUpCare}
                render={({ field }) => (
                  <InputTextarea
                    id="followUpCare"
                    {...field}
                    placeholder="Enter Follow-up care"
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
                  required: "Active notes can't be empty",
                }}
                defaultValue={selectedHistory.patientNotes}
                render={({ field }) => (
                  <InputTextarea
                    id="activityNotes"
                    {...field}
                    placeholder="Enter activity notes"
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
              If you have any documents related,Please add them (optional)
            </label>
            <div className="grid md:grid-cols-4 md:grid-cols-2 gap-x-4 gap-y-5 py-4 max-w-[100%] overflow-wrap">
              {!!uploadedFiles.length &&
                uploadedFiles.map((file, index) => {
                  return (
                    <FileTile
                      handleView={viewReport}
                      handleRemoveFile={handleRemoveFile}
                      fileName={file.name}
                      index={index}
                    />
                  );
                })}
            </div>
            <FileUpload
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
              accept="image/*"
              maxFileSize={1000000}
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} onHide={() => navigate(PATH_NAME.PROFILE)} />
      {showReport && (
        <ReportImage
          closeModal={() => setShowReport(false)}
          file={selectedFile}
        />
      )}
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
