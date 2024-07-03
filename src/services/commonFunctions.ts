import { KeyboardEvent } from "react";
import { IItem } from "../components/appointmentForm/AppointmentForm";
import { dateFormatter } from "../utils/Date";
import { IInsurance } from "../interfaces/User";

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
  if (phoneNumber.includes("+") || phoneNumber.length > 10) {
    return Number(phoneNumber.split("+1")[1]);
  }
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

export const getDobAndAge = (dob: string) => {
  if (!isNaN(new Date(dob).getTime())) {
    const dateOfBirth = dateFormatter(dob, "dd MMMM, yyyy");
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    return dateOfBirth + " (" + age + ")";
  } else return;
};

export const getPolicyDetails = (insurances: IInsurance[]) => {
  if (insurances && insurances.length) {
    const priorities = [1, 2, 3];
    for (const priority of priorities) {
      const insurance = insurances.find(
        (ins) => ins.insuranceType === priority
      );
      if (insurance) {
        return insurance.insuranceCompany + "-" + insurance.policyNumber;
      }
    }
  } else return "";
};

export const maskNumber = (value: string) => {
  if (value && value?.length > 5) {
    const start = value?.slice(0, 2);
    const end = value?.slice(value?.length - 3, value.length);
    return start + "*****" + end;
  } else {
    return "";
  }
};
