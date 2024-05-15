export const ERROR = {
  NAME_ERROR: "Special characters are not allowed in the name field.",
};

export const PATTERN = {
  NAME: /^[A-Za-z\s]+$/,
  PHONE: /^\+?\d{10,12}$/,
  EMAIL: /^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
};

export const PATH_NAME = {
  PROFILE: "/profile",
  LOGIN: "/login",
  SIGNUP: "/signup",
  EDIT_PROFILE: "/edit-profile",
  EIDT_MEDICATION: "/edit-medication",
  EDIT_MEDICAL_CONDITIONS: "/edit-medical-condition",
};

export const MESSAGE = {
  PASSWORD_VERIFIED: "Your Email address has been verified successfully.",
  SIGNUP_SUCCESSFUL:
    "Successfully Signed-up , Please Login with your register email & password",
  PASSWORD_LENGTH_ERROR: "Password length should be at least 8 characters long",
  PASSOWRD_RESET: "Enter your email to recieve a link to reset your password.",
};
