import {
  ICreateAppointmentPayload,
  IDownloadCsvPayload,
  IGetAppointmentByIdPayload,
  IGetAppointmentPayload,
  IRetryPaymentPayload,
  ITransactionPayload,
} from "../interfaces/appointment";
import { API_URL } from "../utils/aapiURL";
import { dateFormatter } from "../utils/Date";
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

const getAllTransactions = (payload: ITransactionPayload) => {
  const params: Record<string, string> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (key === "start_date" || key === "end_date") {
        params[key] = dateFormatter(value, "dd/MM/yyyy");
      } else {
        params[key] = value;
      }
    }
  });
  const queryString = new URLSearchParams(params).toString();
  return http.get(`${API_URL.transaction}?${queryString}`);
};

const downloadTransactionsInCsv = (payload: IDownloadCsvPayload) => {
  const params: Record<string, string> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params[key] = value;
    }
  });
  const queryString = new URLSearchParams(params).toString();
  return http.post(
    `${API_URL.transaction}/${API_URL.download_csv}?${queryString}`
  );
};

const retryPayment = (payload: IRetryPaymentPayload) => {
  return http.post(`${API_URL.repayment}/${payload.appointmentId}`, {
    email: payload.email,
  });
};

export {
  confirmPayment,
  createAppointment,
  getAllTransactions,
  getAppointments,
  getApppointmentById,
  retryPayment,
  downloadTransactionsInCsv,
};
