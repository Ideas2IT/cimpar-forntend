import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import {
  getPaymentStatus,
  retryPayment,
  updatePayment,
} from "../../services/payment.service";
import { SLICE_NAME, THUNK_NAME } from "../../utils/sliceUtil";
import { handleAxiosError } from "../../services/commonFunctions";

interface IProfileSlice {}

const initialState: IProfileSlice = {};

export const getPaymentStatusThunk = createAsyncThunk(
  "payment/verify_status",
  async (secretKey: string, { rejectWithValue }) => {
    try {
      const userResponse = await getPaymentStatus(secretKey);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to get payment status";
        return rejectWithValue({
          message: errorMessage,
          response: error.message,
        } as ErrorResponse);
      }
    }
  }
);

export const retryPaymentThunk = createAsyncThunk(
  THUNK_NAME.retryPayment,
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const userResponse = await retryPayment(appointmentId);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error)) {
        rejectWithValue(handleAxiosError(error));
      }
    }
  }
);

export const updatePaymentStatusThunk = createAsyncThunk(
  THUNK_NAME.updatePaymentStatus,
  async (client_secret: string, { rejectWithValue }) => {
    try {
      const userResponse = await updatePayment(client_secret);
      return userResponse.data;
    } catch (error) {
      rejectWithValue(handleAxiosError(error));
    }
  }
);

const paymentSlice = createSlice({
  name: SLICE_NAME.paymentSlice,
  initialState,
  reducers: {},
});

const { reducer } = paymentSlice;
export default reducer;
