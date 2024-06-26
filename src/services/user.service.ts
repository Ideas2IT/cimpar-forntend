import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getUserDetails = () => {
  return http.get(`/${API_URL.profile}`);
};

export { getUserDetails };
