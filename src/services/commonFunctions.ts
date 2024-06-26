import { KeyboardEvent } from "react";
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

export const getFullPhoneNumber = (
  code: string,
  phoneNumber: number | string | null
) => {
  return code + phoneNumber;
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

export const handleKeyPress = (event: KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter") {
    if (document.activeElement?.tagName !== "BUTTON") {
      event.preventDefault();
    }
  }
};

export const createFullName = (
  firstName: string,
  middleName: string,
  lastName: string
) => {
  let fullNameArray = [firstName, middleName, lastName].filter(
    (name) => name && name.trim()
  );

  return fullNameArray.join(" ");
};

export const getInsuranceTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return "Primary";
    case 2:
      return "Secondary";

    case 3:
      return "Tertiary";

    default:
      return "Not Available";
  }
};

export const combinePhoneAndCode = (
  code: string,
  phoneNumber: string
): string => {
  return code + "-" + phoneNumber;
};

export const splitCodeWithPhoneNumber = (phoneNumber: String) => {
  if (phoneNumber && phoneNumber.includes("-")) {
    const response = {
      code: phoneNumber.split("-")[0],
      phone: phoneNumber.split("-")[1],
    };
    return response;
  } else return { code: "", phone: phoneNumber };
};

export const combineHeight = (
  feet: number | undefined | null,
  inches: number | undefined | null
): number => {
  const validFeet = feet || 0;
  const validInches = inches || 0;
  return Number(`${validFeet}.${validInches}`);
};

export const convertToFeetAndInches = (num = 0) => {
  const [feet, inches] = num.toString().split(".").map(Number);
  return {
    feet: feet || 0,
    inches: inches || 0,
  };
};
export const getFractionalPart = (inches: number) => {
  if (inches) {
    const numStr = inches.toString();
    const decimalIndex = numStr.indexOf(".");
    if (decimalIndex === -1) {
      return 0;
    }
    return parseInt(numStr.substring(decimalIndex + 1), 10);
  } else return 0;
};
