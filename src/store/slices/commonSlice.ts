import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";

type tabInitialState = {
  selectedSidebarTab: string;
  isLoggedIn: boolean;
};

const initialState: tabInitialState = {
  selectedSidebarTab: "personal",
  isLoggedIn: false,
};

const commonSlice = createSlice({
  name: SLICE_NAME.commonSlice,
  initialState,
  reducers: {
    setSelectedSidebarTab: (state, action) => {
      state.selectedSidebarTab = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      console.log(action.payload);
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setSelectedSidebarTab, setIsLoggedIn } = commonSlice.actions;
export const selectTab = (state: RootState) => state.common.selectedSidebarTab;
export const selectIsLoggedIn = (state: RootState) => state.common.isLoggedIn;
export default commonSlice.reducer;
