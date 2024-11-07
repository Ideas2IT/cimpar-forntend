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
  expirationDate: string;
}

export interface IPagination {
  page_size: number;
  total_items: number;
  total_pages: number;
  current_page: number;
}
export interface ImmunizationData {
  data: IImmunization[];
  pagination: IPagination;
}

export interface IServiceHistoryPayload {
  selectedTab: string;
  searchValue: string;
  patinetId: string;
  service_type: string;
  page: number;
  page_size: number;
}

export interface IServiceHistory {
  category: string;
  serviceFor: string;
  dateOfService: string;
  id: string;
  status?: string;
  type?: string;
  fileUrl?: string;
}

export interface IServiceHistoryData {
  pagination: IPagination;
  data: IServiceHistory[];
}
export interface ITestResultPayload {
  searchValue: string;
  patinetId: string;
  page_size: number;
  page: number;
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

export interface IImmunizationPayload {
  patient_id: string;
  immunization_id: string;
}

export interface IService {
  id: number;
  category: string;
  serviceFor: string;
  dateOfService: string;
  status: string;
}

export interface IGetTestByIdPayload {
  patient_id: string;
  test_id: string;
}

export interface IGetImmunizationPaylaod {
  page: number;
  page_size: number;
  patientId: string;
  vaccine_name: string;
}

export interface ILabTest {
  testName: string;
  dateOfTest: string;
  orderId: string;
  testedAt: string;
  specimenUsed: string;
  collectedDateTime: string;
  reportedDateTime: string;
  physicianName: string;
  contactInfo: string;
  result: string;
  range: string;
  unit: string;
  flag: string;
  status: string;
  fileUrl: string;
}

export interface ILabTestData {
  data: ILabTest[];
  pagination: IPagination;
}
