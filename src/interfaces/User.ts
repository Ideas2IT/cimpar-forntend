export interface IUserBasicDetails {}
export interface IUserContactDetails {}

export interface IUser {
  phoneNumber: string;
  alternativeNumber: string;
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
  height: number;
  weight: number;
  ethinicity: string;
}
