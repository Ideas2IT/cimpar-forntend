import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ISetPasswordPayload, ISignupPayload } from "../../interfaces/User";
import { RootState } from "../store";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import {
  changePassword,
  confirmPassword,
  getServiceTitle,
  login,
  logout,
  resetPassword,
  rotateToken,
  setPassword,
  signup,
} from "../../services/login.service";
import localStorageService from "../../services/localStorageService";
import {
  IChangePasswordPayload,
  IConfirmPasswordPayload,
  ILoginPayload,
  IRotateTokenPayload,
} from "../../interfaces/UserLogin";
import { REFRESH_TOKEN, ROLE } from "../../utils/AppConstants";

type loggedInUserSliceState = {
  loggedInUserData: {
    emailVerified: boolean | undefined;
    role: "admin" | "patient" | "other";
    error: string;
    isAdmin: boolean;
  };
  serviceTitle: string;
};
const _role = localStorage.getItem("role");
const initialState: loggedInUserSliceState = {
  loggedInUserData: {
    emailVerified: sessionStorage.getItem("accessToken") ? true : false,
    role:
      _role === "patient" ? "patient" : _role === "admin" ? "admin" : "other",
    error: "",
    isAdmin: false,
  },
  serviceTitle: "",
};

export const loginUserThunk = createAsyncThunk(
  "login/post",
  async (payload: ILoginPayload, { rejectWithValue }) => {
    try {
      const loginResponse = await login(payload);
      return { req: payload, res: loginResponse.data };
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

export const signupThunk = createAsyncThunk(
  "signup/post",
  async (payload: ISignupPayload, { rejectWithValue }) => {
    try {
      const signupResponse = await signup(payload);
      return signupResponse.data;
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

export const rotateTokenThunk = createAsyncThunk(
  "rotateToken/post",
  async (payload: IRotateTokenPayload) => {
    const response = await rotateToken(payload);
    return response.data;
  }
);

export const setPasswordThunk = createAsyncThunk(
  "setPassword/post",
  async (payload: ISetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await setPassword(payload);
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

export const logoutThunk = createAsyncThunk(
  "logout/post",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();
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

export const changePasswordThunk = createAsyncThunk(
  "password/put",
  async (payload: IChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await changePassword(payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.error ||
          "You password has not been updated successfully";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "password/put",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resetPassword(email);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.details || "Unknown Error";
        return rejectWithValue({
          message: errorMessage,
          response: error?.message,
        } as ErrorResponse);
      }
    }
  }
);

export const confirmPasswordThunk = createAsyncThunk(
  "password/put",
  async (payload: IConfirmPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await confirmPassword(payload);
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

export const getServicesTitleThunk = createAsyncThunk(
  "services_title/get",
  async () => {
    const response = await getServiceTitle();
    return response.data;
  }
);

const loggedInUserSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    signOut: (state) => {
      state.loggedInUserData.emailVerified = false;
      localStorageService.logout();
    },
    setAuthState: (state, action) => {
      state.loggedInUserData.emailVerified = action.payload.isAuthenticated;
    },
    setRole: (state, action) => {
      state.loggedInUserData.role = action.payload.role;
      if (action.payload.role === ROLE.ADMIN) {
        state.loggedInUserData.isAdmin = true;
      } else {
        state.loggedInUserData.isAdmin = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        if (payload) {
          localStorageService.logout();
          state.loggedInUserData = payload?.res;
          localStorage.setItem("role", payload?.res?.role || "");
          localStorageService.setAccessToken(payload?.res.access_token);
          localStorage.setItem(
            REFRESH_TOKEN,
            payload?.res?.refresh_token || ""
          );
          localStorage.setItem("email", payload?.req?.username || "");
          state.loggedInUserData.emailVerified = true;
          state.loggedInUserData.isAdmin =
            payload?.res?.role === "admin" ? true : false;
        }
      })
      .addCase(loginUserThunk.rejected, () => {
        localStorageService.logout();
      })
      .addCase(
        rotateTokenThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            access_token: string;
            refreshToken: string;
          }>
        ) => {
          if (action.payload.access_token) {
            state.loggedInUserData.emailVerified = true;
          }
        }
      )
      .addCase(logoutThunk.fulfilled, (state) => {
        localStorageService.logout();
        state.loggedInUserData.emailVerified = false;
      })
      .addCase(getServicesTitleThunk.fulfilled, (state, { payload }) => {
        if (payload) {
          state.serviceTitle = payload.message;
        } else {
          state.serviceTitle = "Our Services";
        }
      })
      .addCase(rotateTokenThunk.rejected, (state) => {
        localStorageService.logout();
        state.loggedInUserData.emailVerified = false;
        state.loggedInUserData.isAdmin = false;
      });
  },
});

const { reducer } = loggedInUserSlice;

export const { signOut, setAuthState, setRole } = loggedInUserSlice.actions;
export const selectIsEmailVerified = (state: RootState) =>
  state.loggedInUser.loggedInUserData.emailVerified;
export const selectRole = (state: RootState) =>
  state.loggedInUser.loggedInUserData.role;
export const selectIsAdmin = (state: RootState) => {
  return state.loggedInUser.loggedInUserData.isAdmin;
};
export const selectServiceTitle = (state: RootState) => {
  return state.loggedInUser.serviceTitle;
};
export default reducer;
