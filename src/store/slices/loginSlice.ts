import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ISetPasswordPayload, ISignupPayload } from "../../interfaces/User";
import { RootState } from "../store";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../interfaces/common";
import {
  changePassword,
  confirmPassword,
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

type loggedInUserSliceState = {
  loggedInUserData: {
    emailVerified: boolean | undefined;
    role: "patient" | "admin" | "other";
    error: string;
  };
};
const _role = localStorage.getItem("role");
const initialState: loggedInUserSliceState = {
  loggedInUserData: {
    emailVerified: sessionStorage.getItem("accessToken") ? true : false,
    role:
      _role === "patinet" ? "patient" : _role === "admin" ? "admin" : "other",
    error: "",
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

export const signupThunk = createAsyncThunk(
  "signup/post",
  async (payload: ISignupPayload, { rejectWithValue }) => {
    try {
      const signupResponse = await signup(payload);
      return signupResponse.data;
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

export const logoutThunk = createAsyncThunk(
  "logout/post",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();
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

export const changePasswordThunk = createAsyncThunk(
  "password/put",
  async (payload: IChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await changePassword(payload);
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

export const resetPasswordThunk = createAsyncThunk(
  "password/put",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resetPassword(email);
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

export const confirmPasswordThunk = createAsyncThunk(
  "password/put",
  async (payload: IConfirmPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await confirmPassword(payload);
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
        state.loggedInUserData = payload?.res;
        localStorage.setItem("role", payload.res.role);
        localStorageService.setAccessToken(payload?.res.access_token);
        localStorage.setItem("email", payload?.req?.username || "");
        localStorage.setItem(
          "refresh_token",
          payload?.res?.refresh_token || ""
        );
        localStorage.setItem("password", payload?.req.password || "");
        state.loggedInUserData.emailVerified = true;
        sessionStorage.setItem(
          "okr_info",
          JSON.stringify(payload?.res?.userInfo)
        );
      })
      .addCase(loginUserThunk.rejected, () => {
        localStorageService.logout;
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
          state.loggedInUserData.emailVerified = true;
          localStorage.setItem("accessToken", action.payload.access_token);
        }
      )
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loggedInUserData.emailVerified = false;
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
  return state.loggedInUser.loggedInUserData.role === "admin";
};
export default reducer;
