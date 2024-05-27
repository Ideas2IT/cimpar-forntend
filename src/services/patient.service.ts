import http from "../services/common.services";
import { API_URL } from "../utils/aapiURL";

const getPatientDetails = (id: number) => {
  console.log("Patient service");
  return http.get(`/${API_URL.patients}/${id}`);
};
export { getPatientDetails };
