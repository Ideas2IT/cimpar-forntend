import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILoginPayload, IRole} from "../../interfaces/User";
import { RootState } from "../store";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import { login } from "../../services/login.service";
import localStorageService from "../../services/localStorageService";

type loggedInUserSliceState = {
  loggedInUserData: {
    emailVerified: boolean | undefined;
    role: IRole;
    error:string;
    // userInfo: IUser;
  };
};

const initialState: loggedInUserSliceState = {
  loggedInUserData: {
    emailVerified: sessionStorage.getItem("accessToken") ? true : false,
    role: { id: 0, role_name: localStorage.getItem("role") || "" },
    error:'',
    // userInfo: sessionStorage.getItem("okr_info")
    //   ? JSON.parse(sessionStorage.getItem("okr_info") || "")
    //   : ({} as IUser),
  },
};

export const loginUserThunk = createAsyncThunk(
  "login/post",
  async (payload: ILoginPayload, { rejectWithValue }) => {
    try {
      const loginResponse = await login(payload);
      return { req: payload, res: loginResponse.data };
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response?.data?.message?.split(".")[0];
        return rejectWithValue({
          message: errorMessage,
          response: error.response.status,
        } as ErrorResponse);
      }
    }
  }
);

const loggedInUserSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    signOut: (state) => {
      state.loggedInUserData.emailVerified = false;
      localStorageService.clearTokens();
    },
    // updateLoggedInUserProfile: (state, { payload }) => {
    //   if (state.loggedInUserData.userInfo) {
    //     state.loggedInUserData.userInfo.firstName = payload.first_name || "";
    //     state.loggedInUserData.userInfo.lastName = payload.last_name || "";
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        console.log(payload)
        state.loggedInUserData = payload?.res;
        localStorage.setItem("role", "Admin");
        sessionStorage.setItem("accessToken", "Cimpar access token");
        localStorage.setItem("email", payload?.req?.username || "");
        localStorage.setItem("password", payload?.req.password || "");
        sessionStorage.setItem(
          "okr_info",
          JSON.stringify(payload?.res?.userInfo)
        );
      })
      .addCase(loginUserThunk.rejected, (state,action) => {
        console.log(action.payload)
        state.loggedInUserData.emailVerified = false;
        localStorageService.clearTokens;
      });
  },
});

const { reducer } = loggedInUserSlice;

export const { signOut } = loggedInUserSlice.actions;
export const selectIsEmailVerified = (state: RootState) =>
  state.loggedInUser.loggedInUserData.emailVerified;
export const selectRole = (state: RootState) =>
  state.loggedInUser.loggedInUserData.role;
export const isAdmin = (state: RootState) => {
  return state.loggedInUser.loggedInUserData.role.role_name === "ADMIN";
};
export default reducer;
