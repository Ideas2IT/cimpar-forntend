import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import {
  ErrorResponse,
  IAddMasterRecordPayload,
  IAllTestspayload,
  IToggleRecordStatusPayload,
  IUpdateMasterRecordPayload,
} from "../../interfaces/common";
import { IMedicine } from "../../interfaces/medication";
import {
  addMasterRecord,
  getAllergiesByQuery,
  getAllTests,
  getInputData,
  getMedicalConditionsByQuery,
  getMedicationByQuery,
  toggleRecordStatus,
  updateMasterRecord,
} from "../../services/masterTable.service";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";

interface IMasterTableData {
  medications: IMedicine[];
  allergies: IMedicine[];
  medicalConditions: IMedicine[];
}

const initialState: IMasterTableData = {
  medications: [] as IMedicine[],
  allergies: [] as IMedicine[],
  medicalConditions: [] as IMedicine[],
};

const transformMedicalCondition = (data: any) => {
  if (!data?.length) {
    return [] as IMedicine[];
  }
  const medicalConditions: IMedicine[] = data.map((condition: any) => {
    return {
      display: condition.display,
      code: condition.code,
      system: condition.system,
    };
  });
  return medicalConditions;
};

const transformOptionData = (data: any) => {
  if (!data) {
    return [];
  } else {
    const options = data?.map((option: any) => {
      return option.display;
    });
    const filteredOptions = options?.filter(
      (option: string) => option !== null
    );
    return filteredOptions;
  }
};

const transformTests = (data: any) => {
  if (!data) {
    return [] as IMedicine[];
  } else {
    const tests = data?.map((test: any) => {
      return {
        code: test.code,
        system: test.id,
        display: test.display,
      };
    });
    return tests;
  }
};

const transformMedication = (data: any) => {
  if (!data?.length) {
    return [];
  }
  const medications = data?.map((med: any) => {
    const medicine: IMedicine = {
      code: med?.code || "",
      display: med?.display || "",
      system: med.system || "",
    };
    return medicine;
  });
  return medications;
};

export const getMedicationByQueryThunk = createAsyncThunk(
  "medication_list/get",
  async (medicationName: string, { rejectWithValue }) => {
    try {
      const response = await getMedicationByQuery(medicationName);
      const _response = transformMedication(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getMedicalConditionsByQueryThunk = createAsyncThunk(
  "medical_condition_list/get",
  async (conditionName: string, { rejectWithValue }) => {
    try {
      const response = await getMedicalConditionsByQuery(conditionName);
      return transformMedicalCondition(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getInputDataThunk = createAsyncThunk(
  "input-data/get",
  async (tableName: string, { rejectWithValue }) => {
    try {
      const response = await getInputData(tableName);
      const _response = transformOptionData(response?.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getOptionValuesThunk = createAsyncThunk(
  "input-data/get",
  async (tableName: string, { rejectWithValue }) => {
    try {
      const response = await getInputData(tableName);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getLabTestsForAdminThunk = createAsyncThunk(
  "tests/get",
  async (payload: IAllTestspayload, { rejectWithValue }) => {
    try {
      const response = await getAllTests(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load Lab Tests";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const toggleRecordStatusThunk = createAsyncThunk(
  "master/delete",
  async (payload: IToggleRecordStatusPayload, { rejectWithValue }) => {
    try {
      const response = await toggleRecordStatus(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to change the status";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getAllTestsThunk = createAsyncThunk(
  "tests/get",
  async (tableName: string, { rejectWithValue }) => {
    try {
      const response = await getInputData(tableName);
      const _response = transformTests(response?.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const updateMasterRecordThunk = createAsyncThunk(
  "master/update",
  async (payload: IUpdateMasterRecordPayload, { rejectWithValue }) => {
    try {
      const response = await updateMasterRecord(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update master table";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const addMasterRecordThunk = createAsyncThunk(
  "master/update",
  async (payload: IAddMasterRecordPayload, { rejectWithValue }) => {
    try {
      const response = await addMasterRecord(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error ||
          "Failed to add record to master table";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
          state.medications = [];
        }
      })
      .addCase(getAllergiesByQueryThunk.fulfilled, (state, { payload }) => {
        if (payload?.length) {
          state.allergies = [...payload];
        } else {
          state.allergies = [];
        }
      })
      .addCase(
        getMedicalConditionsByQueryThunk.fulfilled,
        (state, { payload }) => {
          if (payload?.length) {
            state.medicalConditions = [...payload];
          } else {
            state.medicalConditions = [] as IMedicine[];
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
