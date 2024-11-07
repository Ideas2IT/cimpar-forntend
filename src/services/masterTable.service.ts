import {
  IAllTestspayload,
  IToggleRecordStatusPayload,
  IUpdateMasterRecordPayload,
} from "../interfaces/common";
import {
  ICreateLocationPayload,
  IGetLocationPayload,
  ILocation,
  IToggleLocationStatusPayload,
} from "../interfaces/location";
import {
  ICreateLabTest,
  IUpdatePricingPayload,
} from "../interfaces/masterTable";
import { API_URL } from "../utils/aapiURL";
import { TABLE } from "../utils/AppConstants";
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

const getLabTestsWithoutPagination = () => {
  return http.get(`${API_URL.masterTable}/${TABLE.LAB_TEST}`);
};

const getAllTests = (payload: IAllTestspayload) => {
  const params = new URLSearchParams(
    Object.entries({
      page_size: payload.page_size?.toString(),
      page: payload.page?.toString(),
      code: payload.code,
      display: payload.display,
      service_type: payload.service_type,
      all_records: payload.all_records,
    }).filter(([_, value]) => value !== undefined && value !== "") as [
      string,
      string,
    ][]
  );

  return http.get(
    `${API_URL.masterTable}/${payload.tableName}/filtered?${params}`
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
    {
      code: payload.code,
      display: payload.display,
      is_lab: payload.is_lab,
      is_active: payload.is_active,
      is_telehealth_required: payload.is_telehealth_required,
      center_price: payload.center_price,
      home_price: payload.home_price,
      currency_symbol: "$",
      service_type: payload.service_type,
    }
  );
};

const addMasterRecord = (payload: ICreateLabTest) => {
  const params = {
    code: payload.code,
    display: payload.display,
    is_active: payload.is_active,
    is_lab: payload.is_lab,
    is_telehealth_required: payload.is_telehealth_required,
    center_price: payload.center_price,
    home_price: payload.home_price,
    currency_symbol: payload.currency_symbol,
    service_type: payload.service_type,
  };
  return http.post(`${API_URL.masterTable}/${payload.tableName}`, params);
};

const createLocation = (payload: ICreateLocationPayload) => {
  return http.post(`${API_URL.location}`, payload);
};

const getLocationsWithPagination = (payload: IGetLocationPayload) => {
  const params = {
    active: payload.active?.toString(),
    page: payload.page?.toString(),
    page_size: payload.page_size?.toString(),
  };
  const queryString = new URLSearchParams(params).toString();
  return http.get(`${API_URL.location}?${queryString}`);
};

const updateLocation = (payload: ILocation) => {
  return http.put(`${API_URL.location}?resource_id=${payload.id}`, payload);
};

const toggleLocaitonStatus = (payload: IToggleLocationStatusPayload) => {
  return http.delete(`${API_URL.location}?resource_id=${payload.resourceId}`, {
    data: { status: payload.status },
  });
};

const updatePricing = (payload: IUpdatePricingPayload) => {
  const params = {
    center_price: payload.center_price,
    home_price: payload.home_price,
  };
  return http.put(
    `${API_URL.masterTable}/${payload.tableName}/pricing?resource_id=${payload.resource_id}`,
    params
  );
};

export {
  addMasterRecord,
  createLocation,
  getAllergiesByQuery,
  getAllTests,
  getInputData,
  getLabTestsWithoutPagination,
  getLocationsWithPagination,
  getMedicalConditionsByQuery,
  getMedicationByQuery,
  toggleLocaitonStatus,
  toggleRecordStatus,
  updateMasterRecord,
  updatePricing,
  updateLocation,
};
