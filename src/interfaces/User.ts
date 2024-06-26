export interface IUserBasicDetails {}
export interface IUserContactDetails {}

export interface IUser {
  phoneNumber: number;
  alternativeNumber: number;
  fullAddress: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  firstName: string;
  middleName: string;
  lastName?: string;
  dob: string;
  gender: string;
  race: string;
  height: IHeight;
  weight: number;
  ethnicity: string;
  countryCode: string;
  alternateNumberCode: string;
  insuranceName: string;
  insuranceNumber: string;
  medicationTakenBefore: string[];
  currentMedication: string[];
  insurance?: IInsurance[];
  isOnMedicine: "yes" | "no";
  medicationalHistory: "yes" | "no";
  hasMedicalConditions: boolean;
}

interface IHeight {
  feet: number;
  inches: number;
}

export interface country {
  name: string;
  value: string;
}

export interface IMedication {
  id: number;
  name: string;
}

export interface IInsurance {
  id: string;
  insuranceType: number;
  insuranceNumber: string;
  policyNumber: string;
  groupNumber: string;
  insuranceCompany: string;
  insuranceCard?: File;
  insuranceId?: File;
}
export interface ISignupPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface ISetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export interface IProfile {
  id: string;
  dob: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  state: string;
  phoneNo: string;
  email: string;
  lastUpdated: string;
}

export interface IEditProfile {
  id: string;
  dob: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  zipCode: string;
  city: string;
  country: string;
  state: string;
  phoneNo: number | null;
  phoneCode: string;
  alternateNo: number;
  alternateCode: string;
  email: string;
  height: {
    inches: number;
    feet: number;
  };
  weight: number;
  race: string;
  ethnicity: string;
  fullAddress: string;
}
