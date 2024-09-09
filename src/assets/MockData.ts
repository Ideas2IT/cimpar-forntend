import { LabTestResult } from "../components/LabTestResults";
import { IItem } from "../components/appointmentForm/AppointmentForm";
import { IService } from "../interfaces/immunization";
import { IMedicine } from "../interfaces/medication";
import { dateFormatter } from "../utils/Date";

export const allergies: IItem[] = [
  { id: 1, name: "Drug allergy" },
  { id: 2, name: "Dust allergy" },
  { id: 3, name: "Food allergy" },
  { id: 4, name: "Eczema allergy" },
  { id: 5, name: "insect sting allergy" },
  { id: 6, name: "Pollen allergy" },
  { id: 7, name: "Hay fever" },
];

export const countryCodes = [
  {
    name: "+1-US",
    value: "+1",
  },
  {
    name: "+10-ME",
    value: "+10",
  },
  {
    name: "+61-AU",
    value: "+61",
  },
  {
    name: "+55-BR",
    value: "+55",
  },
];

export const genders = [
  { name: "Male", value: "male" },
  { name: "Female", value: "female" },
  { name: "Other", value: "other" },
];

export const zipCodes = [
  { name: "123212", value: "123212" },
  { name: "112233", value: "112233" },
  { name: "121212", value: "121212" },
  { name: "ZY-1232", value: "zy-1232" },
];

export const countries = [
  {
    name: "USA",
    value: "USA",
  },
  {
    name: "Alaska",
    value: "Alaska",
  },
  {
    name: "Arizona",
    value: "Arizona",
  },
  {
    name: "Delaware",
    value: "Delaware",
  },
  {
    name: "Colorado",
    value: "Colorado",
  },
];

export const states = [
  {
    name: "Alabama",
    value: "Alabama",
  },
  {
    name: "Alaska",
    value: "Alaska",
  },
  {
    name: "Arizona",
    value: "Arizona",
  },
  {
    name: "Delaware",
    value: "Delaware",
  },
  {
    name: "Colorado",
    value: "Colorado",
  },
];

export interface ITest {
  id: number;
  name: string;
}

export const tests: IMedicine[] = [
  { code: "1", display: "LFT", system: "" },
  { code: "4", display: "spanish flu or Influenza", system: "" },
  { code: "2", display: "Bubonic Plague", system: "" },
  { code: "3", display: "Coronavirus", system: "" },
  { code: "5", display: "hIV/AIDS", system: "" },
  { code: "6", display: "Cholera", system: "" },
];

export const medicalConditons: IItem[] = [
  { id: 1, name: "Diabetes" },
  { id: 4, name: "panish flu or Influenza" },
  { id: 2, name: "Bubonic Plague" },
  { id: 3, name: "Coronavirus" },
  { id: 5, name: "hIV/AIDS" },
  { id: 6, name: "Cholera" },
];

export const raceList = [
  { name: "White", value: "white" },
  { name: "Black", value: "black" },
  { name: "Asian", value: "Asian" },
  { name: "African", value: "african" },
];

export const ethnicities = [
  "Italian",
  "Swedish",
  "Chinese",
  "Indian",
  "Arabic",
];

export const insurances = [
  {
    company: "Li",
  },
];

export interface IPatientMedicalDetails {
  medicalConditions: string[];
  otherMedicalConditions: string[];
  allergies: string[];
  otherAllergies: string[];
  familyMedicalConditions: string;
  areFamilyConditions: boolean;
}

export const patientMedicalDetails: IPatientMedicalDetails = {
  otherAllergies: [
    "Pharmaceutical drug",
    "Pets",
    "Food allergies",
    "Cockroaches",
    "Milk",
  ],
  medicalConditions: ["Diabetics", "Hypertension", "Mental Health Disorder"],
  otherMedicalConditions: [
    "Asthma",
    "Lung Diseases",
    "Obesity",
    "Autism",
    "Common cold",
  ],
  allergies: ["Food", "Environmental"],
  familyMedicalConditions:
    "Chronic illnesses like diabetes or asthma to less common conditions",
  areFamilyConditions: true,
};

