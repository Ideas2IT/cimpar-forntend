import { IItem } from "../components/appointmentForm/AppointmentForm";

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
  medicationTakenBefore: IItem[];
  currentMedication: IItem[];
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
  id: number;
  insuranceType: string;
  insuranceNumber: string;
  policyNumber: string;
  groupNumber: string;
  insuranceCompany: string;
  insuranceCard?: File;
  insuranceId?: File;
}

export interface IRole {
  id: number;
  role_name: string;
}

export interface ILoginPayload {
  username: string;
  password: string;
}
