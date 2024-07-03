import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
import {
  IImmunization,
  IServiceHistory,
  IServiceHistoryPayload,
  ITestResult,
  ITestResultPayload,
} from "../../interfaces/immunization";
import {
  getImmunizationByPatientId,
  getLabTests,
  getServiceHistory,
} from "../../services/serviceHistory.service";
import { ErrorResponse } from "../../interfaces/common";
import { isAxiosError } from "axios";

interface IServiceHistorySlice {
  immunizations: IImmunization[];
  serviceHistory: IServiceHistory[];
  labTests: ITestResult[];
}

const initialState: IServiceHistorySlice = {
  immunizations: [] as IImmunization[],
  serviceHistory: [] as IServiceHistory[],
  labTests: [] as ITestResult[],
};

function transformImmunization(data: any) {
  if (data?.immunizations.entry) {
    const obj = data.immunizations?.entry.map((entity: any) => {
      const resource = entity.resource;
      return {
        id: resource.id,
        vaccineName: resource.vaccineCode?.text || "",
        administrationDate: resource.occurrenceDateTime || "",
        doseNumber:
          resource.protocolApplied?.[0]?.doseNumberPositiveInt?.toString() ||
          "",
        administrator: resource.performer?.[0]?.actor?.display || "",
        status: resource?.statusReason?.coding[0]?.display || "",
        dosageForm:
          resource.doseQuantity?.value + " " + resource.doseQuantity?.unit ||
          "",
        administeredCode: resource.vaccineCode?.coding?.[0]?.code || "",
        lotNumber: resource.lotNumber || "",
        route: resource.route?.coding?.[0]?.display || "",
        site: resource.site?.coding?.[0]?.display || "",
        manufacturerName: resource.manufacturer?.display || "",
        expirationDate: resource.expirationDate || "",
      };
    });
    return obj;
  } else [];
}

export const getImmunizationsByPatientIdThunk = createAsyncThunk(
  "immunization/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getImmunizationByPatientId(id);
      const _response = transformImmunization(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error) && error?.message) {
        const errorMessage = error.message;
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
        });
      }
    }
  }
);

export const getServiceHistoryThunk = createAsyncThunk(
  "serviceHistory/get",
  async (payload: IServiceHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await getServiceHistory(payload);
      const _response = transformImmunization(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error) && error?.message) {
        const errorMessage = error.message;
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
        });
      }
    }
  }
);

export const getLabTestsThunk = createAsyncThunk(
  "labResult/get",
  async (payload: ITestResultPayload, { rejectWithValue }) => {
    try {
      const response = await getLabTests(payload);
      return response;
    } catch (error) {
      if (isAxiosError(error) && error?.message) {
        const errorMessage = error.message;
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
        });
      }
    }
  }
);

const serviceHistorySlice = createSlice({
  name: SLICE_NAME.immunizationSlice,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getImmunizationsByPatientIdThunk.fulfilled,
        (state, { payload }) => {
          state.immunizations = [...payload];
        }
      )
      .addCase(getServiceHistoryThunk.fulfilled, (state, { payload }) => {
        state.serviceHistory = payload;
      })
      .addCase(getServiceHistoryThunk.rejected, (state) => {
        state.serviceHistory = [];
      })
      .addCase(getLabTestsThunk.fulfilled, (state, { payload }) => {
        state.labTests = [...payload.data];
      });
  },
});

const { reducer } = serviceHistorySlice;
export const selectImmunizations = (state: RootState) =>
  state.serviceHistory.immunizations;
export const selectServiceHistory = (state: RootState) =>
  state.serviceHistory.serviceHistory;
export const selectLabTests = (state: RootState) =>
  state.serviceHistory.labTests;

export default reducer;
