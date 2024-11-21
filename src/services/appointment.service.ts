import { transactions } from "../assets/MockData";
import {
  ICreateAppointmentPayload,
  IGetAppointmentByIdPayload,
  IGetAppointmentPayload,
  IRetryPaymentPayload,
} from "../interfaces/appointment";
import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const createAppointment = (payload: ICreateAppointmentPayload) => {
  return http.post(`${API_URL.appointment}/${payload?.patientid}`, payload);
};

const getAppointments = (payload: IGetAppointmentPayload) => {
  const payloadStringified = {
    page_size: payload.page_size?.toString(),
    page: payload.page?.toString(),
    patient_name: payload.patient_name?.toString(),
    start_date: payload.start_date?.toString(),
    end_date: payload.end_date?.toString(),
    service_name: payload.service_name?.toString(),
  };

  const params = new URLSearchParams(payloadStringified);
  return http.get(`${API_URL.appointment}?${params}`);
};

const getApppointmentById = (payload: IGetAppointmentByIdPayload) => {
  return http.get(
    `${API_URL.appointment}/${payload.patient_id}/${payload.appointment_id}`
  );
};

const confirmPayment = (paymentId: string, status: string) => {
  return http.put(`${API_URL.payment}/${status}/resource_id${paymentId}`);
};

const getAllTransactions = () => {
  return { data: transactions };
  // return http.get(`${API_URL.appointment}`);
};

const retryPayment = (payload: IRetryPaymentPayload) => {
  console.log(payload);
  return http.post(`${API_URL.repayment}/${payload.appointmentId}`, {
    email: payload.email,
  });
};

export {
  createAppointment,
  getAppointments,
  getApppointmentById,
  confirmPayment,
  getAllTransactions,
  retryPayment,
};
