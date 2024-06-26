import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getImmunizationByPatientId = (id: string) => {
  return http.get(`/${API_URL.immunization}/${id}`);
};

export { getImmunizationByPatientId };
