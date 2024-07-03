import { IItem } from "../components/appointmentForm/AppointmentForm";
import { IInsurance } from "./User";
import { IMedicationDetails } from "./medication";
import { IVisitHistory } from "./visitHistory";

export interface IMedicalConditionsPayload {
  medicalConditions: IItem[];
}

export interface ICreatePatientPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  city: string;
  zip_code: string;
  full_address: string;
  state: string;
  country: string;
  email: string;
  height: number;
  weight: number;
}

export interface IUpdatePatientPayload extends ICreatePatientPayload {
  patient_id: string;
}

export interface IPatientDetailsResponse {
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
  alternateNo: string;
  alternateCode: string;
  phoneCode: string;
  email: string;
  lastUpdated: string;
  race: string;
  ethnicity: string;
  height: number;
  weight: number;
}

export interface IPatient {
  InsuranceDetails: IInsurance[];
  basicDetails: IPatientDetailsResponse;
  medicationDetails: IMedicationDetails;
  visitHistory: IVisitHistory[];
  medicalConditions: string[];
  allergies: string;
}

export interface IUpdateAllergiesAndConditionsPayload {
  patient_id: string;
  current_condition_id: string;
  additional_condition_id: string;
  current_allergy_id: string;
  additional_allergy_id: string;
  family_condition_id: string;
  current_condition: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  additional_condition: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  current_allergy: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  additional_allergy: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  family_condition: true;
  family_medications: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
}
