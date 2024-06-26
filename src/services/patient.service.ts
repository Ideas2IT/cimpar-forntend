import {
  INewInsurancePayload,
  IUpdateInsurancePayload,
  deleteInsurancePayload,
} from "../interfaces/insurance";
import { IUpdateMedicationPayload } from "../interfaces/medication";
import {
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

const getPatientMedication = (id: string) => {
  return http.get(`/${API_URL.medication}/${id}`);
};

const updateMedicationByPatientId = (payload: IUpdateMedicationPayload) => {
  return http.put(`/${API_URL.medication}/${payload.patient_id}`);
};

const getPatientInsurance = (id: string) => {
  return http.get(`/${API_URL.insurance}/${id}`);
};

const addInsurance = (payload: INewInsurancePayload) => {
  return http.post(`/${API_URL.insurance}`, payload);
};

const deleteInsurance = (payload: deleteInsurancePayload) => {
  return http.delete(
    `${API_URL.insurance}/${payload.patinetId}/${payload.insuranceId}`
  );
};

const updateInsuranceById = (payload: IUpdateInsurancePayload) => {
  return http.put(
    `${API_URL.insurance}/${payload.beneficiary_id}/${payload.insurance_id}`,
    payload
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

const addVisitHistory = (payload: ICreateVisitHistoryPayload) => {
  return http.post(`${API_URL.visit_history}`, payload);
};
const getVisitHistoryByPatientId = (id: string) => {
  return http.get(`${API_URL.visit_history}/${id}`);
};
const updateVisitHistory = (payload: IUpdateVisitHistoryPayload) => {
  return http.put(`${API_URL.visit_history}/${payload.patient_id}`, payload);
};

const deleteVisitHistoryById = (payload: IDeleteVisitHistoryPayload) => {
  return http.delete(
    `${API_URL.visit_history}/${payload.patinetId}/${payload.visitHistoryId}`
  );
};

export {
  getPatientDetails,
  updateVisitHistory,
  deleteInsurance,
  getVisitHistoryByPatientId,
  updatePatientProfile,
  updateMedicalConditons,
  getPatientMedication,
  getPatientInsurance,
  addInsurance,
  getPatientMedicalConditions,
  updateInsuranceById,
  updateMedicationByPatientId,
  addVisitHistory,
  deleteVisitHistoryById,
};
