export interface INewInsurancePayload {
  beneficiary_id: string;
  insurance_type: string;
  providerName: string;
  policyNumber: string;
  groupNumber: string;
  file: File | null;
}

export interface IUpdateInsurancePayload extends INewInsurancePayload {
  insurance_id: string;
}

export interface IDeleteInsurancePayload {
  insuranceId: string;
  patinetId: string;
}

export interface IInsurance {
  id: string;
  insuranceType: number;
  insuranceNumber: string;
  policyNumber: string;
  groupNumber: string;
  insuranceCompany: string;
  insuranceCard?: File;
  insuranceId?: File;
}
