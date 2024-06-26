import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
import {
  addInsurance,
  addVisitHistory,
  deleteInsurance,
  deleteVisitHistoryById,
  getPatientDetails,
  getPatientInsurance,
  getPatientMedicalConditions,
  getPatientMedication,
  getVisitHistoryByPatientId,
  updateInsuranceById,
  updateMedicalConditons,
  updateMedicationByPatientId,
  updatePatientProfile,
  updateVisitHistory,
} from "../../services/patient.service";
import { IInsurance, IUser } from "../../interfaces/User";
import {
  IPatient,
  IUpdateAllergiesAndConditionsPayload,
  IUpdatePatientPayload,
} from "../../interfaces/patient";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import {
  INewInsurancePayload,
  IUpdateInsurancePayload,
  deleteInsurancePayload,
} from "../../interfaces/insurance";
import {
  IMedicaine,
  IMedicationDetails,
  IUpdateMedicationPayload,
} from "../../interfaces/medication";
import {
  ICreateVisitHistoryPayload,
  IDeleteVisitHistoryPayload,
  IUpdateVisitHistoryPayload,
  IVisitHistory,
} from "../../interfaces/visitHistory";
interface IPatientResponse {
  name: string;
  selectedPatient: IPatient;
  allPatients: IUser[];
}
const initialState: IPatientResponse = {
  name: "",
  selectedPatient: {} as IPatient,
  allPatients: [] as IUser[],
};

function transformCoverageData(data: any): IInsurance[] {
  return data.coverage.entry.map((entry: any) => {
    const resource = entry.resource;
    return {
      id: resource.id || "",
      insuranceType: resource.order || "",
      insuranceNumber: resource.subscriberId || "",
      policyNumber: resource.subscriberId || "",
      groupNumber: resource.class[0].value || "",
      insuranceCompany: resource.payor[0].display || "",
    };
  });
}

function transformVisitHistory(data: any) {
  if (data.total) {
    return data.entry.map((entity: any) => {
      const resource = entity.resource;
      const visitHistory: IVisitHistory = {
        visitReason: resource?.reasonCode[0]?.text || "",
        primaryCareTeam: resource.participant[0].individual.display || "",
        visitLocation: resource.location[0].location.display || "",
        admissionDate: resource.period.start || "",
        dischargeDate: resource.period.end || "",
        followUpCare: "",
        hospitalContact: "",
        id: resource.id,
        patientNotes: "",
        treatmentSummary: "",
      };
      return visitHistory;
    });
  } else return [] as IVisitHistory[];
}

function transformMedication(data: any) {
  let medicationResponse: IMedicationDetails = {} as IMedicationDetails;
  if (data?.medication_request?.total) {
    const currentMedication = data.medication_request.entry.map(
      (entity: any) => {
        const resource = entity.resource;
        return resource.medicationCodeableConcept.coding.map(
          (medicine: any) => {
            return { ...medicine, id: resource.id };
          }
        );
      }
    );
    const filteredResponse = currentMedication.flatMap((item: IMedicaine) => {
      return item;
    });
    medicationResponse.currentTakingMedication = filteredResponse;
  }
  if (data?.medication_statement?.total) {
    const medicationTakenBefore = data.medication_statement.entry.map(
      (entity: any) => {
        const resource = entity.resource;
        return resource.medicationCodeableConcept.coding.map(
          (medicine: any) => {
            return { ...medicine, id: resource.id };
          }
        );
      }
    );
    const filteredResponse = medicationTakenBefore.flatMap(
      (item: IMedicaine) => {
        return item;
      }
    );
    medicationResponse.medicationTakenBefore = filteredResponse;
  }
  return medicationResponse;
}

