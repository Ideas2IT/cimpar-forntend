import userReducer from "./slices/UserSlice";
import commonReducer from "./slices/commonSlice";
import patinetReducer from "./slices/PatientSlice";
import { configureStore } from "@reduxjs/toolkit";
import loggedInUserReducer from "./slices/loginSlice";
import spinnerReducer from "./slices/spinnerSlice";
const reducer = {
  user: userReducer,
  common: commonReducer,
  patient: patinetReducer,
  loggedInUser: loggedInUserReducer,
  spinner: spinnerReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
