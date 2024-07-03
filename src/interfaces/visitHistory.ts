export interface IVisitHistory {
  id: string;
  visitLocation: string;
  admissionDate: string;
  dischargeDate: string;
  visitReason: string;
  treatmentSummary: string;
  followUpCare: string;
  patientNotes: string;
  primaryCareTeam: string;
  phoneCode?: string;
  hospitalContact: string;
  documents?: File[];
}

export interface ICreateVisitHistoryPayload {
  location: string;
  phone_number: string;
  admission_date: string;
  discharge_date: string;
  reason: string;
  primary_care_team: string;
  follow_up_care: string;
  treatment_summary: string;
  status: string;
  class_code: string;
  patient_id: string;
}

export interface IUpdateVisitHistoryPayload extends ICreateVisitHistoryPayload {
  id: string;
}

export interface IDeleteVisitHistoryPayload {
  patinetId: string;
  visitHistoryId: string;
}
