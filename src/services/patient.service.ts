import {
  INewInsurancePayload,
  IUpdateInsurancePayload,
  deleteInsurancePayload,
} from "../interfaces/insurance";
import {
  ICreateMedication,
  IUpdateMedicationPayload,
} from "../interfaces/medication";
import {
  ICreateMedicalCondtionPayload,
  IGetEncounterPaylaod,
  IUpdateAllergiesAndConditionsPayload,
  IUpdatePatientPayload,
} from "../interfaces/patient";
import {
  ICreateVisitHistoryPayload,
  IDeleteVisitHistoryPayload,
  IUpdateVisitHistoryPayload,
} from "../interfaces/visitHistory";
import http from "../services/common.services";
import { API_URL } from "../utils/aapiURL";

const getPatientDetails = (id: string) => {
  return http.get(`/${API_URL.patient}/${id}`);
};

const updatePatientProfile = (payload: IUpdatePatientPayload) => {
  return http.put(`/${API_URL.patient}/${payload.patient_id}`, payload);
};

const addMedicationDetails = (payload: ICreateMedication) => {
  const duplicatePayload = {
    ...payload,
    family_medications: "none",
    family_status: "active",
  };
  return http.post(
    `/${API_URL.medication}/${payload.patient_id}`,
    duplicatePayload
  );
};
const getPatientMedication = (id: string) => {
  return http.get(`/${API_URL.medication}/${id}`);
};

const updateMedicationByPatientId = (payload: IUpdateMedicationPayload) => {
  return http.put(`/${API_URL.medication}/${payload.patient_id}`, payload);
};

const getPatientInsurance = (id: string) => {
  return http.get(`/${API_URL.insurance}/${id}`);
};

const addInsurance = (payload: INewInsurancePayload) => {
  const formData = new FormData();
  if (payload.file) {
    formData.append("file", payload.file);
  }
  formData.append("beneficiary_id", payload.beneficiary_id);
  formData.append("insurance_type", payload.insurance_type);
  formData.append("providerName", payload.providerName);
  formData.append("policyNumber", payload.policyNumber);
  formData.append("groupNumber", payload.groupNumber);
  return http.post(`/${API_URL.insurance}/${payload.beneficiary_id}`, formData);
};

const deleteInsurance = (payload: deleteInsurancePayload) => {
  return http.delete(
    `${API_URL.insurance}/${payload.patinetId}/${payload.insuranceId}`
  );
};

const updateInsuranceById = (payload: IUpdateInsurancePayload) => {
  const formData = new FormData();
  if (payload.file) {
    formData.append("file", payload.file);
  }
  formData.append("insurance_type", payload.insurance_type);
  formData.append("providerName", payload.providerName);
  formData.append("policyNumber", payload.policyNumber);
  formData.append("groupNumber", payload.groupNumber);

  return http.put(
    `${API_URL.insurance}/${payload.beneficiary_id}?insurance_id=${payload.insurance_id}`,
    formData
  );
};

const getInsuranceById = (payload: deleteInsurancePayload) => {
  return http.get(
    `${API_URL.insurance}/${payload.patinetId}/${payload.insuranceId}`
  );
};
const getPatientMedicalConditions = (id: string) => {
  return http.get(`${API_URL.Medical_problems}/${id}`);
};
const updateMedicalConditons = (
  payload: IUpdateAllergiesAndConditionsPayload
) => {
  return http.put(`${API_URL.Medical_problems}/${payload.patient_id}`, payload);
};

const createMedicalConditions = (payload: ICreateMedicalCondtionPayload) => {
  http.post(
    `${API_URL.Medical_problems}/${payload.patinetId}`,
    payload.payload
  );
};

const addVisitHistory = (payload: ICreateVisitHistoryPayload) => {
  const formData = new FormData();
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append(`file`, file);
    });
  }
  formData.append("location", payload.location);
  formData.append("phone_number", payload.phone_number);
  formData.append("admission_date", payload.admission_date);
  formData.append("discharge_date", payload.discharge_date);
  formData.append("reason", payload.reason);
  formData.append("primary_care_team", payload.primary_care_team);
  formData.append("follow_up_care", payload.follow_up_care);
  formData.append("treatment_summary", payload.treatment_summary);
  formData.append("status", payload.status);
  formData.append("class_code", payload.class_code);
  formData.append("activity_notes", payload.activity_notes);
  formData.append("patient_id", payload.patient_id);
  return http.post(`${API_URL.visit_history}/${payload.patient_id}`, formData);
};
const getVisitHistoryByPatientId = (paylaod: IGetEncounterPaylaod) => {
  return http.get(
    `${API_URL.visit_history}/${paylaod.patient_id}?page=${paylaod.page}&count=${paylaod.count}`
  );
};

const deleteVisitHistoryFile = (payload: string) => {
  return http.delete(`${API_URL.visit_history}/file?blob_name=${payload}`);
};

const deleteInsuranceFile = (payload: string) => {
  return http.delete(`${API_URL.insurance}/file?blob_name=${payload}`);
};

const updateVisitHistory = (payload: IUpdateVisitHistoryPayload) => {
  const formData = new FormData();
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append(`file`, file);
    });
  }
  formData.append("location", payload.location);
  formData.append("phone_number", payload.phone_number);
  formData.append("admission_date", payload.admission_date);
  formData.append("discharge_date", payload.discharge_date);
  formData.append("reason", payload.reason);
  formData.append("primary_care_team", payload.primary_care_team);
  formData.append("follow_up_care", payload.follow_up_care);
  formData.append("treatment_summary", payload.treatment_summary);
  formData.append("status", payload.status);
  formData.append("class_code", payload.class_code);
  formData.append("activity_notes", payload.activity_notes);
  formData.append("patient_id", payload.patient_id);
  formData.append("id", payload.id);
  formData.append("activity_notes", payload.activity_notes);

  return http.put(
    `${API_URL.visit_history}/${payload.patient_id}/${payload.id}`,
    formData
  );
};

const deleteVisitHistoryById = (payload: IDeleteVisitHistoryPayload) => {
  return http.delete(
    `${API_URL.visit_history}/${payload.patinetId}/${payload.visitHistoryId}`
  );
};

const getVisitHistoryById = (payload: IDeleteVisitHistoryPayload) => {
  return http.get(
    `${API_URL.visit_history}/${payload.patinetId}/${payload.visitHistoryId}`
  );
};

export {
  addInsurance,
  addMedicationDetails,
  addVisitHistory,
  createMedicalConditions,
  deleteInsurance,
  deleteInsuranceFile,
  deleteVisitHistoryById,
  deleteVisitHistoryFile,
  getInsuranceById,
  getPatientDetails,
  getPatientInsurance,
  getPatientMedicalConditions,
  getPatientMedication,
  getVisitHistoryById,
  getVisitHistoryByPatientId,
  updateInsuranceById,
  updateMedicalConditons,
  updateMedicationByPatientId,
  updatePatientProfile,
  updateVisitHistory,
};