export const serviceData: IService[] = [
  {
    id: 1,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Upcoming appointment",
  },
  {
    id: 2,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Under processing",
  },
  {
    id: 3,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Upcoming appointment",
  },
];

export interface IVisitHistory {
  id: number;
  visitLocation: string;
  admissionDate: string;
  dischargeDate: string;
  visitReason: string;
  treatmentSummary: string;
  followUpCare: string;
  patientNotes: string;
  primaryCareTeam: string;
  hospitalContact: string;
  phoneNumberCode: string;
  documents?: File[];
}
export const visitHistory: IVisitHistory[] = [
  {
    id: 1,
    visitLocation: "ACMH Hospital",
    admissionDate: "01 April,2023",
    dischargeDate: "01 April,2024 ",
    visitReason: "Broken leg in an accident",
    treatmentSummary:
      "Treatment for a broken leg typically involves realignment of the bones through surgery followed by immobilization and rehabilitation.",
    followUpCare:
      "Regular check-ups, physical therapy, and monitoring for complications to ensure full recovery",
    patientNotes:
      "Activity modification, pain management, rehabilitation exercises, and signs of complications, ensuring a smooth recovery process",
    primaryCareTeam: "Dr. Hayden Moss, Dr. Jaylin Steele",
    hospitalContact: "9906125399",
    phoneNumberCode: "+1-US",
  },
  {
    id: 2,
    visitLocation: "Harlingen Medical Centre",
    admissionDate: "10 march, 2024",
    dischargeDate: "01 April,2024 ",
    visitReason: "Pneumonia",
    treatmentSummary: "",
    followUpCare: "",
    patientNotes: "",
    primaryCareTeam: "Dr. Hayden Moss, Dr. Jaylin Steele",
    hospitalContact: "",
    phoneNumberCode: "+1-US",
  },
  {
    id: 3,
    visitLocation: "Hatford Hospital",
    admissionDate: "01 April,2024",
    dischargeDate: "01 April,2024 ",
    visitReason: "Tonsillitis surgery",
    treatmentSummary: "",
    followUpCare: "",
    patientNotes: "",
    primaryCareTeam: "Dr. Hayden Moss, Dr. Jaylin Steele",
    hospitalContact: "",
    phoneNumberCode: "+55-BR",
  },
];
export interface IImmunization {
  id: number;
  vaccineName: string;
  adminDate: string;
  doseNumber: string;
  administrator: string;
  site: string;
  view: string;
  dosageForm: string;
  lotNumber: string;
  route: string;
  status: string;
  administeredCode: string;
}

export const immunizations: IImmunization[] = [
  {
    id: 1,
    vaccineName: "Covix",
    adminDate: "12 May,2006",
    doseNumber: "1st dose",
    administrator: "Nithin",
    site: "Upper Left arm ",
    dosageForm: "3.0 ML",
    view: "",
    lotNumber: "EH9899",
    route: "Intramuscular injection",
    administeredCode: "JO7BN01",
    status: "Icare",
  },
  {
    id: 2,
    vaccineName: "Cholera(Liquid)",
    adminDate: "12 May,2006",
    doseNumber: "2nd dose",
    administrator: "Nithin",
    site: "Upper Left arm ",
    view: "",
    dosageForm: "3.0 ML",
    lotNumber: "EH9899",
    route: "Intramuscular injection",
    administeredCode: "JO7BN01",
    status: "vaccinated",
  },
  {
    id: 3,
    vaccineName: "Cholera(Liquid)",
    adminDate: "12 May,2006",
    doseNumber: "2nd dose",
    administrator: "Nithin",
    site: "Upper Left arm ",
    view: "",
    dosageForm: "3.0 ML",
    lotNumber: "EH9899",
    route: "Intramuscular injection",
    administeredCode: "JO7BN01",
    status: "Icare",
  },
  {
    id: 4,
    vaccineName: "Cholera(Liquid)",
    adminDate: "12 May,2006",
    doseNumber: "2nd dose",
    administrator: "Nithin",
    site: "Upper Left arm ",
    view: "",
    dosageForm: "3.0 ML",
    lotNumber: "EH9899",
    route: "Intramuscular injection",
    administeredCode: "JO7BN01",
    status: "Icare",
  },
  {
    id: 5,
    vaccineName: "Cholera(Liquid)",
    adminDate: "12 May,2006",
    doseNumber: "2nd dose",
    administrator: "Nithin",
    site: "Right Shoulder Muscle",
    view: "",
    dosageForm: "3.0 ML",
    lotNumber: "EH9899",
    route: "Intramuscular injection",
    administeredCode: "JO7BN01",
    status: "Vaccinated",
  },
];

