import userReducer from "./slices/UserSlice";
import commonReducer from "./slices/commonSlice";
import patinetReducer from "./slices/PatientSlice";
import { configureStore } from "@reduxjs/toolkit";
import loggedInUserReducer from "./slices/loginSlice";
import spinnerReducer from "./slices/spinnerSlice";
import masterTableReducer from "./slices/masterTableSlice";
import serviceHistoryReducer from "./slices/serviceHistorySlice";
const reducer = {
  user: userReducer,
  common: commonReducer,
  patient: patinetReducer,
  loggedInUser: loggedInUserReducer,
  spinner: spinnerReducer,
  masterTable: masterTableReducer,
  serviceHistory: serviceHistoryReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
