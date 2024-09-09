import {
  IAddMasterRecordPayload,
  IAllTestspayload,
  IToggleRecordStatusPayload,
  IUpdateMasterRecordPayload,
} from "../interfaces/common";
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

const getAllTests = (payload: IAllTestspayload) => {
  return http.get(
    `${API_URL.masterTable}/${payload.tableName}/filtered?display=${payload.display}`
  );
};

const toggleRecordStatus = (payload: IToggleRecordStatusPayload) => {
  return http.delete(
    `${API_URL.masterTable}/${payload.tableName}?resource_id=${payload.resourceId}`,
    { data: { is_active: payload.is_active } }
  );
};

const updateMasterRecord = (payload: IUpdateMasterRecordPayload) => {
  return http.put(
    `${API_URL.masterTable}/${payload.tableName}?resource_id=${payload.resourceId}`,
    { code: payload.code, display: payload.display }
  );
};

const addMasterRecord = (payload: IAddMasterRecordPayload) => {
  const params = {
    code: payload.code,
    display: payload.display,
    is_active: payload.is_active,
  };
  return http.post(`${API_URL.masterTable}/${payload.tableName}`, params);
};

export {
  getMedicationByQuery,
  getAllergiesByQuery,
  getMedicalConditionsByQuery,
  getInputData,
  getAllTests,
  toggleRecordStatus,
  updateMasterRecord,
  addMasterRecord,
};