export const labResults: LabTestResult[] = [
  {
    orderId: "RI 0122876",
    testName: "Blood count",
    testedAt: "Ames Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "Under Processing",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122878",
    testName: "Thyroid test",
    testedAt: "Ames Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "Under Processing",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122879",
    testName: "MRI",
    testedAt: "State Hygiene Labarotory",
    dateOfTest: dateFormatter(new Date()),
    status: "Available",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
      dateTimeReported: "12 dec, 2021",
    },
  },
  {
    orderId: "RI 0122880",
    testName: "Urine Analysis",
    testedAt: "Lakeside Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "Under Processing",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122881",
    testName: "MRI",
    testedAt: "State Hygiene Labarotory",
    dateOfTest: dateFormatter(new Date()),
    status: "Available",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122882",
    testName: "MRI",
    testedAt: "State Hygiene Labarotory",
    dateOfTest: dateFormatter(new Date()),
    status: "Available",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122883",
    testName: "USG Scan",
    testedAt: "Lakeside Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "available",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122884",
    testName: "Urine Analysis",
    testedAt: "Lakeside Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "Upcoming appointment",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122885",
    testName: "Urine Analysis",
    testedAt: "Lakeside Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "Upcoming appointment",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
  {
    orderId: "RI 0122886",
    testName: "MRI",
    testedAt: "Ames Laboratory",
    dateOfTest: dateFormatter(new Date()),
    status: "Upcoming appointment",
    data: {
      specimenUsed: "blood",
      dateTimeCollected: "12, december,2021",
      physicianName: "Guru govind",
      physicianPhone: "99991111232",
    },
  },
];

export const reportFiles = [
  { fileName: "testReports.pdf", id: 1, uploadDate: "12 may,2024" },
  {
    fileName: "Lipid profile and urine examination.pdf",
    id: 2,
    uploadDate: "01 mar, 2024",
  },
  { fileName: "KFT report .pdf", id: 4, uploadDate: "01 may, 2023" },
  { fileName: "KFT report .pdf", id: 3, uploadDate: "01 may, 2023" },
  { fileName: "KFT report .pdf", id: 5, uploadDate: "01 may, 2023" },
  { fileName: "CBC report.pdf", id: 6, uploadDate: "11 mar, 2022" },
];

export const mockautocomplateDate = [
  "allergy one",
  "allergy two",
  "long allergy e",
];

export const autoCompleteMock: IMedicine[] = [
  {
    code: "1232",
    system: "system",
    display: "Amlodipine",
  },
  {
    code: "1232",
    system: "system",
    display: "Atorvastatin",
  },
  {
    code: "1232",
    system: "system",
    display: "Levothyroxine",
  },
  {
    code: "1232",
    system: "system",
    display: "Omeprazole",
  },
  {
    code: "1232",
    system: "system",
    display: "Metformin",
  },
  {
    code: "1232",
    system: "system",
    display: "Gabapentin",
  },
];
