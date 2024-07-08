export const ERROR = {
  NAME_ERROR: "Numbers are not allowed in the name field.",
};

export const ROLE = {
  ADMIN: "admin",
  PATIENT: "patient",
};

export const PATTERN = {
  NAME: /^[A-Za-z\s\W_]+$/,
  PHONE: /^\+?\d{10,12}$/,
  EMAIL: /^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
};

export const PATH_NAME = {
  HOME: "/",
  PROFILE: "/profile",
  LOGIN: "/login",
  SIGNUP: "/signup",
  EDIT_PROFILE: "/edit-profile",
  EIDT_MEDICATION: "/edit-medication",
  EDIT_MEDICAL_CONDITIONS: "/edit-medical-conditions",
  EDIT_VISIT_HISTORY: "/edit-visit-history",
  SET_PASSWORD: "/set-password",
  EDIT_INSURANCE: "/edit-insurance",
  FORGOT_PASSWORD: "/forgot-password",
  TEST_RESULT: "/test-result",
  HEALTH_RECORDS: "/create-appointment",
  APPOINTMENTS: "/appointments",
  RESET_PASSWORD: "/reset-password",
};

export const ABSOLUTE_PATH = {
  PROFILE: "profile",
  EDIT_PROFILE: "edit-profile",
  EDIT_MEDICATION: "edit-medication",
  EDIT_MEDICAL_CONDITION: "edit-medical-conditions",
  EDIT_INSURANCE: "edit-insurance",
  EDIT_VISIT_HISTORY: "edit-visit-history",
  TEST_RESULT: "test-result",
};

export const RESPONSE = {
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
};

export const MESSAGE = {
  PASSWORD_VERIFIED: "Your Email address has been verified successfully.",
  SIGNUP_SUCCESSFUL:
    "Successfully Signed-up , Please Login with your register email & password.",
  PASSWORD_LENGTH_ERROR:
    "Password length should be at least 8 characters long.",
  PASSOWRD_RESET: "Enter your email to recieve a link to reset your password.",
  APPOINTMENT_SUBMIT_WARNING:
    "Are you sure that you want to make an appointment?",
  FILE_DELETE_TOAST: "File has been deleted successfully.",
  FILE_DELETE_TOAST_TITLE: "File Deleted.",
  FILE_UPLOAD_TOAST_TITLE: "File Uploaded",
  FILE_UPLOAD_TOAST: "File has been uploaded successfully.",
  INVALID_FILE_FORMAT_TITLE: "Invalid File Format",
  INVALID_IMAGE_FORMAT:
    "Report should be in image JPG, PNG, or JPEG format only.",
  PASSWORD_UPDATE_FAILED_TITLE: "Password Update Failed",
  PASSWORD_UPDATE_FAILED_MESSAGE:
    "New password does not match with confirm password.",
};

export const INSURANCE_TYPE = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
};

export const TABS = {
  LAB_RESULT: "Lab Results",
  IMMUNIZATION: "Immunization",
  SERVICE_HISTORY: "Service History",
};
export const CLIENT_ID = "cimpar-client-jwt";
export const GRANT_TYPE = "password";
export const SYSTEM = "http://terminology.hl7.org/CodeSystem/v2-0203";
export const CODE = "1020";

export const TABLE = {
  STATE: "state",
  ETHNICITY: "ethnicity",
  RACE: "race",
  LAB_TEST: "lab_test",
};

export const RECORD_TYPE = {
  APPOINTMENT: "appointment",
  OBSERVATION: "observation",
  IMMUNIZATION: "immunization",
};
export const PAGE_LIMIT = 10;
export const APPOINTMENT = "appointment";
export const IMMUNIZATION = "immunization";
export const OBSERVATION = "observation";
export const NORMAL = "normal";

export const RESULT_STATUS = {
  UPCOMING_APPOINTMENT: "upcoming appointment",
  UNDER_PROCESSING: "pending",
  AVAILABLE: "available",
  ICARE: "icare",
};

export const SERVICE_CATEGORY = {
  LAB_TEST: "lab test",
  LAB_RESULT: "lab result",
  IMMUNIZATION: "immunization",
};

export const DIALOG_WARNING =
  "Appointment yet to be confirmed, Are you sure do you want you clear the appointment?";
export const GENDER = {
  MALE: "male",
  FEMAIL: "female",
  OTHER: "other",
};

export const ERROR_CODES = {
  EXPIRED_TOKEN: 401,
};

export const REFRESH_TOKEN = "refresh_token";
