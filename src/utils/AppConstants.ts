export const ERROR = {
  NAME_ERROR: "Special characters are not allowed in the name field.",
};

export const ROLE = {
  ADMIN: "ADMIN",
  PATIENT: "PATIENT",
};

export const PATTERN = {
  NAME: /^[A-Za-z\s]+$/,
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
  HEALTH_RECORDS: "/health-records",
  APPOINTMENTS: "/appointments",
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
  INVALID_FILE_FORMAT:
    "Report should be in image JPG, PNG, or JPEG format only.",
  PASSWORD_UPDATE_FAILED_TITLE: "Password Update Failed",
  PASSWORD_UPDATE_FAILED_MESSAGE:
    "New password does not match with confirm password.",
};
