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

export const checkToday = (date: string | Date | null | undefined): boolean => {
  if (!date) {
    return false;
  }
  const dateValue = new Date(date);
  return !isNaN(dateValue.getTime()) && isToday(dateValue);
};
