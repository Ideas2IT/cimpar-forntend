import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getMedicationByQuery = (payload: string) => {
  return http.get(`${API_URL.medication_list}/${payload}`);
};

const getAllergiesByQuery = (payload: string) => {
  return http.get(`${API_URL.allergy_list}/${payload}`);
};

const getMedicalConditionsByQuery = (payload: string) => {
  return http.get(`${API_URL.medical_conditions_list}/${payload}`);
};

export {
  getMedicationByQuery,
  getAllergiesByQuery,
  getMedicalConditionsByQuery,
};
