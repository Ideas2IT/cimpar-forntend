import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import {
  IGetImmunizationPaylaod,
  IGetTestByIdPayload,
  IImmunization,
  IImmunizationPayload,
  ILabTest,
  ILabTestData,
  ImmunizationData,
  ImmunizationPagination,
  IServiceHistory,
  IServiceHistoryData,
  IServiceHistoryPayload,
  ITestResultPayload,
} from "../../interfaces/immunization";
import {
  getImmunizationById,
  getImmunizationByPatientId,
  getLabTestById,
  getLabTests,
  getServiceHistory,
} from "../../services/serviceHistory.service";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";
import { appointmentStatus } from "../../services/commonFunctions";
import { dateFormatter } from "../../utils/Date";
import { IMedicine } from "../../interfaces/medication";
import {
  APPOINTMENT,
  IMMUNIZATION,
  OBSERVATION,
  RECORD_TYPE,
  RESULT_STATUS,
  SERVICE_CATEGORY,
} from "../../utils/AppConstants";
interface IServiceHistorySlice {
  immunizations: ImmunizationData;
  serviceHistory: IServiceHistoryData;
  labTests: ILabTestData;
}

const initialState: IServiceHistorySlice = {
  immunizations: {} as ImmunizationData,
  serviceHistory: {} as IServiceHistoryData,
  labTests: {} as ILabTestData,
};

function transformImmunization(data: any) {
  let immunizations = {} as ImmunizationData;
  if (data?.data?.length) {
    const pageData: ImmunizationPagination = {
      page_size: data?.pagination?.page_size || 0,
      total_items: data?.pagination?.total_items || 0,
      total_pages: data?.pagination?.total_pages || 0,
      current_page: data?.pagination?.current_page || 0,
    };
    const obj = data?.data.map((entity: any) => {
      const resource = entity.resource;
      return {
        id: resource?.id || "",
        vaccineName: resource?.vaccineCode?.coding?.[0]?.display ?? "",
        administrationDate: resource?.occurrence?.dateTime || "",
        doseNumber:
          resource?.protocolApplied?.[0]?.doseNumber?.positiveInt?.toString() ||
          "",
        administrator: resource?.performer?.[0]?.actor?.display ?? "",
        status: resource?.status,
        dosageForm:
          resource?.doseQuantity?.value + " " + resource?.doseQuantity?.code ||
          "",
        administeredCode: resource?.vaccineCode?.coding?.[0]?.code || "",
        lotNumber: resource?.lotNumber || "",
        route: resource?.route?.coding?.[0]?.display || "",
        site: resource?.site?.coding?.[0]?.display || "",
        manufacturerName: resource?.manufacturer?.display || "",
        expirationDate: resource?.expirationDate
          ? dateFormatter(resource?.expirationDate, "dd MMM, yyyy")
          : "",
      };
    });
    immunizations.data = obj;
    immunizations.pagination = pageData;
    return immunizations;
  } else {
    return {} as ImmunizationData;
  }
}

function transformSingleImmunization(data: any) {
  const immunization = data.immunizations;
  const selectedImmunization: IImmunization = {
    id: immunization?.id ?? "",
    vaccineName: immunization?.vaccineCode?.coding?.[0]?.display ?? "",
    administrationDate: immunization?.occurrenceDateTime ?? "",
    doseNumber:
      immunization?.protocolApplied?.[0]?.doseNumberPositiveInt?.toString() ??
      "",
    administrator: immunization?.performer?.[0]?.actor?.display ?? "",
    status: immunization?.statusReason?.coding?.[0]?.display ?? "",
    dosageForm: immunization?.doseQuantity
      ? `${immunization.doseQuantity.value ?? ""} ${immunization.doseQuantity.unit ?? ""}`
      : "",
    administeredCode: immunization?.vaccineCode?.coding?.[0]?.code ?? "",
    lotNumber: immunization?.lotNumber ?? "",
    route: immunization?.route?.coding?.[0]?.display ?? "",
    site: immunization?.site?.coding?.[0]?.display ?? "",
    manufacturerName: immunization?.manufacturer?.display ?? "",
    expirationDate: immunization?.expirationDate ?? "",
  };

  return selectedImmunization;

  return selectedImmunization;
}

