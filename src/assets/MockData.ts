import { LabTestResult } from "../components/LabTestResults";
import { IItem } from "../components/appointmentForm/AppointmentForm";
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
    value: "+1-US",
  },
  {
    name: "+10-ME",
    value: "+10-ME",
  },
  {
    name: "+61-AU",
    value: "+61-AU",
  },
  {
    name: "+55-BR",
    value: "+55-BR",
  },
  {
    name: "test",
    value: "testValue",
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

export const tests: ITest[] = [
  { id: 1, name: "LFT" },
  { id: 4, name: "spanish flu or Influenza" },
  { id: 2, name: "Bubonic Plague" },
  { id: 3, name: "Coronavirus" },
  { id: 5, name: "hIV/AIDS" },
  { id: 6, name: "Cholera" },
];

export const services = [
  { id: 1, name: "All Services" },
  { id: 2, name: "Lab Tests" },
  { id: 3, name: "Immunization" },
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

export const insuranceCompanies = [
  { id: 1, value: "Medicare" },
  { id: 2, value: "Cure All" },
  { id: 3, value: "Health care" },
  { id: 4, value: "Live long" },
];

export const insurances = [
  {
    company: "Li",
  },
];

export interface IPatientMedicalDetails {
  medicalConditions: IItem[];
  otherMedicalConditions: string[];
  allergies: IItem[];
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
  medicalConditions: [
    { id: 1, name: "Diabetics" },
    { id: 2, name: "Hypertension" },
    { id: 3, name: "Mental Health Disorder" },
  ],
  otherMedicalConditions: [
    "Asthma",
    "Lung Diseases",
    "Obesity",
    "Autism",
    "Common cold",
  ],
  allergies: [
    { id: 1, name: "Food" },
    { id: 2, name: "Environmental" },
  ],
  familyMedicalConditions:
    "Chronic illnesses like diabetes or asthma to less common conditions",
  areFamilyConditions: true,
};

export interface IService {
  serviceId: number;
  category: string;
  serviceFor: string;
  dateOfService: string;
  status: string;
}
export const serviceData: IService[] = [
  {
    serviceId: 1,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Upcoming appointment",
  },
  {
    serviceId: 2,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Under processing",
  },
  {
    serviceId: 3,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Upcoming appointment",
  },
  {
    serviceId: 4,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Available",
  },
  {
    serviceId: 5,
    category: "Lab Test",
    serviceFor: "Blood Count",
    dateOfService: "01 April,2024 ",
    status: "Upcoming appointment",
  },
  {
    serviceId: 6,
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
  // {
  //   orderId: "RI 0122887",
  //   testName: "Blood count",
  //   testedAt: "State Hygiene Labarotory",
  //   dateOfTest: dateFormatter(new Date()),
  //   status: "Available",
  //   data: {},
  // },
  // {
  //   orderId: "RI 0122888",
  //   testName: "Blood count",
  //   testedAt: "Ames Laboratory",
  //   dateOfTest: dateFormatter(new Date()),
  //   status: "Under Processing",
  //   data: {},
  // },
  // {
  //   orderId: "RI 0122889",
  //   testName: "Blood count",
  //   testedAt: "Ames Laboratory",
  //   dateOfTest: dateFormatter(new Date()),
  //   status: "Under Processing",
  //   data: {},
  // },
  // {
  //   orderId: "RI 0122890",
  //   testName: "Blood count",
  //   testedAt: "Ames Laboratory",
  //   dateOfTest: dateFormatter(new Date()),
  //   status: "Under Processing",
  //   data: {},
  // },
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

export const reasonsForTest: IItem[] = [
  { id: 1, name: "Usual checkup" },
  { id: 2, name: "Advised by doctor" },
  { id: 3, name: "Other" },
];

export const appointments: IAppointment[] = [
  {
    id: 1,
    patientName: "Jhon doe",
    insurance: "available",
    dateAndTime: "12 mar,2024 - 02:32",
    appointmentFor: ["Urine analysis"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
  {
    id: 2,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/2001",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
  {
    id: 3,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
  {
    id: 4,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
  {
    id: 5,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },

  {
    id: 6,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
  {
    id: 7,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
  {
    id: 8,
    patientName: "Rahul david",
    insurance: "not available",
    dateAndTime: "12 mar,2024 - 08:32",
    appointmentFor: ["Thyroid", "EEG", "covid-19"],
    age: 12,
    gender: "male",
    dateOfBirth: "12-12-1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
];

export interface IAppointment {
  id: number;
  patientName: string;
  insurance: string;
  dateAndTime: string;
  appointmentFor: string[];
  age: number;
  gender: string;
  dateOfBirth: string;
  insuranceProvider: string;
  insuranceNumber: string;
  dateOfAppointment: string;
  medicalConditions: string[];
  phoneNumber: string;
  countryCode: string;
  testReason: string;
}

export const mockAppointments: IAppointment[] = [
  {
    id: 1,
    patientName: "John Doe",
    insurance: "available",
    dateAndTime: "12 Mar, 2024 - 02:32",
    appointmentFor: ["Urine analysis"],
    age: 12,
    gender: "male",
    dateOfBirth: "12/12/1988",
    insuranceProvider: "American Family Insurance",
    insuranceNumber: "10*******982",
    dateOfAppointment: "12/06/2002",
    medicalConditions: ["coronaVirus", "cold", "cough"],
    phoneNumber: "9192900867",
    countryCode: "91-us",
    testReason: "Advised by doctor",
  },
];

export const _appointments = mockAppointments;
