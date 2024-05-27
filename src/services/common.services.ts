import { EnhancedStore } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";
import { hideSpinner, showSpinner } from "../store/slices/spinnerSlice";

let store: EnhancedStore;

export const injectStore = (_store: EnhancedStore) => {
  store = _store;
};

const http: AxiosInstance = axios.create({
  baseURL: "http://localhost:8888",
  headers: {
    "Content-type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    if (store) {
      store.dispatch(showSpinner());
    } else {
      console.log("store is not configured");
    }
    if (config.headers) {
      config.headers.Authorization = `Bearer sdfsdfsdf`;
    }
    //   const state = store.getState();
    //   const token = state.auth?.token;

    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }

    return config;
  },
  (error) => {
    store.dispatch(hideSpinner());
    console.log("reuest rejected");
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response);
    setTimeout(() => {
      store.dispatch(hideSpinner());
    }, 1000);
    // if (error.response.status === 401) {
    // clearLocalStorage();
    // window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

export default http;
