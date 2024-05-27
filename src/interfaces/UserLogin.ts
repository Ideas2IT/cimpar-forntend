export interface ISignUp {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }

 export  interface ISetPassword {
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