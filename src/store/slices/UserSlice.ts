import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME, THUNK_NAME } from "../../utils/sliceUtil";
import { getUserDetails } from "../../services/user.service";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import { IProfile } from "../../interfaces/User";

interface IProfileSlice {
  name: string;
  id: number;
  selectedProfile: IProfile;
}

const initialState: IProfileSlice = {
  name: "",
  id: 1,
  selectedProfile: {} as IProfile,
};

export const getUserProfileThunk = createAsyncThunk(
  THUNK_NAME.getUserProfile,
  async (_, { rejectWithValue }) => {
    try {
      const userResponse = await getUserDetails();
      return userResponse.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error.message,
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
    builder.addCase(getUserProfileThunk.fulfilled, (state, { payload }) => {
      state.name = payload.firstName;
      state.selectedProfile = payload;
    });
  },
});

const { reducer } = userSlice;
export const selectProfileName = (state: RootState) => state.user.name;
export const selectUserProfile = (state: RootState) =>
  state.user.selectedProfile;

export default reducer;
