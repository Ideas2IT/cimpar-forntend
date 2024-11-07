import React from "react";
import { useSelector } from "react-redux";
import {
  convertToFeetAndInches,
  createFullName,
} from "../../services/commonFunctions";
import { selectSelectedPatient } from "../../store/slices/PatientSlice";
import { dateFormatter } from "../../utils/Date";

const UserDetails = () => {
  const selectedPatient = useSelector(selectSelectedPatient);

  const patientDetails = React.useMemo(
    () => [
      {
        label: "NAME",
        value: createFullName(
          selectedPatient?.basicDetails?.firstName || "",
          selectedPatient?.basicDetails?.middleName || "",
          selectedPatient?.basicDetails?.lastName || ""
        ),
      },
      {
        label: "DOB",
        value: dateFormatter(selectedPatient?.basicDetails?.dob) || "",
      },
      { label: "GENDER", value: selectedPatient?.basicDetails?.gender || "" },
      {
        label: "RACE",
        value:
          selectedPatient?.basicDetails?.race?.toLowerCase() === "white"
            ? "white or caucasian"
            : selectedPatient?.basicDetails?.race || "-",
      },
      {
        label: "HEIGHT",
        value:
          convertToFeetAndInches(selectedPatient?.basicDetails?.height).feet +
          " feet, " +
          convertToFeetAndInches(selectedPatient?.basicDetails?.height).inches +
          " inches ",
      },
      {
        label: "WEIGHT",
        value: (selectedPatient?.basicDetails?.weight || "0") + " Pounds",
      },
      {
        label: "ETHNICITY",
        value: selectedPatient?.basicDetails?.ethnicity || "",
      },
    ],
    [selectedPatient]
  );

  const contactDetails = React.useMemo(
    () => [
      {
        label: "PHONE NUMBER",
        value:
          selectedPatient.basicDetails?.phoneNo &&
          "+1-" + selectedPatient.basicDetails?.phoneNo,
      },
      {
        label: "ALTERNATIVE NUMBER",
        value:
          selectedPatient?.basicDetails?.alternativeNumber &&
          "+1-" + selectedPatient?.basicDetails?.alternativeNumber,
      },
      {
        label: "FULL ADDRESS",
        value: selectedPatient?.basicDetails?.address ?? "",
      },
      { label: "ZIP CODE", value: selectedPatient?.basicDetails?.zipCode },
      { label: "CITY", value: selectedPatient?.basicDetails?.city },
      { label: "STATE", value: selectedPatient?.basicDetails?.state },
      { label: "COUNTRY", value: selectedPatient?.basicDetails?.country },
    ],
    [selectedPatient]
  );

  return (
    <div className="p-3">
      <div className="font-primary text-xl">Basic Details</div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        {patientDetails.map((detail) => {
          return (
            <PatientDetails
              key={detail.label}
              label={detail.label}
              value={String(detail.value) || ""}
            />
          );
        })}
      </div>
      <div className="font-primary text-xl pt-6 pb-3">Contact Details</div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {contactDetails.map((detail) => {
          return (
            <div
              key={detail.label}
              className={`${detail.label === "FULL ADDRESS" && "md:col-span-2"}`}
            >
              <PatientDetails label={detail.label} value={detail.value} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PatientDetails = ({
  label,
  value,
}: {
  value: string;
  label: string;
}) => {
  return (
    <div className="border-b border-gray-100">
      <div className="font-secondary text-sm text-[#283956] opacity-65 py-2 max-w-[100%] text-ellipsis overflow-hidden">
        {label ? label : "-"}
      </div>
      <div
        title={value}
        className="font-primary pb-2 text-[#283956] truncate max-w-[90%] capitalize"
      >
        {value ? value : "-"}
      </div>
    </div>
  );
};

export default UserDetails;
