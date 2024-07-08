import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getMedicationByQuery = (payload: string) => {
  return http.get(`${API_URL.medication_list}?medication_name=${payload}`);
};

const getAllergiesByQuery = (payload: string) => {
  return http.get(`${API_URL.allergy_list}?allergy_name=${payload}`);
};

const getMedicalConditionsByQuery = (payload: string) => {
  return http.get(
    `${API_URL.medical_conditions_list}?medical_condition=${payload}`
  );
};

const getInputData = (tableName: string) => {
  return http.get(`${API_URL.masterTable}/${tableName}`);
};

export {
  getMedicationByQuery,
  getAllergiesByQuery,
  getMedicalConditionsByQuery,
  getInputData,
};
