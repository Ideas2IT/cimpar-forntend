import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import {
  IAppointmentList,
  IAppointmentMeta,
  ICreateAppointmentPayload,
  IDetailedAppointment,
  IDownloadCsvPayload,
  IGetAppointmentByIdPayload,
  IGetAppointmentPayload,
  ITransaction,
  ITransactionPayload,
  ITransactionResponse,
} from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import { IPagination } from "../../interfaces/immunization";
import {
  createAppointment,
  downloadTransactionsInCsv,
  getAllTransactions,
  getAppointments,
  getApppointmentById,
} from "../../services/appointment.service";
import {
  convertPaymentStatus,
  getAgeFromDob,
} from "../../services/commonFunctions";
import {
  DATE_FORMAT,
  INSURANCE_TYPE,
  NONE,
  YES,
} from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";

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

const transformTransactions = (data: any) => {
  const pagination: IPagination = {
    current_page: data?.pagination?.current_page || 0,
    page_size: data?.pagination?.page_size || 0,
    total_items: data?.pagination?.total_items || 0,
    total_pages: data?.pagination?.total_pages || 0,
  };
  if (data?.data?.length) {
    const transactions = data.data.map((item: any) => {
      return {
        amountPaid: item?.priority || "-",
        patientName: item?.patient_name || "-",
        payment_mode: "Card",
        serviceType: item?.location ? "Service center" : "At Home",
        status: convertPaymentStatus(item?.status) || "-",
        testDate: item?.start || "-",
        testName: item?.tests_taken || "-",
        transactionDateAndTime: item?.transaction_date_time || "-",
        transactionId: item?.payment_id || "-",
        appointmentId: item?.appointment_id || "-",
        location: item?.location || "-",
        patientId: item?.patient_id || "-",
      } as ITransaction;
    });
    return {
      transactions: transactions,
      pagination: pagination,
    } as ITransactionResponse;
  } else {
    return {} as ITransactionResponse;
  }
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
        : NONE,
      insuranceProvider:
        appointmentCopy?.insurance?.insurance === YES
          ? transformInsurance(appointmentCopy?.insurance?.coverage_details)
              ?.insurnaceProvider
          : "",
      insuraceNumber:
        appointmentCopy?.insurance?.insurance === YES
          ? transformInsurance(appointmentCopy?.insurance?.coverage_details)
              ?.insuranceNumber
          : NONE,
      testDetails: appointmentCopy?.test_details ?? [],
      totalCost: appointmentCopy?.total_cost || 0,
      centerLocation: appointmentCopy?.service_center_location || NONE,
      takeTestAt: appointmentCopy?.test_location || NONE,
      paymentStatus:
        convertPaymentStatus(appointmentCopy?.payment_status) || "-",
      reason_for_test: appointmentCopy?.reason_for_test || "-",
    };
    return _appointment;
  }
};

export const createAppointmentThunk = createAsyncThunk(
  "appointment/post",
  async (payload: ICreateAppointmentPayload, { rejectWithValue }) => {
    try {
      const response = await createAppointment(payload);
      return response.data;
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

export const getAllTransactionsThunk = createAsyncThunk(
  "transactions/get",
  async (payload: ITransactionPayload, { rejectWithValue }) => {
    try {
      const response = await getAllTransactions(payload);
      const _response = transformTransactions(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load translations";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const downloadtransactionsThunk = createAsyncThunk(
  "transactions/download",
  async (payload: IDownloadCsvPayload, { rejectWithValue }) => {
    try {
      const response = await downloadTransactionsInCsv(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error ||
          "Failed to load translations csv file";
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
      // .addCase(createAppointmentThunk.fulfilled, (state, { payload }) => {
      //   state.apointments = payload?.data;
      // })
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
