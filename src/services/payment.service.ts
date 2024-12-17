import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getPaymentStatus = (secretkey: string) => {
  return http.get(`${API_URL.paymentStaus}/${secretkey}`);
};

const retryPayment = (appointmentId: string) => {
  return http.get(`${API_URL.repayment}/${appointmentId}`);
};
export { getPaymentStatus, retryPayment };
