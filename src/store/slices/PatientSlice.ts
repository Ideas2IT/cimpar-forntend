import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { IInsurance, IInsuranceResponse, IUser } from "../../interfaces/User";
import { ErrorResponse } from "../../interfaces/common";
import { ImmunizationPagination } from "../../interfaces/immunization";
import {
  INewInsurancePayload,
  IUpdateInsurancePayload,
  deleteInsurancePayload,
} from "../../interfaces/insurance";
import {
  ICreateMedication,
  IMedicationDetails,
  IMedicine,
  IUpdateMedicationPayload,
} from "../../interfaces/medication";
import {
  AllergiesAndCondtions,
  ICreateMedicalCondtionPayload,
  IGetEncounterPaylaod,
  IPatient,
  IUpdateAllergiesAndConditionsPayload,
  IUpdatePatientPayload,
} from "../../interfaces/patient";
import {
  ICreateVisitHistoryPayload,
  IDeleteVisitHistoryPayload,
  IUpdateVisitHistoryPayload,
  IVisitHistory,
  IVisitHistoryData,
} from "../../interfaces/visitHistory";
import {
  addInsurance,
  addMedicationDetails,
  addVisitHistory,
  createMedicalConditions,
  deleteInsurance,
  deleteInsuranceFile,
  deleteVisitHistoryById,
  deleteVisitHistoryFile,
  getInsuranceById,
  getPatientDetails,
  getPatientInsurance,
  getPatientMedicalConditions,
  getPatientMedication,
  getVisitHistoryById,
  getVisitHistoryByPatientId,
  updateInsuranceById,
  updateMedicalConditons,
  updateMedicationByPatientId,
  updatePatientProfile,
  updateVisitHistory,
} from "../../services/patient.service";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";
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
      insuranceType: resource?.class[0]?.value || "",
      insuranceNumber: resource?.subscriberId || "",
      policyNumber: resource?.subscriberId || "",
      groupNumber: resource?.class[0]?.name || "",
      insuranceCompany: resource.payor[0].display || "",
    };
  });
}

function transformVisitHistory(data: any) {
  let visitHistoryData = {} as IVisitHistoryData;
  const pagination: ImmunizationPagination = {
    current_page: data?.current_page,
    page_size: data?.total_items,
    total_items: data?.total_items,
    total_pages: data?.total_pages,
  };
  if (data?.data?.entry?.length) {
    const visitHistory: IVisitHistory[] =
      data?.data?.entry?.map((entity: any) => {
        const resource = entity?.resource;
        const _visitHistory: IVisitHistory = {
          visitReason: resource?.reasonCode?.[0]?.text ?? "",
          primaryCareTeam:
            resource?.participant?.[0]?.individual?.display ?? "",
          visitLocation: resource?.serviceProvider?.display || "",
          admissionDate: resource?.period?.start || "",
          dischargeDate: resource?.period?.end || "",
          followUpCare: resource?.type?.[0]?.coding?.[0]?.display ?? "",
          hospitalContact: resource?.location?.[0]?.location?.display ?? "",
          id: resource?.id,
          patientNotes: resource?.serviceType?.coding?.[0]?.display ?? "",
          treatmentSummary:
            resource?.hospitalization?.specialCourtesy?.[0]?.text ?? "",
          files: resource?.file_url,
        };
        return _visitHistory;
      }) ?? [];
    visitHistoryData.data = [...visitHistory];
    visitHistoryData.pagination = pagination;
    return visitHistoryData;
  } else return {} as IVisitHistoryData;
}

const transformSingleVisitHistory = (data: any) => {
  if (!data) {
    return;
  }
  const visitHistory: IVisitHistory = {
    visitReason: data?.reasonCode[0]?.text || "",
    primaryCareTeam: data?.participant[0].individual.display || "",
    visitLocation: data?.serviceProvider?.display || "",
    admissionDate: data?.period.start || "",
    dischargeDate: data?.period.end || "",
    followUpCare: data?.type?.[0]?.coding?.[0]?.display || "",
    hospitalContact: data?.location[0].location.display || null,
    id: data?.id,
    patientNotes: data?.serviceType?.coding[0]?.display || "",
    treatmentSummary: data?.hospitalization?.specialCourtesy[0]?.text || "",
    files: data?.file_url ?? [],
  };
  return visitHistory;
};

function transformMedication(data: any) {
  let medicationResponse: IMedicationDetails = {} as IMedicationDetails;
  if (data?.current_medication?.total) {
    medicationResponse.statementId =
      data?.current_medication?.entry[0]?.resource?.id || "";
    const currentMedication =
      data?.current_medication?.entry[0]?.resource?.medicationCodeableConcept?.coding?.map(
        (entity: IMedicine) => {
          return entity;
        }
      );
    medicationResponse.currentTakingMedication = currentMedication;
  }

  if (data?.other_medication?.total) {
    medicationResponse.requestId =
      data?.other_medication?.entry[0]?.resource?.id || "";
    const medicationTakenBefore =
      data.other_medication?.entry[0]?.resource?.medicationCodeableConcept?.coding?.map(
        (entity: IMedicine) => {
          return entity;
        }
      );
    medicationResponse.medicationTakenBefore = medicationTakenBefore;
  }
  return medicationResponse;
}

