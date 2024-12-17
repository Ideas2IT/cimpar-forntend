import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import { getPaymentStatus, retryPayment } from "../../services/payment.service";
import { SLICE_NAME } from "../../utils/sliceUtil";

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
  "payment/verify_status",
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const userResponse = await retryPayment(appointmentId);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error.message,
        } as ErrorResponse);
      }
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
