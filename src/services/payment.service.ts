import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const getPaymentStatus = (secretkey: string) => {
  return http.get(`${API_URL.paymentStaus}/${secretkey}`);
};

const retryPayment = (appointmentId: string) => {
  return http.get(`${API_URL.repayment}/${appointmentId}`);
};

const updatePayment = (client_secret: string) => {
  return http.post(`${API_URL.payment}?status=Canceled`, {
    data: { object: { client_secret: client_secret } },
  });
};

export { getPaymentStatus, retryPayment, updatePayment };
