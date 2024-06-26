export interface IMedicaine {
  code: string;
  system: string;
  display: string;
  id: string;
}
export interface ICreateMedicalConditions {
  request: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  statement: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  request_approved: boolean;
  statement_approved: boolean;
  patient_id: string;
  family_medications: string;
  family_status: string;
}

export interface IMedicationDetails {
  currentTakingMedication: IMedicaine[];
  requestId: string;
  medicationTakenBefore: IMedicaine[];
  statementId: string;
}

export interface IMedicationFormValues {
  currentMedication: IMedicaine[];
  medicationTakenBefore: IMedicaine[];
  isOnMedicine: boolean;
  hasMedicalHistory: boolean;
}

export interface IUpdateMedicationPayload {
  request: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  statement: [
    {
      code: string;
      system: string;
      display: string;
    },
  ];
  request_approved: boolean;
  statement_approved: boolean;
  patient_id: string;
  request_id: string;
  statement_id: string;
}
