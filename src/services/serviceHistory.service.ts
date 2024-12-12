import {
  IGetImmunizationPaylaod,
  IGetTestByIdPayload,
  IImmunizationPayload,
  IServiceHistoryPayload,
  ITestResultPayload,
} from "../interfaces/immunization";
import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getServiceHistory = (payload: IServiceHistoryPayload) => {
  const stringifyPayload = Object.entries(payload)
    .filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    )
    .reduce(
      (acc, [key, value]) => {
        acc[key === "searchValue" ? "search_name" : key] = value.toString();
        return acc;
      },
      {} as Record<string, string>
    );
  const params = new URLSearchParams(stringifyPayload);
  return http.get(`${API_URL.serviceHistory}/${payload.patinetId}?${params}`);
};

const getLabTests = (payload: ITestResultPayload) => {
  const stringifyParams = {
    page: payload?.page?.toString(),
    count: payload?.page_size?.toString(),
    name: payload?.searchValue,
  };
  const params = new URLSearchParams(stringifyParams);
  return http.get(`${API_URL.labTests}?${params}`);
};

const getLabTestById = (payload: IGetTestByIdPayload) => {
  return http.get(
    `${API_URL.labTests}/${payload.patient_id}/${payload.test_id}`
  );
};

const getImmunizationById = (payload: IImmunizationPayload) => {
  return http.get(
    `${API_URL.immunization}/${payload.patient_id}?immunization_id=${payload.immunization_id}`
  );
};

const getImmunizationByPatientId = (paylaod: IGetImmunizationPaylaod) => {
  const stringifiedParams = {
    page: paylaod?.page?.toString(),
    count: paylaod?.page_size?.toString(),
    vaccine_name: paylaod?.vaccine_name,
  };
  const params = new URLSearchParams(stringifiedParams);
  return http.get(`/${API_URL.immunization}/${paylaod.patientId}?${params}`);
};

export {
  getImmunizationById,
  getImmunizationByPatientId,
  getLabTests,
  getServiceHistory,
  getLabTestById,
};
