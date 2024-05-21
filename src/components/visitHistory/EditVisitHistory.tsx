import { Link, useLocation } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import {
  IVisitHistory,
  countryCodes,
  visitHistory,
} from "../../assets/MockData";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "./VisitHistory.css";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { MESSAGE, PATH_NAME } from "../../utils/AppConstants";
import { Toast } from "primereact/toast";
import useToast from "../useToast/UseToast";
import ReportImage from "../reportImage/ReportImage";

const EditVisitHistory = () => {
  const [selectedHistory, setSelectedHistory] = useState({} as IVisitHistory);
  const location = useLocation();
  const { toast, successToast, errorToast } = useToast();

  useEffect(() => {
    if (visitHistory.length) {
      const visit = visitHistory.find(
        (vst) => vst.id == Number(location.pathname.split("/")[2])
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
  } = useForm({
    defaultValues: selectedHistory,
  });

  useEffect(() => {
    reset({ ...selectedHistory });
  }, [selectedHistory]);
  const uploaderRef = useRef<FileUpload | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [selectedFile, setSelectedFile] = useState({} as File);

  //TODO: Need to write the logic to handle API
  const handleFormSubmit = (fromData: IVisitHistory) => {};

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles;
    updatedFiles.splice(index, 1);
    setUploadedFiles([...updatedFiles]);
    successToast(MESSAGE.FILE_DELETE_TOAST_TITLE, MESSAGE.FILE_DELETE_TOAST);
  };

  const handleFileUpload = (event: any) => {
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
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <div className="flex flex-row justify-between px-6">
          <BackButton
            backLink={PATH_NAME.PROFILE}
            previousPage="visit History"
            currentPage={
              !!Object.keys(selectedHistory).length
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
              <label className="input-label block pb-1">Visit Location*</label>
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
                  <Controller
                    name="phoneNumberCode"
                    control={control}
                    defaultValue={selectedHistory.phoneNumberCode}
                    rules={{
                      required: "Country code is required",
                      minLength: {
                        value: 2,
                        message: "Country code can't be empty",
                      },
                    }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        value={field.value}
                        options={countryCodes}
                        optionLabel="name"
                        placeholder="Select"
                        className="border p-0 w-full h-full border border-gray-300 text-xs px-0 shadow-none !border-r-0"
                      />
                    )}
                  />
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
                      keyfilter="pint"
                      onChange={(e) =>
                        setValue("hospitalContact", e.target.value)
                      }
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
              <label className="pb-1 input-label">Admission Date*</label>
              <Controller
                name="admissionDate"
                control={control}
                defaultValue={selectedHistory.admissionDate}
                rules={{
                  required: "Admission date is required",
                }}
                render={({ field }) => (
                  <Calendar
                    value={new Date(field.value)}
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
              <label className="pb-1 input-label">Discharge Date*</label>
              <Controller
                name="dischargeDate"
                control={control}
                defaultValue={selectedHistory.dischargeDate}
                rules={{
                  required: "Discharge date is required",
                }}
                render={({ field }) => (
                  <Calendar
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
              <label className="input-label pb-1">Reason for visit*</label>
              <Controller
                name="visitReason"
                control={control}
                defaultValue={selectedHistory.visitReason}
                render={({ field }) => (
                  <InputText
                    {...field}
                    className="input-field w-full"
                    placeholder="Enter reason for visit"
                  />
                )}
              />
            </div>
            <div className="relative col-span-2">
              <label className="input-label pb-1">Primary Care Team*</label>
              <Controller
                name="primaryCareTeam"
                control={control}
                defaultValue={selectedHistory.primaryCareTeam}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="Enter Names"
                    className="input-field w-full"
                  />
                )}
              />
            </div>
            <div className="relative col-span-2">
              <label className="input-label pb-1">Treatment Summary*</label>
              <Controller
                name="treatmentSummary"
                control={control}
                defaultValue={selectedHistory.treatmentSummary}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    placeholder="Enter Treatment Summary"
                    className="large-input pt-2"
                  />
                )}
              />
            </div>
            <div className="relative col-span-2">
              <label className="input-label pb-1">Follow-up Care*</label>
              <Controller
                name="followUpCare"
                control={control}
                defaultValue={selectedHistory.followUpCare}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    placeholder="Enter Follow-up care"
                    className="large-input pt-2"
                  />
                )}
              />
            </div>
            <div className="relative col-span-2">
              <label className="input-label pb-1">Activity Notes*</label>
              <Controller
                name="patientNotes"
                control={control}
                defaultValue={selectedHistory.patientNotes}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    placeholder="Enter activity notes"
                    autoResize={false}
                    className="large-input pt-2"
                  />
                )}
              />
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
      <Toast ref={toast} />
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