export const getStringValuesFromObjectArray = (
  data: IMedicine[] | null | undefined
) => {
  if (!data) {
    return "";
  } else {
    const stringValues = data.map((obj: IMedicine) => {
      return obj.display;
    });
    return stringValues.join(", ");
  }
};

const immunizationToService = (resource: any) => {
  const service: IServiceHistory = {
    category: SERVICE_CATEGORY.IMMUNIZATION,
    dateOfService: resource?.occurrence?.dateTime || "",
    id: resource?.id || "",
    serviceFor: resource?.vaccineCode?.coding?.[0]?.display || "",
    status: resource?.status ?? "",
    type: IMMUNIZATION,
  };
  return service;
};

const labResultToService = (resource: any) => {
  const service: IServiceHistory = {
    category: SERVICE_CATEGORY.LAB_RESULT,
    dateOfService: resource?.effective?.dateTime || "",
    id: resource?.id || "",
    serviceFor: getStringValuesFromObjectArray(resource?.code?.coding) || "",
    status: RESULT_STATUS.AVAILABLE,
    type: SERVICE_CATEGORY.LAB_TEST,
    fileUrl: resource?.file_url ? resource?.file_url : "",
  };
  return service;
};
const appointmentToService = (data: any) => {
  const service: IServiceHistory = {
    category: SERVICE_CATEGORY.LAB_TEST,
    serviceFor: getStringValuesFromObjectArray(data?.serviceType?.[0]?.coding),
    dateOfService: data?.end || "",
    id: data?.id || "",
    status: appointmentStatus(data?.end || ""),
    type: APPOINTMENT,
  };
  return service;
};

const transformServiceHistory = (data: any) => {
  let services = {} as IServiceHistoryData;
  let pagination: ImmunizationPagination = {
    current_page: data?.pagination?.current_page || 0,
    page_size: data?.pagination?.page_size || 0,
    total_pages: data?.pagination?.total_pages || 0,
    total_items: data?.pagination?.total_items || 0,
  };
  services.pagination = pagination;
  if (data?.data?.length) {
    const results: IServiceHistory[] = data?.data?.map((service: any) => {
      const resource = service.resource;
      if (resource?.record_type?.toLowerCase() === IMMUNIZATION) {
        return immunizationToService(resource);
      } else if (resource?.record_type?.toLowerCase() === OBSERVATION) {
        return labResultToService(resource);
      } else {
        return appointmentToService(resource);
      }
    });
    services.data = results;
    return services;
  }
};

const appointmentToResult = (data: any) => {
  return {
    testName: getStringValuesFromObjectArray(data?.serviceType?.[0].coding),
    category: "Lab Tests",
    status: appointmentStatus(data?.end || ""),
    collectedDateTime: "",
    contactInfo: "",
    dateOfTest: dateFormatter(data?.end || ""),
    flag: "",
    orderId: data?.id ?? "",
    physicianName: "",
    range: "",
    reportedDateTime: data?.issues,
    result: "",
    specimenUsed: "",
    testedAt: "-",
    unit: "",
    fileUrl: "",
  } as ILabTest;
};

