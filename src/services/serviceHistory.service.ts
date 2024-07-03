import {
  IServiceHistoryPayload,
  ITestResultPayload,
} from "../interfaces/immunization";
import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getImmunizationByPatientId = (id: string) => {
  return http.get(`/${API_URL.immunization}/${id}`);
};

const getServiceHistory = (payload: IServiceHistoryPayload) => {
  return http.get(
    `${API_URL.serviceHistory}?immunization=${payload.immunization}&lab_test=${payload.labtest}&query=${payload.searchValue}&patinet_id=${payload.patinetId}`
  );
};

const getLabTests = (payload: ITestResultPayload) => {
  return http.get(
    `${API_URL.serviceHistory}?query=${payload.searchValue}&patinet_id=${payload.patinetId}`
  );
};

export { getImmunizationByPatientId, getServiceHistory, getLabTests };
