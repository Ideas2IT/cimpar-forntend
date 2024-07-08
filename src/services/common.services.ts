import { EnhancedStore } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";
import { hideSpinner, showSpinner } from "../store/slices/spinnerSlice";
import { CLIENT_ID, ERROR_CODES, REFRESH_TOKEN, RESPONSE } from "../utils/AppConstants";
import { rotateTokenThunk, signOut } from "../store/slices/loginSlice";
import { IRotateTokenPayload } from "../interfaces/UserLogin";
import { AppDispatch } from "../store/store";
import { backendUrl } from "../config";

let store: EnhancedStore;

export const injectStore = (_store: EnhancedStore) => {
  store = _store;
};

const http: AxiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-type": "application/json",
    accept: "application/json",
  },
});
let count = 0;
http.interceptors.request.use(
  (config) => {
    if (config.url?.includes("confirm")) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (
      config.url?.includes("insurance") ||
      config.url?.includes("encounter")
    ) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    if (store) {
      store.dispatch(showSpinner());
      count++;
    }
    if (config.headers) {
      if (config.url !== "/login" && config.url !== "/signup") {
        const token = localStorage.getItem("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => {
    store.dispatch(hideSpinner());
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    count--;
    count === 0 && store.dispatch(hideSpinner());
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    count--;
    count === 0 && store.dispatch(hideSpinner());
    if (
      error.response.status === ERROR_CODES.EXPIRED_TOKEN &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN) || "";
        const payload: IRotateTokenPayload = {
          client_id: CLIENT_ID,
          grant_type: REFRESH_TOKEN,
          refresh_token: refresh_token,
        };
        const result = await (store.dispatch as AppDispatch)(
          rotateTokenThunk(payload)
        );
        if (result.meta.requestStatus === RESPONSE.FULFILLED) {
          const newAccessToken = result.payload.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          return http(originalRequest);
        }
      } catch (e) {
        store.dispatch(signOut());
      }
    }
    return Promise.reject(error);
  }
);

export default http;
