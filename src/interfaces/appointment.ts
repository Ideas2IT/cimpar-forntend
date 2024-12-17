import { ILabTestService } from "./common";
import { IPagination } from "./immunization";
import { IMedicine } from "./medication";
export interface ICreateAppointmentPayload {
  patientid: string;
  test_to_take: ILabTestService[];
  date_of_appointment: string;
  schedule_time: string;
  reason_for_test: string;
  other_reason: string;
  current_medical_condition: IMedicine[];
  other_medical_condition: IMedicine[];
  current_allergy: IMedicine[];
  other_allergy: IMedicine[];
  other_condition_id: string;
  current_condition_id: string;
  current_allergy_id: string;
  other_allergy_id: string;
  total_cost: number;
  test_location: string;
  service_center_location: string;
  service_type: string;
  telehealth_required: boolean;
  user_email: string;
}

export interface IAppointment {
  patient_name: string;
  age: string;
  dob: string;
  contactNumber: string;
  gender: string;
  insurance: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentFor: IMedicine[];
  reasonForTest: string;
  medicalConditions: string;
  insuranceProvider: string;
  insuraceNumber: string;
  patientId: string;
}

export interface IAppointmentList {
  id: string;
  patientName: string;
  age: string;
  gender: string;
  insurance: string;
  dateAndTime: string;
  appointmentFor: string;
  patientId: string;
}

export interface IAppointmentMeta {
  current_page: string;
  page_size: string;
  total_items: string;
  total_pages: string;
}

export interface IGetAppointmentPayload {
  patient_name: string;
  start_date: string;
  end_date: string;
  service_name: string[];
  page: number;
  page_size: number;
  appointmentFor: string[];
}

export interface IGetAppointmentByIdPayload {
  patient_id: string;
  appointment_id: string;
}

export interface ITestDetails {
  display: string;
  center_price: string;
  currency_symbol: string;
  home_price: string;
  service_type: string;
  telehealth_required: string;
}
export interface IDetailedAppointment {
  id: string;
  patientName: string;
  age: string;
  dob: string;
  contactNumber: string;
  gender: string;
  insurance: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentFor: string;
  reasonForTest: string;
  currentConditions: string;
  otherConditions: string;
  currentAllergies: string;
  otherAllergies: string;
  insuranceProvider: string;
  insuraceNumber: string;
  testDetails: ITestDetails[];
  totalCost: string;
  takeTestAt: string;
  centerLocation: string;
  paymentStatus: string;
}

export interface ISidebarAppointment {
  conditions: string;
  allergies: string;
  testName: string;
  orderId: string;
  dateOfTest: string;
  status: string;
  otherAllergies: string;
  otherMedicalConditions: string;
  testDetails: ITestDetails[];
  totalCost: string;
  takeTestAt: string;
  centerLocation: string;
  paymentStatus: string;
}

export interface ITransaction {
  patientName: string;
  serviceType: string;
  amountPaid: string | number;
  transactionId: string;
  testName: string;
  transactionDateAndTime: string;
  status: string;
  testDate: string;
  payment_mode: string;
  appointmentId: string;
  location: string;
  patientId: string;
}

export interface ICreateAppointmentResponse {
  appointment_id: string;
  client_secret: string;
  created: boolean;
  is_current_allergy_exist: boolean;
  is_current_condition_exist: boolean;
  is_other_allergy_exist: boolean;
  is_other_condition_exist: boolean;
  payment_id: string;
}

export interface ITransactionPayload {
  service_category: string;
  start_date: string;
  end_date: string;
  patient_name: string;
  page: number;
  page_size: number;
}

export interface ITransactionResponse {
  transactions: ITransaction[];
  pagination: IPagination;
}

export interface IDownloadCsvPayload {
  start_date: string;
  end_date: string;
  transaction_id?: string;
  appointment_id?: string;
}

export type TAppointmentStatus = "failed" | "Succeeded" | "pending";
