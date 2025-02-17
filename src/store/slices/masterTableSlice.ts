import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import {
  ErrorResponse,
  IAllTestspayload,
  IGetPatientServicesPayload,
  ILabTestService,
  ITimeSlotPayload,
  IToggleRecordStatusPayload,
  IUpdateMasterRecordPayload,
} from "../../interfaces/common";
import { IPagination } from "../../interfaces/immunization";
import {
  ICreateLocationPayload,
  IGetLocationPayload,
  ILocation,
  ILocationResponse,
  IToggleLocationStatusPayload,
} from "../../interfaces/location";
import {
  ICreateLabTest,
  IMasterUrl,
  IUpdatePricingPayload,
} from "../../interfaces/masterTable";
import { IMedicine } from "../../interfaces/medication";
import {
  addMasterRecord,
  createLocation,
  fetchAllServicesWithoutPagnation,
  fetchServiceCategories,
  fetchServiceRegions,
  getAllergiesByQuery,
  getAllTests,
  getBookingNames,
  getInputData,
  getLabTestsWithoutPagination,
  getLocationsWithoutPagination,
  getLocationsWithPagination,
  getMedicalConditionsByQuery,
  getMedicationByQuery,
  getTimeSlotsByBookingIdAndCategory,
  getTimeSlotsForHome,
  getUrlByCategory,
  toggleLocaitonStatus,
  toggleRecordStatus,
  updateLocation,
  updateMasterRecord,
  updatePricing,
  updateUrlById,
} from "../../services/masterTable.service";
import { ERROR_CODES } from "../../utils/AppConstants";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";

interface IMasterTableData {
  medications: IMedicine[];
  allergies: IMedicine[];
  medicalConditions: IMedicine[];
  serviceCategories: string[];
}

const initialState: IMasterTableData = {
  medications: [] as IMedicine[],
  allergies: [] as IMedicine[],
  medicalConditions: [] as IMedicine[],
  serviceCategories: [] as string[],
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

const transformLocations = (data: any) => {
  let locationData: ILocationResponse = {} as ILocationResponse;
  if (data?.data?.length) {
    const pageData: IPagination = {
      page_size: data?.pagination?.page_size || 0,
      total_items: data?.pagination?.total_items || 0,
      total_pages: data?.pagination?.total_pages || 0,
      current_page: data?.pagination?.current_page || 0,
    };
    locationData.pagination = pageData;
    const locations = data?.data?.map((location: any) => {
      const resource = location?.resource;
      return {
        id: resource?.id,
        center_name: resource?.name || "",
        address_line1: resource?.address?.line?.[0] ?? "",
        address_line2: resource?.address?.line?.[1] ?? "",
        city: resource?.address?.city || "",
        state: resource?.address?.state || "",
        zip_code: resource?.address?.postalCode || "",
        country: resource?.address?.country || "",
        contact_person: resource?.alias?.[0] ?? "",
        contact_email: resource?.telecom?.[1]?.value || "",
        contact_phone: resource?.telecom?.[0]?.value || "",
        status: resource?.status || "",
        opening_time: resource?.hoursOfOperation?.[0]?.openingTime || "",
        closing_time: resource?.hoursOfOperation?.[0]?.closingTime || "",
        working_days: resource?.hoursOfOperation?.[0]?.daysOfWeek || [],
        holiday: resource?.description || "",
        azure_booking_id: resource?.availabilityExceptions || "",
      };
    });
    locationData.data = locations;
  }
  return locationData;
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

export const getLabTestsForPatientThunk = createAsyncThunk(
  "services/get",
  async (payload: IGetPatientServicesPayload, { rejectWithValue }) => {
    try {
      const response = await fetchAllServicesWithoutPagnation(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load Services";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getServiceCategoriesThunk = createAsyncThunk(
  "service-categories/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchServiceCategories();
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load Service Categories";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getLabtestsWithoutPaginationThunk = createAsyncThunk(
  "tests/get_all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLabTestsWithoutPagination();
      return response.data as ILabTestService;
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
  "labtest/add",
  async (payload: ICreateLabTest, { rejectWithValue }) => {
    try {
      const response = await addMasterRecord(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.detail ||
          "Failed to add record to master table";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const createLocationThunk = createAsyncThunk(
  "location/create",
  async (payload: ICreateLocationPayload, { rejectWithValue }) => {
    try {
      const response = await createLocation(payload);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.detail ||
          "Failed to add record to master table";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getLocationsThunk = createAsyncThunk(
  "location/get-all",
  async (payload: IGetLocationPayload, { rejectWithValue }) => {
    try {
      const response = await getLocationsWithPagination(payload);
      const locations = transformLocations(response?.data);
      return locations;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to fetch locations";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getLocationsWithoutPaginationThunk = createAsyncThunk(
  "location/get-all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLocationsWithoutPagination();
      const locations = transformLocations(response?.data);
      return locations;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to fetch locations";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getServiceRegionsThunk = createAsyncThunk(
  "regions/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchServiceRegions();
      return response?.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to get Service Regions";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const toggleLocationStatusThunk = createAsyncThunk(
  "location/toggel_status",
  async (payload: IToggleLocationStatusPayload, { rejectWithValue }) => {
    try {
      const response = await toggleLocaitonStatus(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update location status";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const updateLocationThunk = createAsyncThunk(
  "location/put",
  async (payload: ILocation, { rejectWithValue }) => {
    try {
      const response = await updateLocation(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        let errorMessage = "";
        if (
          error?.response?.data?.error?.toLowerCase() ===
          ERROR_CODES.VALIDATION_ERROR
        ) {
          errorMessage =
            error?.response?.data?.details?.[0]?.field +
            ":" +
            error?.response?.data?.details?.[0]?.message ||
            "Failed to Update Location";
        } else {
          errorMessage =
            error?.response?.data?.detail || "Failed to update Location";
        }
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: 'Something went wrong',
          response: 0,
        } as ErrorResponse);
      }
    }
  }
);

export const updatePricingThunk = createAsyncThunk(
  "pricing/update",
  async (payload: IUpdatePricingPayload, { rejectWithValue }) => {
    try {
      const response = await updatePricing(payload);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update service pricing";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);
export const getUrlByCategoryThunk = createAsyncThunk(
  "url/get",
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await getUrlByCategory(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to load Url";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const updateUrlByIdThunk = createAsyncThunk(
  "url/update",
  async (payload: IMasterUrl, { rejectWithValue }) => {
    try {
      const response = await updateUrlById(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update URL";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getBookingNamesThunk = createAsyncThunk(
  "",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBookingNames();
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to update URL";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getTimeSlotsByBookingIdAndCategoryThunk = createAsyncThunk(
  "timeslots/get-by-id-and-category",
  async (payload: ITimeSlotPayload, { rejectWithValue }) => {
    try {
      const response = await getTimeSlotsByBookingIdAndCategory(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to fetch booking slots";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const getTimeSlotsForHomeThunk = createAsyncThunk(
  "timeslots/get-by-service",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTimeSlotsForHome();
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error || "Failed to fetch booking slots";
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
      .addCase(getServiceCategoriesThunk.fulfilled, (state, { payload }) => {
        if (payload?.data?.length) {
          state.serviceCategories = [...payload.data];
        } else {
          state.serviceCategories = [];
        }
      })
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
export const selectServiceCategories = (state: RootState) =>
  state.masterTable.serviceCategories;

export default reducer;
