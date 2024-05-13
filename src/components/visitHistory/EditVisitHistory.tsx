import { Link, useLocation } from "react-router-dom";
import BackButton from "../backButton/BackButton";
import Button from "../Button";
import { Button as PrimeButton } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import {
  IVisitHistory,
  countryCodes,
  reportFiles,
  visitHistory,
} from "../../assets/MockData";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "./VisitHistory.css";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { PATH_NAME } from "../../utils/AppConstants";

const EditVisitHistory = () => {
  const [selectedHistory, setSelectedHistory] = useState({} as IVisitHistory);
  const location = useLocation();

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

  const handleFormSubmit = (fromData: IVisitHistory) => {
    console.log(fromData);
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
              <label className="input-label block">Visit Location*</label>
              <Controller
                name="visitLocation"
                control={control}
                defaultValue={selectedHistory.visitLocation}
                rules={{
                  required: "Visit location can't be empty",
                }}
                render={({ field }) => (
                  <InputText {...field} className="input-field w-full" />
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
                      className="border border-gray-300  rounded-tr-md z-100 w-[60%]"
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
              <label className="pb-1 input-label">Admission Date*</label>
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
                  <InputText {...field} className="input-field w-full" />
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
                  <InputText {...field} className="input-field w-full" />
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
                  <InputTextarea {...field} className="large-input" />
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
                  <InputTextarea {...field} className="large-input" />
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
                    autoResize={false}
                    className="large-input"
                  />
                )}
              />
            </div>
          </div>
          <div className="">
            <label className="input-label pb-2">
              If you have any documents related,Please add them (optional)
            </label>
            <div className="flex flex-row grid md:grid-cols-3">
              {reportFiles.map((reportFile) => {
                return (
                  <div className="report-wrapper">
                    <div className="w-[80%]">
                      <label
                        title={reportFile.fileName}
                        className="block overflow-hidden whitespace-nowrap overflow-ellipsis"
                      >
                        {reportFile.fileName}
                      </label>
                      <label className="font-tertiary text-sm">
                        {reportFile.uploadDate}
                      </label>
                    </div>
                    <div className="font-bold">
                      <i className="pi pi-pen-to-square text-purple-800 px-3" />
                      <i className="pi pi-trash text-red-500" />
                    </div>
                  </div>
                );
              })}
            </div>
            <FileUpload
              chooseOptions={{
                label: "Add",
                icon: <i className="pi pi-file-plus pe-2" />,
                className:
                  " bg-[#EEF1F4] text-[#2D6D80] rounded-full px-5 border-none",
              }}
              mode="basic"
              name="demo[]"
              url="/api/upload"
              accept="image/*, application/pdf"
              maxFileSize={1000000}
              // onUpload={onUpload}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditVisitHistory;
