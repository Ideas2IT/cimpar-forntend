import { EnhancedStore } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";
import { hideSpinner, showSpinner } from "../store/slices/spinnerSlice";
import { CLIENT_ID } from "../utils/AppConstants";
import { rotateTokenThunk, signOut } from "../store/slices/loginSlice";
import { IRotateTokenPayload } from "../interfaces/UserLogin";
import { AppDispatch } from "../store/store";

let store: EnhancedStore;

export const injectStore = (_store: EnhancedStore) => {
  store = _store;
};

const http: AxiosInstance = axios.create({
  baseURL: "http://48.217.33.30/api/",
  // baseURL: "http://92.168.22.115:8000/api",
  headers: {
    "Content-type": "application/json",
    accept: "application/json",
  },
});
let count = 0;
http.interceptors.request.use(
  (config) => {
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

    //   if (error.response.status === 401) {
    //     localStorageService.logout();
    //     window.location.href = PATH_NAME.HOME;
    //   }
    //   return Promise.reject(error);
    // }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem("refresh_token") || "";
        const payload: IRotateTokenPayload = {
          client_id: CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        };
        const result = await (store.dispatch as AppDispatch)(
          rotateTokenThunk(payload)
        );
        if (result.meta.requestStatus === "fulfilled") {
          const newAccessToken = result.payload.accessToken;
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
