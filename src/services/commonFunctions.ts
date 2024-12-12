import { KeyboardEvent } from "react";
import { IItem } from "../components/appointmentForm/AppointmentForm";
import { dateFormatter } from "../utils/Date";
import { IInsurance } from "../interfaces/User";
import { IMedicine } from "../interfaces/medication";
import { parseISO, isBefore } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  CODE,
  DATE_FORMAT,
  INSURANCE_TYPE,
  RESULT_STATUS,
  SYSTEM,
} from "../utils/AppConstants";

export const getStatusColors = (status = "") => {
  switch (status.toLowerCase()) {
    case RESULT_STATUS.UPCOMING_APPOINTMENT:
      return "bg-purple-100";
    case RESULT_STATUS.UNDER_PROCESSING:
      return "bg-orange-400 bg-opacity-20";
    case RESULT_STATUS.AVAILABLE:
    case RESULT_STATUS.ICARE:
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

export const splitCodeWithPhoneNumber = (phoneNumber: string | null) => {
  if (!phoneNumber) return null;
  if (phoneNumber.includes("+1") || phoneNumber.length > 10) {
    return Number(phoneNumber.split("+1")[1]) || null;
  }
  return phoneNumber;
};

export const combineHeight = (
  feet: number | undefined | null,
  inches: number | undefined | null
): string => {
  const validFeet = feet || 0;
  const validInches = inches || 0;
  return `${validFeet}.${validInches}`;
};

export const convertToFeetAndInches = (
  num: string | number | undefined | null
) => {
  if (!num) {
    return { feet: "0", inches: "0" };
  }
  const [feet, inches] = num?.toString().split(".").map(Number);
  return {
    feet: feet || "0",
    inches: inches || "0",
  };
};

export const getFractionalPart = (feet: number | null | undefined) => {
  if (feet) {
    const numStr = feet.toString().split(".")[0];
    if (numStr) {
      return Number(numStr);
    } else {
      return 0;
    }
  } else return 0;
};

export const getDecimalPartPart = (inches: number | null | undefined) => {
  if (inches) {
    const numStr = inches.toString().split(".")[1];
    if (numStr) {
      return Number(numStr);
    } else {
      return 0;
    }
  } else return 0;
};

export const getDobAndAge = (dob: string) => {
  if (!isNaN(new Date(dob).getTime())) {
    const dateOfBirth = dateFormatter(dob, DATE_FORMAT.DD_MMMM_YYYY);
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    return dateOfBirth + " (" + age + ")";
  } else return;
};

export function obfuscateAccountNumber(accountNumber: string) {
  const length = accountNumber?.length || 0;
  if (length <= 4) {
    return accountNumber;
  }
  const quarterLength = Math.floor(length / 4);
  const firstQuarter = accountNumber.slice(0, quarterLength);
  const lastQuarter = accountNumber.slice(-quarterLength);
  const middleLength = length - 2 * quarterLength;
  const middle = "*".repeat(middleLength);
  return firstQuarter + middle + lastQuarter;
}

export const getPolicyDetails = (insurances: IInsurance[]) => {
  if (insurances && insurances?.length) {
    const priorities = [
      INSURANCE_TYPE.PRIMARY,
      INSURANCE_TYPE.SECONDARY,
      INSURANCE_TYPE.TERTIARY,
    ];
    for (const priority of priorities) {
      const insurance = insurances.find(
        (ins) => ins.insuranceType?.toLowerCase() === priority
      );
      if (insurance) {
        return (
          insurance.insuranceCompany +
          "-" +
          obfuscateAccountNumber(insurance.policyNumber)
        );
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

export const getStringValuesFromObjectArray = (
  data: IMedicine[] | null | undefined
) => {
  if (!data) {
    return "";
  } else {
    const stringValues = data.map((obj: IMedicine) => {
      return obj.display;
    });
    return stringValues.join(", ");
  }
};

export const getStatusColor = (value: string | undefined | null) => {
  if (!value) {
    return "bg-white";
  }
  switch (value.toLowerCase()) {
    case "vaccinated":
      return "bg-[#FCEBDB]";
    case "icare":
      return "bg-[#D3EADD]";
    default:
      return "bg-white";
  }
};

export function calculateObservationStatus(
  appointmentDateStr: string | Date,
  result?: string
) {
  if (result) {
    return RESULT_STATUS.AVAILABLE;
  }
  const appointmentDate = new Date(appointmentDateStr);
  if (isNaN(appointmentDate.getTime())) {
    return RESULT_STATUS.UPCOMING_APPOINTMENT;
  }
  const currentDate = new Date();
  appointmentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  if (appointmentDate < currentDate) {
    return RESULT_STATUS.UNDER_PROCESSING;
  } else {
    return RESULT_STATUS.UPCOMING_APPOINTMENT;
  }
}
export function setAppointmentCategory(
  appointmentDateStr: string | Date,
  result?: string
) {
  if (result) {
    return "available";
  }
  const appointmentDate = new Date(appointmentDateStr);
  if (isNaN(appointmentDate.getTime())) {
    return RESULT_STATUS.UPCOMING_APPOINTMENT;
  }
  const currentDate = new Date();
  appointmentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  if (appointmentDate < currentDate) {
    return RESULT_STATUS.UNDER_PROCESSING;
  } else {
    return RESULT_STATUS.UPCOMING_APPOINTMENT;
  }
}

export const appointmentStatus = (appointmentDateStr: string | Date) => {
  const appointmentDate =
    typeof appointmentDateStr === "string"
      ? parseISO(appointmentDateStr)
      : appointmentDateStr;
  if (isNaN(appointmentDate.getTime())) {
    return RESULT_STATUS.UPCOMING_APPOINTMENT;
  }
  const appointmentDateUTC = new Date(
    formatInTimeZone(appointmentDate, "UTC", DATE_FORMAT.YYYY_MM_DD_HH_MM_SS_Z)
  );
  const currentDateUTC = new Date(
    formatInTimeZone(new Date(), "UTC", DATE_FORMAT.YYYY_MM_DD_HH_MM_SS_Z)
  );
  if (isBefore(currentDateUTC, appointmentDateUTC)) {
    return RESULT_STATUS.UPCOMING_APPOINTMENT;
  } else {
    return RESULT_STATUS.UNDER_PROCESSING;
  }
};

export const compareDates = (
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
) => {
  if (!startDate || !endDate) {
    return false;
  }
  const admission = new Date(startDate);
  const discharge = new Date(endDate);
  if (isNaN(admission.getTime()) || isNaN(discharge.getTime())) {
    return false;
  }
  return admission.getTime() <= discharge.getTime();
};

export const getObjectsFromStrings = (values: string[]) => {
  if (values?.length) {
    const objects = values.map((val) => {
      return {
        code: CODE,
        display: val,
        system: SYSTEM,
      };
    });
    return objects;
  } else {
    return [] as IMedicine[];
  }
};

export const getAgeFromDob = (dob: string) => {
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (isNaN(age)) {
    return "";
  } else return age?.toString();
};

export const getStringArrayFromObjectArray = (values: IMedicine[]) => {
  if (values?.length) {
    const stringValues = values.map((obj: IMedicine) => {
      return obj.display;
    });
    return stringValues;
  } else return [];
};

export const cleanString = (str: string | undefined) => {
  return str ? str.replace(/\s+/g, " ").trim() : "";
};

export const convertPaymentStatus = (status: string | null | undefined) => {
  if (status) {
    switch (status.toLowerCase()) {
      case "draft":
        return "Pending";
      case "active":
        return "Paid";
      case "cancelled":
        return "Failed";
      default:
        return "N/A";
    }
  } else {
    return "N/A";
  }
};
