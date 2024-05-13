import userReducer from "./slices/UserSlice";
import commonReducer from "./slices/commonSlice";
import { configureStore } from "@reduxjs/toolkit";
const reducer = {
  user: userReducer,
  common: commonReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
