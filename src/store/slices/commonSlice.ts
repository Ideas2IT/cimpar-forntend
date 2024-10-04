import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
interface IUser {
  name: string;
  email: string;
  id: number;
  services: string;
}

type tabInitialState = {
  selectedSidebarTab: string;
  isLoggedIn: boolean;
  user: IUser;
};

const initialState: tabInitialState = {
  selectedSidebarTab: "Personal",
  isLoggedIn: false,
  user: {} as IUser,
};

const commonSlice = createSlice({
  name: SLICE_NAME.commonSlice,
  initialState,
  reducers: {
    setSelectedSidebarTab: (state, action) => {
      state.selectedSidebarTab = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      if (action) {
        state.user.email = action.payload.email;
        state.isLoggedIn = action.payload.status;
      }
    },
  },
});

export const { setSelectedSidebarTab, setIsLoggedIn } = commonSlice.actions;
export const selectTab = (state: RootState) => state.common.selectedSidebarTab;
export const selectIsLoggedIn = (state: RootState) => state.common.isLoggedIn;
export const selectedUser = (state: RootState) => state.common.user;
export default commonSlice.reducer;
