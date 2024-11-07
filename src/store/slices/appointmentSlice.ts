import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import {
  IAppointmentList,
  IAppointmentMeta,
  ICreateAppointmentPayload,
  IDetailedAppointment,
  IGetAppointmentByIdPayload,
  IGetAppointmentPayload,
} from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import {
  createAppointment,
  getAppointments,
  getApppointmentById,
} from "../../services/appointment.service";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";
import { dateFormatter } from "../../utils/Date";
import { getAgeFromDob } from "../../services/commonFunctions";
import { DATE_FORMAT, INSURANCE_TYPE } from "../../utils/AppConstants";

type appointmentInitialState = {
  apointments: IAppointmentList[];
  appointmentMeta: IAppointmentMeta;
};

const initialState: appointmentInitialState = {
  apointments: [] as IAppointmentList[],
  appointmentMeta: {} as IAppointmentMeta,
};

const transformAppointments = (data: any) => {
  if (!data?.data?.length) {
    return [] as IAppointmentList[];
  }
  const response = data?.data?.map((appointment: any) => {
    const result: IAppointmentList = {
      id: appointment?.appointmentId || "",
      dateAndTime:
        dateFormatter(appointment?.end, DATE_FORMAT.DD_MMM_YYYY_HH_MM_A) ||
        "Invalid Date",
      insurance:
        appointment?.insurance?.toLowerCase() === "no"
          ? "Not Available"
          : "Available",
      age: getAgeFromDob(appointment?.dob) || "",
      appointmentFor: appointment?.appointmentFor || "",
      gender: appointment?.gender || "NA",
      patientName: appointment?.name || "",
      patientId: appointment?.patientId || "",
    };
    return result;
  });
  return response;
};

const transformConditionsAndAllergies = (data: any, type: string) => {
  let medicalConditions = "";
  if (data?.length) {
    data?.forEach((element: any) => {
      if (element.note.toLowerCase() === type) {
        if (element.code_display.length > 0) {
          medicalConditions = element?.code_display.join(", ");
        }
      }
    });
  }
  return medicalConditions;
};

const transformInsurance = (data: any) => {
  const insuranceTypes = [
    INSURANCE_TYPE.PRIMARY,
    INSURANCE_TYPE.SECONDARY,
    INSURANCE_TYPE.TERTIARY,
  ];

  for (const insuranceType of insuranceTypes) {
    const insurance = data.find(
      (ins: any) => ins.note?.toLowerCase() === insuranceType
    );
    if (insurance) {
      return {
        insuranceNumber: insurance.policyNumber,
        insurnaceProvider: insurance.providerName,
      };
    }
  }
};

const transformSingleAppointment = (data: any) => {
  const appointmentCopy = data?.data?.[0];
  if (appointmentCopy) {
    const _appointment: IDetailedAppointment = {
      id: appointmentCopy?.appointmentId,
      patientName: appointmentCopy?.name,
      age: getAgeFromDob(appointmentCopy?.dob),
      dob: dateFormatter(appointmentCopy?.dob, DATE_FORMAT.DD_MMM_YYYY),
      contactNumber: appointmentCopy?.phoneNo ?? "",
      gender: appointmentCopy?.gender,
      insurance: appointmentCopy?.insurance,
      appointmentDate: appointmentCopy?.end || "",
      appointmentTime: dateFormatter(appointmentCopy?.end, DATE_FORMAT.HH_MM_A),
      appointmentFor: appointmentCopy?.appointmentFor,
      reasonForTest: appointmentCopy?.reason_for_test ?? "-",
      currentConditions: appointmentCopy?.condition?.conditions.length
        ? transformConditionsAndAllergies(
            appointmentCopy?.condition?.conditions,
            "current"
          )
        : "",
      otherConditions: appointmentCopy?.condition?.conditions.length
        ? transformConditionsAndAllergies(
            appointmentCopy?.condition?.conditions,
            "other"
          )
        : "",
      currentAllergies: appointmentCopy?.condition.allergies.length
        ? transformConditionsAndAllergies(
            appointmentCopy?.condition.allergies,
            "current"
          )
        : "",
      otherAllergies: appointmentCopy?.condition.allergies.length
        ? transformConditionsAndAllergies(
            appointmentCopy?.condition.allergies,
            "other"
          )
        : "",
      insuranceProvider:
        appointmentCopy?.insurance?.insurance === "Yes"
          ? transformInsurance(appointmentCopy?.insurance?.coverage_details)
              ?.insurnaceProvider
          : "",
      insuraceNumber:
        appointmentCopy?.insurance?.insurance === "Yes"
          ? transformInsurance(appointmentCopy?.insurance?.coverage_details)
              ?.insuranceNumber
          : "",
    };
    return _appointment;
  }
};

export const createAppointmentThunk = createAsyncThunk(
  "appointment/post",
  async (payload: ICreateAppointmentPayload, { rejectWithValue }) => {
    try {
      const response = await createAppointment(payload);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to create appointment";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getAllAppointmentsThunk = createAsyncThunk(
  "appointments/get",
  async (payload: IGetAppointmentPayload, { rejectWithValue }) => {
    try {
      const response = await getAppointments(payload);
      const metaData = response.data.pagination;
      const _response = transformAppointments(response.data);
      return { response: _response, meta: metaData };
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load appointments";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getAppointmentByIdThunk = createAsyncThunk(
  "appointments/get_by_id",
  async (payload: IGetAppointmentByIdPayload, { rejectWithValue }) => {
    try {
      const response = await getApppointmentById(payload);
      const _response = transformSingleAppointment(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load appointment";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

const userSlice = createSlice({
  name: SLICE_NAME.appointmentSlice,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointmentThunk.fulfilled, (state, { payload }) => {
        state.apointments = payload?.data;
      })
      .addCase(getAllAppointmentsThunk.fulfilled, (state, { payload }) => {
        if (payload) {
          state.apointments = [...payload?.response];
          state.appointmentMeta = payload?.meta;
        }
      });
  },
});

const { reducer } = userSlice;
export const selectAppointments = (state: RootState) =>
  state.appointment.apointments;
export const getTotalAppointment = (state: RootState) =>
  state.appointment.appointmentMeta;
export default reducer;
