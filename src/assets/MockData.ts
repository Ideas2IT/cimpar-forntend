import { IService } from "../interfaces/immunization";

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
];

export const bookingNames = [
  {
    id: "CIMPARSELFSCHEDULING@cimpar.com",
    displayName: "CIMPAR SELF SCHEDULING",
  },
  {
    id: "CIMPAR1@cimpar.com",
    displayName: "CIMPAR: IT Teams Interview",
  },
  {
    id: "CIMPARVaccinationServiceChicago@cimpar.com",
    displayName: "Chicago LTC - CIMPAR Vaccination Service",
  },
  {
    id: "CIMPAR@cimpar.com",
    displayName: "COVID19 ONSITE VACCINATION CLINIC SCHEDULING",
  },
  {
    id: "PASOCIMPARCOVID19VACCINATION@cimpar.com",
    displayName: "P.A.S.O- CIMPAR COVID19 VACCINATION",
  },
  {
    id: "COVID193RDVACCINEBOOSTER@cimpar.com",
    displayName: "CIMPAR Vaccination Service",
  },
  {
    id: "ReyaGo@cimpar.com",
    displayName: "ReyaGo Medical Transportation",
  },
  {
    id: "MonoclonalAntibodyTreatment@cimpar.com",
    displayName:
      "Test- To- Treat: Testing Monoclonal Antibodies and Oral Antiviral",
  },
  {
    id: "ReyaLabs@cimpar.com",
    displayName: "Reya Labs",
  },
];

export const tests = [{ display: "" }];
