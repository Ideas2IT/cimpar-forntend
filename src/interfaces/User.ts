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
  medicationTakenBefore: IMedication[];
  currentMedication: IMedication[];
  insurance?: IInsurance[];
  isOnMedicine: boolean;
  medicationalHistory: boolean;
}
interface IHeight {
  feet: number;
  inches: number;
}

interface country {
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
}
