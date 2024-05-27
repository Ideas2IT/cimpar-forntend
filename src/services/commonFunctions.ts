import { IItem } from "../components/appointmentForm/AppointmentForm";

export const getStatusColors = (status = "") => {
  switch (status.toLowerCase()) {
    case "upcoming appointment":
      return "bg-purple-100";
    case "under processing":
      return "bg-orange-400 bg-opacity-20";
    case "available":
      return "bg-green-600 bg-opacity-20";
    default:
      return "";
  }
};

export const getTestStatusColor = (start = 0, end = 0, value = 0) => {
  if (value < start || value > end) {
    return "font-bold text-red-500";
  }
  return "";
};

export const getFlagColor = (flag: string) => {
  return flag.toLowerCase() !== "normal" ? "font-bold text-red-500" : "";
};

export const getFullPhoneNUmber = (code: string, phoneNumber: string) => {
  return code.split("-")[0] + "-" + phoneNumber;
};

export const processString = (data: IItem[]) => {
  const medicalIssues = data.map((medicine) => medicine.name).join(", ");
  if (medicalIssues.length > 0) {
    return medicalIssues;
  } else {
    return "None";
  }
};

export const getRowClasses = (value: string) => {
  return value;
};
