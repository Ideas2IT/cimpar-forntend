import { IItem } from "../components/appointmentForm/AppointmentForm";
import { IInsurance } from "./User";
import { IMedicationDetails, IMedicine } from "./medication";
import { IVisitHistoryData } from "./visitHistory";

export interface IMedicalConditionsPayload {
  medicalConditions: IItem[];
}

export interface ICreatePatientPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  phoneNo: string;
  city: string;
  zipCode: string;
  address: string;
  state: string;
  country: string;
  email: string;
  height: string;
  race: string;
  ethnicity: string;
  weight: string;
  alternativeNumber?: string;
}

export interface IUpdatePatientPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  phoneNo: string;
  city: string;
  zipCode: string;
  address: string;
  state: string;
  country: string;
  email: string;
  height: string;
  race: string;
  ethnicity: string;
  weight: string;
  alternativeNumber?: string;
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
  alternativeNumber: string;
  phoneCode: string;
  email: string;
  lastUpdated: string;
  race: string;
  ethnicity: string;
  height: string;
  weight: string;
}

export interface IPatient {
  InsuranceDetails: IInsurance[];
  basicDetails: IPatientDetailsResponse;
  medicationDetails: IMedicationDetails;
  visitHistory: IVisitHistoryData;
  medicalConditionsAndAllergies: AllergiesAndCondtions;
}

export interface IUpdateAllergiesAndConditionsPayload {
  patient_id: string;
  current_condition_id: string;
  additional_condition_id: string;
  current_allergy_id: string;
  additional_allergy_id: string;
  family_condition_id: string;
  current_condition: IMedicine[];
  additional_condition: IMedicine[];
  current_allergy: IMedicine[];
  additional_allergy: IMedicine[];
  family_condition: boolean;
  family_medical_condition: IMedicine[];
}

export interface AllergiesAndCondtions {
  current_condition_id: string;
  additional_condition_id: string;
  current_allergy_id: string;
  additional_allergy_id: string;
  family_condition_id: string;
  medicalConditions: IMedicine[];
  familyMedicalConditions: IMedicine[];
  otherMedicalConditions: IMedicine[];
  allergies: IMedicine[];
  otherAllergies: IMedicine[];
  medicationConditionsId: string;
  hasMedicalConditionsOrAllergies?: boolean;
}

export interface ICreateMedicalCondtion {
  current_condition: IMedicine[];
  additional_condition: IMedicine[];
  current_allergy: IMedicine[];
  additional_allergy: IMedicine[];
  family_condition: boolean;
  family_medications: IMedicine[];
}

export interface ICreateMedicalCondtionPayload {
  patinetId: string;
  payload: ICreateMedicalCondtion;
}
export interface IGetEncounterPaylaod {
  page: number;
  count: number;
  patient_id: string;
}
