import {
  INewInsurancePayload,
  IUpdateInsurancePayload,
  deleteInsurancePayload,
} from "../interfaces/insurance";
import { ICreateMedication, IUpdateMedicationPayload } from "../interfaces/medication";
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


const addMedicationDetails = (payload:ICreateMedication)=>{
  return http.post(`/${API_URL.medication}/${payload.patient_id}`)
}
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
  const _payload = {
    location: payload.location,
    phone_number: payload.phone_number,
    admission_date: payload.admission_date,
    discharge_date: payload.discharge_date,
    reason: payload.reason,
    primary_care_team: payload.primary_care_team,
    treatment_summary: payload.treatment_summary,
    follow_up_care: payload.follow_up_care,
    status: payload.status,
    class_code: payload.class_code,
  };
  return http.post(`${API_URL.visit_history}/${payload.patient_id}`, _payload);
};
const getVisitHistoryByPatientId = (id: string) => {
  return http.get(`${API_URL.visit_history}/${id}`);
};
const updateVisitHistory = (payload: IUpdateVisitHistoryPayload) => {
  return http.put(
    `${API_URL.visit_history}/${payload.patient_id}/${payload.id}`,
    payload
  );
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
  addMedicationDetails,
};
