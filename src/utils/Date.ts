import { format } from "date-fns";

export const DEFAULT_DATE_FORMAT = "dd MMMM,yyyy";

export const dateFormatter = (
  value: Date | string,
  outputFormat = DEFAULT_DATE_FORMAT,
) => (value ? format(value, outputFormat) : "");
