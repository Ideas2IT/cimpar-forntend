import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  isLoading: false,
};
export const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    showSpinner: (state) => {
      console.log("got call to enable spinner");
      state.isLoading = true;
    },
    hideSpinner: (state) => {
      state.isLoading = false;
    },
  },
});
export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export const selectLoading = (state: RootState) => state.spinner.isLoading;
const { reducer } = spinnerSlice;
export default reducer;