function transformLabTests(data: any) {
  const labtestData: ILabTestData = {} as ILabTestData;
  if (data?.data?.length) {
    const pagination: ImmunizationPagination = {
      current_page: data?.pagination?.current_page || 0,
      page_size: data?.pagination?.page_size || 0,
      total_items: data?.pagination?.total_items || 0,
      total_pages: data?.pagination?.total_pages || 0,
    };
    labtestData.pagination = pagination;
    const results: ILabTest[] = data?.data?.map((entity: any) => {
      const resource = entity?.resource;
      if (resource?.record_type?.toLowerCase() === RECORD_TYPE.OBSERVATION) {
        return {
          testName: resource?.code?.coding?.[0]?.display ?? "",
          dateOfTest: resource?.effective?.dateTime
            ? dateFormatter(resource?.effective?.dateTime, "dd MMM, yyyy")
            : "",
          orderId: resource?.id ?? "",
          testedAt: resource?.performer?.[0]?.display ?? "",
          specimenUsed: resource?.category?.[0]?.coding?.[0]?.display ?? "",

          collectedDateTime: resource?.specimen?.collection?.collectedDateTime
            ? dateFormatter(
                resource?.specimen?.collection?.collectedDateTime,
                "dd MMM, yyyy"
              )
            : "",
          reportedDateTime:
            dateFormatter(resource?.issued, "dd MMM, yyyy") ?? "",
          physicianName: resource?.performer?.[0]?.display ?? "",
          contactInfo: "",
          result: resource?.valueQuantity?.value?.toString() ?? "",
          range: resource?.referenceRange?.[0]
            ? `${resource?.referenceRange[0]?.low?.value ?? ""} - ${resource?.referenceRange[0]?.high?.value ?? ""} ${resource?.referenceRange[0]?.low?.unit ?? ""}`
            : "",
          unit: resource?.valueQuantity?.unit ?? "",
          flag: Array.isArray(resource?.interpretation)
            ? resource?.interpretation?.[0]?.coding?.[0]?.display ?? ""
            : "",
          status: RESULT_STATUS.AVAILABLE,
          fileUrl: resource?.file_url ? resource?.file_url : "",
        } as ILabTest;
      } else if (
        resource?.record_type?.toLowerCase() === RECORD_TYPE.APPOINTMENT
      ) {
        return appointmentToResult(resource);
      }
    });
    labtestData.data = results;
    return labtestData;
  }
}

function transformSingleTest(data: any): ILabTest {
  if (!data) {
    return {} as ILabTest;
  }
  const test: ILabTest = {
    testName: data?.code?.coding?.[0]?.display ?? "",
    dateOfTest:
      (data?.effectiveDateTime &&
        dateFormatter(data?.effectiveDateTime, "dd MMM,yyyy")) ??
      "",
    orderId: data?.id ?? "",
    testedAt: data?.performer?.[0]?.display ?? "",
    specimenUsed: data?.category?.[0]?.coding?.[0]?.display ?? "",
    collectedDateTime: data?.effective?.dateTime ?? "",
    reportedDateTime: data?.issued ?? "",
    physicianName: data?.performer?.[0]?.display ?? "",
    contactInfo: "",
    result: data?.valueQuantity?.value?.toString() ?? "",
    range: data?.referenceRange?.[0]?.text ?? "",
    unit: data?.valueQuantity?.unit ?? "",
    flag: data?.interpretation?.[0]?.coding?.[0]?.code ?? "N/A",
    status: RESULT_STATUS.AVAILABLE,
    fileUrl: data.file_url ? data?.file_url : "",
  };

  return test;
}

