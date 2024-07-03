export interface IImmunization {
  id: string;
  vaccineName: string;
  administrationDate: string;
  doseNumber: string;
  administrator: string;
  status: string;
  dosageForm: string;
  administeredCode: string;
  lotNumber: string;
  route: string;
  site: string;
  manufacturerName: string;
  expirationDate: String;
}

export interface IServiceHistoryPayload {
  labtest: boolean;
  searchValue: string;
  immunization: boolean;
  patinetId: string;
}

export interface IServiceHistory {
  category: string;
  serviceFor: string;
  dateOfService: string;
  id: string;
}

export interface ITestResultPayload {
  searchValue: string;
  patinetId: string;
}

export interface ITestResult {
  testName: string;
  testedAt: string;
  status: string;
  dateOfTest: string;
  specimenUsed: string;
  dateTimeCollected: string;
  physicianName: string;
  physicianPhone: string;
  dateTimeReported?: string;
  orderId: string;
}
