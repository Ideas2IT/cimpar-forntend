import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { getPatientDetails } from "../../services/patient.service";
import { IUser } from "../../interfaces/User";
import { IMedicalConditionsPayload } from "../../interfaces/patient";
interface IPatient {
  name: string;
  selectedPatient: IUser;
  allPatients: IUser[];
}

const initialState: IPatient = {
  name: "nothing",
  selectedPatient: {} as IUser,
  allPatients: [] as IUser[],
};

export const getPatinetDetailsThunk = createAsyncThunk(
  "patinet/get",
  async (id: number) => {
    try {
      const userResponse = await getPatientDetails(id);
      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPatientsThunk = createAsyncThunk(
  "allPatients/get",
  async (id: number) => {
    try {
      const userResponse = await getPatientDetails(id);
      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMedicalConditionsThunk = createAsyncThunk(
  "medicalConditions/get",
  async (id: number) => {
    try {
      const userResponse = await getPatientDetails(id); //TODO: Need to chance
      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPatientPersonalDetailsThunk = createAsyncThunk(
  "patientPersonal/get",
  async (id: number) => {
    try {
      const userResponse = await getPatientDetails(id); //TODO: Need to chance
      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateMedicalConditonsThunk = createAsyncThunk(
  "patientPersonal/put",
  async (payload: IMedicalConditionsPayload) => {
    try {
      // const response = await updateMedicalConditons(id:id, payload:payload);
      const userResponse = await getPatientDetails(1); //TODO: Need to chance
      return userResponse.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const commonSlice = createSlice({
  name: SLICE_NAME.commonSlice,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPatinetDetailsThunk.fulfilled, (state, { payload }) => {
        console.log(state.name);
        console.log(payload);
      })
      .addCase(getAllPatientsThunk.fulfilled, (state, { payload }) => {
        state.allPatients = payload;
      });
  },
});

export const selectPatinet = (state: RootState) => state.patient;
export default commonSlice.reducer;
