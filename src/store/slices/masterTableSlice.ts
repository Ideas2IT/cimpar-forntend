import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import {
  getAllergiesByQuery,
  getMedicalConditionsByQuery,
  getMedicationByQuery,
} from "../../services/masterTable.service";
import { IMedicine } from "../../interfaces/medication";

// interface IMedication {
//   code: string;
//   id: string;
//   display: string;
// }

interface IMasterTableData {
  medications: IMedicine[];
  allergies: string[];
  medicalConditions: string[];
}

const initialState: IMasterTableData = {
  medications: [] as IMedicine[],
  allergies: [] as string[],
  medicalConditions: [] as string[],
};

function transformMedication(data: any) {
  let filteredMedication = [] as IMedicine[];
  if (data?.medication_list?.total) {
    const medicineList = data?.medication_list?.entry.map((item: any) => {
      const resource = item?.resource;
      const medicine = {
        code: resource?.code || "",
        system: resource?.system || "",
        display: resource?.display || "",
      };
      return medicine;
    });
    filteredMedication = medicineList;
  }
  return filteredMedication;
}

export const getMedicationByQueryThunk = createAsyncThunk(
  "medication_list/get",
  async (medicationName: string, { rejectWithValue }) => {
    try {
      const userResponse = await getMedicationByQuery(medicationName);
      const _response = transformMedication(userResponse.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error) && error.message) {
        const errorMessage = error.message;
        return rejectWithValue({
          message: errorMessage,
          response: error?.response?.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
        });
      }
    }
  }
);

export const getAllergiesByQueryThunk = createAsyncThunk(
  "allergy_list/get",
  async (allergyName: string, { rejectWithValue }) => {
    try {
      const userResponse = await getAllergiesByQuery(allergyName);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response?.data?.message?.split(":")[0];
        return rejectWithValue({
          message: errorMessage,
          response: error.response.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
        });
      }
    }
  }
);

export const getMedicalConditionsByQueryThunk = createAsyncThunk(
  "medical_condition_list/get",
  async (conditionName: string, { rejectWithValue }) => {
    try {
      const userResponse = await getMedicalConditionsByQuery(conditionName);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response?.data?.message?.split(":")[0];
        return rejectWithValue({
          message: errorMessage,
          response: error.response.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
        });
      }
    }
  }
);

const userSlice = createSlice({
  name: SLICE_NAME.userSlice,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMedicationByQueryThunk.fulfilled, (state, { payload }) => {
        if (payload?.length) {
          state.medications = [...payload];
        } else {
          state.medicalConditions = [];
        }
      })
      .addCase(getAllergiesByQueryThunk.fulfilled, (state, { payload }) => {
        if (state.allergies.length) {
          state.allergies = payload;
        } else {
          state.allergies = [];
        }
      })
      .addCase(
        getMedicalConditionsByQueryThunk.fulfilled,
        (state, { payload }) => {
          if (state.allergies.length) {
            state.medicalConditions = payload;
          } else {
            state.medicalConditions = [];
          }
        }
      )
      .addCase(getMedicalConditionsByQueryThunk.rejected, (state) => {
        state.medicalConditions = [];
      })
      .addCase(getMedicationByQueryThunk.rejected, (state) => {
        state.medications = [];
      })
      .addCase(getAllergiesByQueryThunk.rejected, (state) => {
        state.allergies = [];
      });
  },
});

const { reducer } = userSlice;
export const selectAllergies = (state: RootState) =>
  state.masterTable.allergies;
export const selectMedications = (state: RootState) =>
  state.masterTable.medications;
export const selectConditions = (state: RootState) =>
  state.masterTable.medicalConditions;

export default reducer;
