import axios from "axios";
import localStorageService from "./localStorageService";
// import router from './router/router'

const api = axios.create({
  baseURL: "https://api.base-url.com/api",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async error => {
    // Check if the error has a response object
    if (error.response) {
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        originalRequest.url === "http://127.0.0.1:3000/v1/auth/token"
      ) {
        // router.push('/login')
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorageService.getRefreshToken();
        const res = await api
          .post("/auth/token", {
            refresh_token: refreshToken,
          });
        if (res.status === 201) {
          localStorageService.setAccessToken(res.data);
          api.defaults.headers.common["Authorization"] =
            "Bearer " + localStorageService.getAccessToken();
          return api(originalRequest);
        }
      }
    } else {
      // Handle network errors here
      console.error('Network error:', error.message);
      // You can throw a new error or return a custom response as needed
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
