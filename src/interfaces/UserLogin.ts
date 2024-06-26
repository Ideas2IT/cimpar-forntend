export interface ISignUp {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ISetPassword {
  newPassword: string;
  confirmPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface ILoginPayload {
  client_id: string;
  grant_type: string;
  username: string;
  password: string;
}

export interface IRotateTokenPayload {
  client_id: string;
  grant_type: string;
  refresh_token: string;
}

export interface IChangePasswordPayload {
  client_id: string;
  grant_type: string;
  username: string;
  old_password: string;
  new_password: string;
}

export interface IConfirmPasswordPayload {
  token: string;
  password: string;
}
