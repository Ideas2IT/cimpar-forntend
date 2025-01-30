import { format, isToday } from "date-fns";
import { DATE_FORMAT } from "./AppConstants";

export const DEFAULT_DATE_FORMAT = DATE_FORMAT.DD_MMM_YYYY;

export const dateFormatter = (
  value: Date | string | null | undefined,
  outputFormat = DEFAULT_DATE_FORMAT
) => {
  try {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    return format(date, outputFormat);
  } catch (error) {
    return "";
  }
};

// export const dateFormatter = (
//   value: Date | string | null | undefined,
//   outputFormat = DEFAULT_DATE_FORMAT
// ) => {
//   // try {
//     if (!value) return "-";
//     // const date = typeof value === "string" ? new Date(value) : value;
//     // const year = date.getUTCFullYear();
//     // const month = date.getUTCMonth();
//     // const day = date.getUTCDate();
//     // const hours = date.getUTCHours();
//     // const minutes = date.getUTCMinutes();
//     // const utcDate = new Date(year, month, day, hours, minutes, 0);
//     return format(value, outputFormat);
//   // } catch (error) {
//   //   return "";
//   // }
// };

export const checkToday = (date: string | Date | null | undefined): boolean => {
  if (!date) {
    return false;
  }
  const dateValue = new Date(date);
  return !isNaN(dateValue.getTime()) && isToday(dateValue);
};

export const combineDateAndTime = (date: Date, timeString: string): Date => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  const combinedDate = new Date(date);
  combinedDate.setUTCHours(hours, minutes, 0, 0);

  return combinedDate;
};

export const convertDateAndTimeToUtc = (dateInput: Date, timeInput: Date) => {
  try {
    if (!dateInput || !timeInput) return;
    const dateObj = new Date(dateInput);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    const hours = timeInput.getHours();
    const minutes = timeInput.getMinutes();
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, 0));
    return utcDate.toISOString();
  } catch (error) {
    return;
  }
};

export const combineDateToUTc = (dateInput: Date, timeInput: string) => {
  const [hours, minutes] = timeInput.split(":").map(Number);
  const dateObj = new Date(dateInput);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, 0));
  return utcDate.toISOString();
};

export const formatUTCDateToUtcString = (utcDateString: Date) => {
  const date = new Date(utcDateString);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(Date.UTC(year, month, day, 0, 0, 0)).toISOString();
};

export const formatUTCDate = (utcDateString: string): string => {
  const date = new Date(utcDateString); // Parse the date string
  const year = date.getUTCFullYear();
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  }); // Get UTC month
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year} ${month}, ${day}:${hours}${minutes}`;
};

export const formatUTCToLocalTime = (utcDateString: string): string => {
  const date = new Date(utcDateString); // Parse the UTC date string
  return format(date, "hh:mm a"); // Format only time in 12-hour format
};
