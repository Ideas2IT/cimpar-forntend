import {
  ICreateAppointmentPayload,
  IGetAppointmentByIdPayload,
  IGetAppointmentPayload,
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
export { createAppointment, getAppointments, getApppointmentById };
