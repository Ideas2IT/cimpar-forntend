import { IMedicine } from "./medication";

export interface ICreateAppointmentPayload {
  patientid: string;
  test_to_take: IMedicine[];
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
}

export interface SidebarAppointment {
  conditions: string;
  allergies: string;
  testName: string;
  orderId: string;
  dateOfTest: string;
  status: string;
  otherAllergies: string;
  otherMedicalConditions: string;
}