export const getImmunizationsByPatientIdThunk = createAsyncThunk(
  "immunization/getbyId",
  async (payload: IGetImmunizationPaylaod, { rejectWithValue }) => {
    try {
      const response = await getImmunizationByPatientId(payload);
      const _response = transformImmunization(response?.data);
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

export const getServiceHistoryThunk = createAsyncThunk(
  "serviceHistory/get",
  async (payload: IServiceHistoryPayload, { rejectWithValue }) => {
    try {
      const response = await getServiceHistory(payload);
      if (payload?.selectedTab?.toLowerCase() === "service history") {
        const _response = transformServiceHistory(response.data);
        return { selectedTab: payload.selectedTab, data: _response };
      } else if (payload?.selectedTab?.toLowerCase() === "lab results") {
        const _response = transformLabTests(response.data);
        return { selectedTab: payload.selectedTab, data: _response };
      } else {
        const _response = transformImmunization(response.data);
        return { selectedTab: payload.selectedTab, data: _response };
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      }
    }
  }
);

export const getLabTestsThunk = createAsyncThunk(
  "labResult/get",
  async (payload: ITestResultPayload, { rejectWithValue }) => {
    try {
      const response = await getLabTests(payload);
      const _response = transformLabTests(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      }
    }
  }
);

export const getImmunizationByIdThunk = createAsyncThunk<
  IImmunization,
  IImmunizationPayload,
  { rejectValue: ErrorResponse }
>(
  "immunization/get_by_id",
  async (payload: IImmunizationPayload, { rejectWithValue }) => {
    try {
      const response = await getImmunizationById(payload);
      const _response = transformSingleImmunization(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
          response: 0,
        });
      }
    }
  }
);

export const getLabTestByIdThunk = createAsyncThunk<
  ILabTest,
  IGetTestByIdPayload,
  { rejectValue: ErrorResponse }
>(
  "labResult/get_by_id",
  async (payload: IGetTestByIdPayload, { rejectWithValue }) => {
    try {
      const response = await getLabTestById(payload);
      const _response = transformSingleTest(response.data);
      return _response;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error.status,
        } as ErrorResponse);
      } else {
        return rejectWithValue({
          message: "Unknown Error",
          response: 0,
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
          if (payload) {
            state.immunizations.data = [...payload.data];
            state.immunizations.pagination = payload.pagination;
          } else {
            state.immunizations = {} as ImmunizationData;
          }
        }
      )
      .addCase(getServiceHistoryThunk.fulfilled, (state, { payload }) => {
        if (
          payload &&
          payload.selectedTab?.toLowerCase() === "service history"
        ) {
          if (payload && payload?.data) {
            const serviceHistoryData =
              payload?.data?.data?.filter(isIServiceHistory);
            state.serviceHistory.data = serviceHistoryData;
            state.serviceHistory.pagination = payload?.data?.pagination;
          } else {
            state.serviceHistory = {} as IServiceHistoryData;
          }
        } else if (
          payload &&
          payload.selectedTab?.toLowerCase() === "immunization"
        ) {
          if (payload?.data?.data) {
            const immunizations = payload?.data?.data?.filter(isIImmunization);
            state.immunizations.data = immunizations;
          } else {
            state.immunizations = {} as ImmunizationData;
          }
        } else if (
          payload &&
          payload.selectedTab?.toLowerCase() === "lab results"
        ) {
          if (payload?.data) {
            const labTests = payload?.data?.data?.filter(isLabTest);
            state.labTests.data = labTests;
            state.labTests.pagination = payload.data?.pagination;
          } else {
            state.labTests = {} as ILabTestData;
          }
        }
      })
      .addCase(getServiceHistoryThunk.rejected, (state) => {
        state.serviceHistory = {} as IServiceHistoryData;
      })
      .addCase(getLabTestsThunk.fulfilled, (state, { payload }) => {
        if (payload) {
          state.labTests.data = [...payload?.data];
          state.labTests.pagination = payload.pagination;
        } else {
          state.labTests = {} as ILabTestData;
        }
      });
  },
});
function isIServiceHistory(item: any): item is IServiceHistory {
  return (
    item &&
    typeof item === "object" &&
    "category" in item &&
    "serviceFor" in item &&
    "dateOfService" in item
  );
}
function isIImmunization(item: any): item is IImmunization {
  return (
    item &&
    typeof item === "object" &&
    "id" in item &&
    "vaccineName" in item &&
    "administrationDate" in item &&
    "doseNumber" in item &&
    "administrator" in item &&
    "status" in item &&
    "dosageForm" in item &&
    "administeredCode" in item &&
    "lotNumber" in item &&
    "route" in item &&
    "site" in item &&
    "manufacturerName" in item &&
    "expirationDate" in item
  );
}

function isLabTest(item: any): item is ILabTest {
  return (
    item &&
    typeof item === "object" &&
    "dateOfTest" in item &&
    "testName" in item &&
    "orderId" in item &&
    "testedAt" in item &&
    "specimenUsed" in item &&
    "collectedDateTime" in item &&
    "reportedDateTime" in item &&
    "physicianName" in item &&
    "contactInfo" in item &&
    "result" in item &&
    "range" in item &&
    "unit" in item &&
    "flag" in item &&
    "status" in item
  );
}

const { reducer } = serviceHistorySlice;
export const selectImmunizations = (state: RootState) =>
  state.serviceHistory.immunizations;
export const selectServiceHistory = (state: RootState) =>
  state.serviceHistory.serviceHistory;
export const selectLabTests = (state: RootState) =>
  state.serviceHistory.labTests;

export default reducer;