function transformMedicalConditions(data: any): AllergiesAndCondtions {
  if (!data?.length) {
    return {} as AllergiesAndCondtions;
  }

  const conditionsAndAllergies: AllergiesAndCondtions =
    {} as AllergiesAndCondtions;
  conditionsAndAllergies.hasMedicalConditionsOrAllergies = false;

  if (data[0]?.total) {
    conditionsAndAllergies.hasMedicalConditionsOrAllergies = true;

    data[0]?.entry?.forEach((entity: any) => {
      const resource = entity?.resource;
      if (resource?.note?.length) {
        const noteText = resource.note[0].text;
        switch (noteText) {
          case "Family":
            const fmc = resource?.code.coding.map((item: any) => {
              const temp: IMedicine = {
                code: item.code || "",
                display: item.display || "",
                system: item.system || "",
              };
              return temp;
            });
            conditionsAndAllergies.familyMedicalConditions = [...fmc];
            conditionsAndAllergies.family_condition_id = resource?.id || "";
            break;
          case "Current":
            const cmc = resource?.code.coding.map((item: any) => {
              const temp: IMedicine = {
                code: item.code || "",
                display: item.display || "",
                system: item.system || "",
              };
              return temp;
            });
            conditionsAndAllergies.medicalConditions = [...cmc];
            conditionsAndAllergies.current_condition_id = resource?.id || "";
            break;
          case "Other":
            const omc: IMedicine[] = resource?.code.coding.map((item: any) => {
              const temp: IMedicine = {
                code: item.code || "",
                display: item.display || "",
                system: item.system || "",
              };
              return temp;
            });
            conditionsAndAllergies.otherMedicalConditions = [...omc];
            conditionsAndAllergies.additional_condition_id = resource?.id || "";
            break;
        }
      }
    });
  }

  if (data[1]?.total) {
    conditionsAndAllergies.hasMedicalConditionsOrAllergies = true;
    data[1].entry.forEach((entity: any) => {
      const resource = entity.resource;
      if (resource?.note?.length) {
        const noteText = resource.note[0].text;
        switch (noteText?.toLowerCase()) {
          case "current":
            const allergies: IMedicine[] = resource?.code?.coding?.map(
              (item: any) => {
                const temp: IMedicine = {
                  code: item.code || "",
                  display: item.display || "",
                  system: item.system || "",
                };
                return temp;
              }
            );
            conditionsAndAllergies.allergies = [...allergies];
            conditionsAndAllergies.current_allergy_id = resource?.id || "";
            break;
          case "other":
            const otherAllergies: IMedicine[] = resource?.code.coding.map(
              (item: any) => {
                const temp: IMedicine = {
                  code: item.code || "",
                  display: item.display || "",
                  system: item.system || "",
                };
                return temp;
              }
            );
            conditionsAndAllergies.otherAllergies = [...otherAllergies];
            conditionsAndAllergies.additional_allergy_id = resource?.id || "";
            break;
        }
      }
    });
  }
  return conditionsAndAllergies;
}

