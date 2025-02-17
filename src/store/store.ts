import userReducer from "./slices/UserSlice";
import commonReducer from "./slices/commonSlice";
import patinetReducer from "./slices/PatientSlice";
import { configureStore } from "@reduxjs/toolkit";
import loggedInUserReducer, {
  setAuthState,
  setRole,
} from "./slices/loginSlice";
import spinnerReducer from "./slices/spinnerSlice";
import masterTableReducer from "./slices/masterTableSlice";
import serviceHistoryReducer from "./slices/serviceHistorySlice";
import appointmentReducer from "./slices/appointmentSlice";
const reducer = {
  user: userReducer,
  common: commonReducer,
  patient: patinetReducer,
  loggedInUser: loggedInUserReducer,
  spinner: spinnerReducer,
  masterTable: masterTableReducer,
  serviceHistory: serviceHistoryReducer,
  appointment: appointmentReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});


const token = localStorage.getItem("accessToken");
if (token) {
  store.dispatch(setAuthState({ isAuthenticated: true }));
}
const role = localStorage.getItem("role");
if (role) {
  store.dispatch(setRole({ role: role }));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
