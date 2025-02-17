export interface IMedicine {
  code: string;
  system: string;
  display: string;
}
export interface ICreateMedication {
  request: IMedicine[]
  statement: IMedicine[]
  request_approved: boolean;
  statement_approved: boolean;
  patient_id: string;
  family_medications?: string;
  family_status?: string;
}

export interface IMedicationDetails {
  currentTakingMedication: IMedicine[];
  requestId: string;
  medicationTakenBefore: IMedicine[];
  statementId: string;
}

export interface IMedicationFormValues {
  currentMedication: IMedicine[];
  medicationTakenBefore: IMedicine[];
  isOnMedicine: boolean;
  hasMedicalHistory: boolean;
}

export interface IUpdateMedicationPayload {
  request: IMedicine[]
  statement: IMedicine[];
  request_approved: boolean;
  statement_approved: boolean;
  patient_id: string;
  request_id: string;
  statement_id: string;
}

export interface IThunkResponse {
  payload: IMedicine[];
}
