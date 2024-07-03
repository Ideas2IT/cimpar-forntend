import { format, parseISO } from "date-fns";

export const DEFAULT_DATE_FORMAT = "dd MMMM, yyyy";

export const dateFormatter = (
  value: Date | string,
  outputFormat = DEFAULT_DATE_FORMAT
) => {
  if (!value) return "";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, outputFormat);
};