export const getPatientDetailsThunk = createAsyncThunk(
  "patient/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const userResponse = await getPatientDetails(id);
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

export const updatePatientProfileThunk = createAsyncThunk(
  "patient/update",
  async (payload: IUpdatePatientPayload, { rejectWithValue }) => {
    try {
      const userResponse = await updatePatientProfile(payload);
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

// export const getAllPatientsThunk = createAsyncThunk(
//   "allPatients/get",
//   async (id: number) => {
//     try {
//       const userResponse = await getPatientDetails(id);
//       return userResponse.data;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );
export const getPatientMedicationThunk = createAsyncThunk(
  "medication/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPatientMedication(id);
      const _response = transformMedication(response.data);
      return _response;
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

export const updateMedicationByPatientIdThunk = createAsyncThunk(
  "medication/update",
  async (payload: IUpdateMedicationPayload, { rejectWithValue }) => {
    try {
      const response = await updateMedicationByPatientId(payload);
      return response.data;
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

export const getPatientInsuranceThunk = createAsyncThunk(
  "insurance/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPatientInsurance(id);
      const _response = await transformCoverageData(response.data);
      return _response;
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

export const addInsuranceThunk = createAsyncThunk(
  "insurance/put",
  async (payload: INewInsurancePayload, { rejectWithValue }) => {
    try {
      const userResponse = await addInsurance(payload);
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

export const deleteInsuranceByIdThunk = createAsyncThunk(
  "insurance/delete",
  async (payload: deleteInsurancePayload, { rejectWithValue }) => {
    try {
      const userResponse = await deleteInsurance(payload);
      return { patinet: userResponse.data, insurance: payload.insuranceId };
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

export const updateInsuranceByIdThunk = createAsyncThunk(
  "insurance/put",
  async (payload: IUpdateInsurancePayload, { rejectWithValue }) => {
    try {
      const updateResponse = await updateInsuranceById(payload);
      return updateResponse;
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

export const getPatientMedicalConditionsThunk = createAsyncThunk(
  "condition_allergies/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPatientMedicalConditions(id);
      return response.data;
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

export const updateMedicalConditonsThunk = createAsyncThunk(
  "patientPersonal/put",
  async (
    payload: IUpdateAllergiesAndConditionsPayload,
    { rejectWithValue }
  ) => {
    try {
      const userResponse = await updateMedicalConditons(payload);
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

export const createVistiHistoryThunk = createAsyncThunk(
  "visitHistory/create",
  async (payload: ICreateVisitHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await addVisitHistory(payload);
      return response.data;
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

export const getVisitHistoryByPatientIdThunk = createAsyncThunk(
  "visitHistory/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getVisitHistoryByPatientId(id);
      const _response = transformVisitHistory(response.data);
      return _response;
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

export const updateVisitHistoryByIdThunk = createAsyncThunk(
  "visitHistory/put",
  async (payload: IUpdateVisitHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await updateVisitHistory(payload);
      return response;
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

export const deleteVisitHistoryByIdThunk = createAsyncThunk(
  "visitHistory/put",
  async (payload: IDeleteVisitHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await deleteVisitHistoryById(payload);
      return response;
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

const commonSlice = createSlice({
  name: SLICE_NAME.patinetSlice,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPatientDetailsThunk.fulfilled, (state, { payload }) => {
        state.selectedPatient.basicDetails = payload;
        state.name = payload.firstName;
      })
      .addCase(getPatientInsuranceThunk.fulfilled, (state, { payload }) => {
        state.selectedPatient.InsuranceDetails = [...payload];
      })
      .addCase(getPatientMedicationThunk.fulfilled, (state, { payload }) => {
        state.selectedPatient.medicationDetails = payload;
      })
      .addCase(
        getVisitHistoryByPatientIdThunk.fulfilled,
        (state, { payload }) => {
          state.selectedPatient.visitHistory = [...payload];
          console.log(payload);
        }
      );
    // .addCase(getPatientInsuranceThunk.rejected, (action) => {
    // });
  },
});

export const selectSelectedPatient = (state: RootState) =>
  state.patient.selectedPatient;
export const selectSelectPatientname = (state: RootState) => state.patient.name;
export default commonSlice.reducer;
