import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
import { IImmunization } from "../../interfaces/immunization";
import { getImmunizationByPatientId } from "../../services/serviceHistory.service";
import { ErrorResponse } from "../../interfaces/common";
import { isAxiosError } from "axios";

interface IServiceHistorySlice {
  immunizations: IImmunization[];
}

const initialState: IServiceHistorySlice = {
  immunizations: [] as IImmunization[],
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

const serviceHistorySlice = createSlice({
  name: SLICE_NAME.immunizationSlice,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getImmunizationsByPatientIdThunk.fulfilled,
      (state, { payload }) => {
        state.immunizations = [...payload];
      }
    );
  },
});

const { reducer } = serviceHistorySlice;
export const selectImmunizations = (state: RootState) =>
  state.serviceHistory.immunizations;
// export const selectUserProfile = (state: RootState) =>
//   state.user.selectedProfile;

export default reducer;
