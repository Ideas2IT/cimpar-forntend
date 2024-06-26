import { ISignupPayload } from "../interfaces/User";
import {
  IChangePasswordPayload,
  IConfirmPasswordPayload,
  ILoginPayload,
  IRotateTokenPayload,
  ISetPassword,
} from "../interfaces/UserLogin";
import { API_URL } from "../utils/aapiURL";
import http from "./common.services";

const login = (payload: ILoginPayload) => {
  return http.post("/login", JSON.stringify(payload));
};

const signup = (payload: ISignupPayload) => {
  return http.post("sign_up", payload);
};

const setPassword = (payload: ISetPassword) => {
  return http.post(`${API_URL.confirmPassword}`, payload);
};

const rotateToken = (payload: IRotateTokenPayload) => {
  return http.post(`${API_URL.rotateToken}`, payload);
};

const logout = () => {
  return http.post(`${API_URL.logout}`);
};

const changePassword = (payload: IChangePasswordPayload) => {
  return http.post(`${API_URL.changePassword}`, payload);
};

const resetPassword = (email: string) => {
  return http.post(`${API_URL.resetPassword}/${email}`);
};

const confirmPassword = (payload: IConfirmPasswordPayload) => {
  return http.post(`${API_URL.confirmPassword}/${payload.token}`);
};
export {
  login,
  signup,
  setPassword,
  rotateToken,
  confirmPassword,
  logout,
  changePassword,
  resetPassword,
};