const transformSingleInsurance = (data: any) => {
  if (!data) {
    return;
  }
  const insurance: IInsuranceResponse = {
    id: data?.id || "",
    insuranceType: data?.class[0]?.value || "",
    insuranceNumber: data?.subscriberId || "",
    policyNumber: data?.subscriberId || "",
    groupNumber: data?.class[0]?.name || "",
    insuranceCompany: data?.payor[0]?.display || "",
    insuranceCard: data?.file_url || "",
  };
  return insurance;
};
export const getPatientDetailsThunk = createAsyncThunk(
  "patient/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const userResponse = await getPatientDetails(id);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load Patient details";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        let errorMessage = "";
        if (error?.response?.data?.error.toLowerCase() === "validation error") {
          errorMessage =
            error?.response?.data?.details?.[0]?.message ||
            "Failed to update patient profile";
        } else {
          errorMessage =
            error?.response?.data?.error || "Failed to update patient profile";
        }

        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getPatientMedicationThunk = createAsyncThunk(
  "medication/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPatientMedication(id);
      const _response = transformMedication(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load medication details";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update medication details";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const deleteInsuranceFileThunk = createAsyncThunk(
  "insurance/file/delete",
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await deleteInsuranceFile(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to delete inusrance document";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const deleteVisitHistoryFileThunk = createAsyncThunk(
  "visitHistory/file/delete",
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await deleteVisitHistoryFile(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error ||
          "Failed to delete visit history document";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const addMedicationDetailsThunk = createAsyncThunk(
  "medication/post",
  async (payload: ICreateMedication, { rejectWithValue }) => {
    try {
      const response = await addMedicationDetails(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to add medication details";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load insurance details";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const addInsuranceThunk = createAsyncThunk(
  "insurance/post",
  async (payload: INewInsurancePayload, { rejectWithValue }) => {
    try {
      const userResponse = await addInsurance(payload);
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error)) {
        let errorMessage = "";
        if (error?.response?.data?.error.toLowerCase() === "validation error") {
          errorMessage =
            error?.response?.data?.details?.[0]?.message ||
            "Failed to add insurance details";
        } else {
          errorMessage =
            error?.response?.data?.error || "Failed to add insurance details";
        }

        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error ||
          "Failed to delete insurance: Please try again";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const updateInsuranceByIdThunk = createAsyncThunk(
  "insurance/put",
  async (payload: IUpdateInsurancePayload, { rejectWithValue }) => {
    try {
      const response = await updateInsuranceById(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        let errorMessage = "";
        if (error?.response?.data?.error.toLowerCase() === "validation error") {
          errorMessage =
            error?.response?.data?.details?.[0]?.message ||
            "Failed to update insurance details";
        } else {
          errorMessage =
            error?.response?.data?.error ||
            "Failed to update insurance details";
        }

        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getInsuranceByIdThunk = createAsyncThunk(
  "insurance/get_by_id",
  async (payload: deleteInsurancePayload, { rejectWithValue }) => {
    try {
      const response = await getInsuranceById(payload);
      const _response = transformSingleInsurance(response.data.coverage);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load insurance details";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getPatientMedicalConditionsThunk = createAsyncThunk(
  "condition_allergies/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPatientMedicalConditions(id);
      const _response = transformMedicalConditions(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error ||
          "Failed to load medical conditions and allergies";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const createMedicalConditionsThunk = createAsyncThunk(
  "condition_allergies/post",
  async (paylaod: ICreateMedicalCondtionPayload, { rejectWithValue }) => {
    try {
      const response = await createMedicalConditions(paylaod);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to create medical conditions";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update medical conditions";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const createVistiHistoryThunk = createAsyncThunk(
  "visit_history/post",
  async (payload: ICreateVisitHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await addVisitHistory(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        let errorMessage = "";
        if (error?.response?.data?.error.toLowerCase() === "validation error") {
          errorMessage =
            error?.response?.data?.details?.[0]?.message ||
            "Failed to create visit history";
        } else {
          errorMessage =
            error?.response?.data?.error || "Failed to create visit history";
        }

        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getVisitHistoryByPatientIdThunk = createAsyncThunk(
  "visitHistory/get",
  async (payload: IGetEncounterPaylaod, { rejectWithValue }) => {
    try {
      const response = await getVisitHistoryByPatientId(payload);
      const _response = transformVisitHistory(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load visit history";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getVisitHistoryByIdThunk = createAsyncThunk(
  "visitHistory/get-by-id",
  async (payload: IDeleteVisitHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await getVisitHistoryById(payload);
      const _response = transformSingleVisitHistory(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load visit history";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
      if (isAxiosError(error)) {
        let errorMessage = "";
        if (error?.response?.data?.error.toLowerCase() === "validation error") {
          errorMessage =
            error?.response?.data?.details?.[0]?.message ||
            "Failed to update visit history";
        } else {
          errorMessage =
            error?.response?.data?.error || "Failed to update visit history";
        }

        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const deleteVisitHistoryByIdThunk = createAsyncThunk(
  "visitHistory/delete",
  async (payload: IDeleteVisitHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await deleteVisitHistoryById(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to delete visit history";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
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
        if (payload) {
          state.selectedPatient.InsuranceDetails = [...payload];
        } else {
          state.selectedPatient.InsuranceDetails = [];
        }
      })
      .addCase(getPatientInsuranceThunk.rejected, (state) => {
        state.selectedPatient.InsuranceDetails = [];
      })
      .addCase(getPatientMedicationThunk.fulfilled, (state, { payload }) => {
        if (payload) state.selectedPatient.medicationDetails = payload;
      })
      .addCase(getPatientMedicationThunk.rejected, (state) => {
        state.selectedPatient.medicationDetails = {} as IMedicationDetails;
      })
      .addCase(
        getVisitHistoryByPatientIdThunk.fulfilled,
        (state, { payload }) => {
          if (payload) {
            state.selectedPatient.visitHistory = payload;
          }
        }
      )
      .addCase(
        getPatientMedicalConditionsThunk.fulfilled,
        (state, { payload }) => {
          if (payload) {
            state.selectedPatient.medicalConditionsAndAllergies = payload;
          }
        }
      )
      .addCase(deleteVisitHistoryByIdThunk.fulfilled, (state, { payload }) => {
        if (payload?.encounter && payload?.deleted) {
          const visitHistories = state.selectedPatient.visitHistory.data.filter(
            (history) => history.id !== payload.encounter
          );
          state.selectedPatient.visitHistory.data = visitHistories;
        }
      });
  },
});

export const selectSelectedPatient = (state: RootState) =>
  state.patient.selectedPatient;
export const selectSelectPatientname = (state: RootState) => state.patient.name;
export const selectHasMedicalConditions = (state: RootState) =>
  state.patient.selectedPatient?.medicalConditionsAndAllergies
    ?.hasMedicalConditionsOrAllergies || false;
export default commonSlice.reducer;
