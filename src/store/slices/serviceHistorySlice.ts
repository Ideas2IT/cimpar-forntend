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
  IPagination,
  IServiceHistory,
  IServiceHistoryData,
  IServiceHistoryPayload,
  ITestResultPayload,
} from "../../interfaces/immunization";
import { IMedicine } from "../../interfaces/medication";
import { appointmentStatus } from "../../services/commonFunctions";
import {
  getImmunizationById,
  getImmunizationByPatientId,
  getLabTestById,
  getLabTests,
  getServiceHistory,
} from "../../services/serviceHistory.service";
import {
  APPOINTMENT,
  DATE_FORMAT,
  IMMUNIZATION,
  OBSERVATION,
  RECORD_TYPE,
  RESULT_STATUS,
  SERVICE_CATEGORY,
  SERVICE_TABS,
} from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { RootState } from "../store";
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
    const pageData: IPagination = {
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
          ? dateFormatter(resource?.expirationDate, DATE_FORMAT.DD_MMM_YYYY)
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
    status:
      immunization?.statusReason?.coding?.[0]?.display ||
      immunization?.status ||
      "",
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
    paymentStatus: "-",
    results: [],
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
    // fileUrl: resource?.file_url ? resource?.file_url : "",
    paymentStatus: "-",
    results: [],
  };
  return service;
};

const getResultsFromAppointment = (data: any) => {
  if (data?.length) {
    const allResults = data.map((item: any) => {
      return {
        testName: item?.code?.coding?.[0]?.display ?? "",
        dateOfTest: item?.effective?.dateTime
          ? dateFormatter(item?.effective?.dateTime, DATE_FORMAT.DD_MMM_YYYY)
          : "",
        orderId: item?.id ?? "",
        testedAt: item?.performer?.[0]?.display ?? "",
        specimenUsed: item?.category?.[0]?.coding?.[0]?.display ?? "",

        collectedDateTime: item?.specimen?.collection?.collectedDateTime
          ? dateFormatter(
            item?.specimen?.collection?.collectedDateTime,
            DATE_FORMAT.DD_MMM_YYYY
          )
          : "",
        reportedDateTime:
          dateFormatter(item?.issued, DATE_FORMAT.DD_MMM_YYYY) ?? "",
        physicianName: item?.performer?.[0]?.display ?? "",
        contactInfo: "",
        result: item?.valueQuantity?.value?.toString() ?? "",
        range: item?.referenceRange?.[0]
          ? `${item?.referenceRange[0]?.low?.value ?? ""} - ${item?.referenceRange[0]?.high?.value ?? ""} ${item?.referenceRange[0]?.low?.unit ?? ""}`
          : "",
        unit: item?.valueQuantity?.unit ?? "",
        flag: Array.isArray(item?.interpretation)
          ? item?.interpretation?.[0]?.coding?.[0]?.display ?? ""
          : "",
        status: RESULT_STATUS.AVAILABLE,
        fileUrl: item?.file_url || "",
      } as ILabTest;
    });
    return allResults;
  }
  return [];
};
const appointmentToService = (data: any) => {
  const service: IServiceHistory = {
    category: data?.serviceCategory?.[0]?.coding?.[0]?.display || "-",
    serviceFor: getStringValuesFromObjectArray(data?.serviceType?.[0]?.coding),
    dateOfService: data?.end || "",
    id: data?.id || "",
    status: appointmentStatus(data?.end || "", data?.result?.length),
    type: APPOINTMENT,
    paymentStatus: data?.payment_status || "-",
    results: data?.result?.length ? getResultsFromAppointment(data.result) : [],
  };
  return service;
};

const transformServiceHistory = (data: any) => {
  let services = {} as IServiceHistoryData;
  let pagination: IPagination = {
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
    testName:
      getStringValuesFromObjectArray(data?.serviceType?.[0].coding) || "",
    category: "Lab Tests",
    status: appointmentStatus(data?.end || "", data?.result?.length),
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
    paymentStatus: data?.payment_status || "",
    results: data?.result?.length ? getResultsFromAppointment(data.result) : [],
    type: data?.record_type || "",
  } as ILabTest;
};

function transformTests(data: any) {
  const labtestData: ILabTestData = {} as ILabTestData;
  if (data?.data?.length) {
    const pagination: IPagination = {
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
            ? dateFormatter(
              resource?.effective?.dateTime,
              DATE_FORMAT.DD_MMM_YYYY
            )
            : "",
          orderId: resource?.id ?? "",
          testedAt: resource?.performer?.[0]?.display ?? "",
          specimenUsed: resource?.category?.[0]?.coding?.[0]?.display ?? "",

          collectedDateTime: resource?.specimen?.collection?.collectedDateTime
            ? dateFormatter(
              resource?.specimen?.collection?.collectedDateTime,
              DATE_FORMAT.DD_MMM_YYYY
            )
            : "",
          reportedDateTime:
            dateFormatter(resource?.issued, DATE_FORMAT.DD_MMM_YYYY) ?? "",
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
          fileUrl: resource?.file_url || "",
          results: resource?.result ?? [],
          type: resource?.record_type ?? "",
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
    category:
      data?.serviceCategory?.[0]?.coding?.[0]?.display ||
      data?.focus?.[0]?.type ||
      data?.focus?.[1]?.type ||
      "",
    testName: data?.code?.coding?.[0]?.display ?? "",
    dateOfTest:
      (data?.effectiveDateTime &&
        dateFormatter(data?.effectiveDateTime, DATE_FORMAT.DD_MMM_YYYY)) ??
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
    paymentStatus: data?.payment_status || "",
    results: [],
    type: data?.record_type ?? "",
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
      switch (payload?.selectedTab?.toLowerCase()) {
        case SERVICE_TABS.SERVICE_HISTORY: {
          const _response = transformServiceHistory(response.data);
          return { selectedTab: payload.selectedTab, data: _response };
        }
        case SERVICE_TABS.CLINICAL_LABORATORY:
        case SERVICE_TABS.IMAGING:
        case SERVICE_TABS.HOME_CARE: {
          const _response = transformTests(response.data);
          return { selectedTab: payload.selectedTab, data: _response };
        }
        case SERVICE_TABS.IMMUNIZATION: {
          const _response = transformImmunization(response.data);
          return { selectedTab: payload.selectedTab, data: _response };
        }
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
      const _response = transformTests(response.data);
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
          payload.selectedTab?.toLowerCase() === SERVICE_TABS.SERVICE_HISTORY
        ) {
          if (payload?.data) {
            const serviceHistoryData =
              payload?.data?.data?.filter(isIServiceHistory);
            state.serviceHistory.data = serviceHistoryData;
            state.serviceHistory.pagination = payload?.data?.pagination;
          } else {
            state.serviceHistory = {} as IServiceHistoryData;
          }
        } else if (
          payload &&
          payload.selectedTab?.toLowerCase() === SERVICE_TABS.IMMUNIZATION
        ) {
          if (payload?.data?.data) {
            const immunizations = payload?.data?.data?.filter(isIImmunization);
            state.immunizations.data = immunizations;
          } else {
            state.immunizations = {} as ImmunizationData;
          }
        } else if (
          payload &&
          (payload.selectedTab?.toLowerCase() ===
            SERVICE_TABS.CLINICAL_LABORATORY ||
            payload.selectedTab?.toLowerCase() === SERVICE_TABS.IMAGING ||
            payload.selectedTab?.toLowerCase() === SERVICE_TABS.HOME_CARE)
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
          state.labTests.data = [...(payload?.data || [])];
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
