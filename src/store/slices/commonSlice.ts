import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SLICE_NAME } from "../../utils/sliceUtil";
interface IUser {
  name: string;
  email: string;
  id: number;
  role: "ADMIN" | "PATIENT";
}

type tabInitialState = {
  selectedSidebarTab: string;
  isLoggedIn: boolean;
  role: "ADMIN" | "PATIENT";
  user: IUser;
};

const initialState: tabInitialState = {
  selectedSidebarTab: "personal",
  isLoggedIn: false,
  role: "ADMIN",
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
    setUserRole: (state, action) => {
      if (action.payload) {
        const role = action.payload.split("@")[0];
        state.role = role.toUpperCase();
      }
    },
  },
});

export const { setSelectedSidebarTab, setIsLoggedIn, setUserRole } =
  commonSlice.actions;
export const selectTab = (state: RootState) => state.common.selectedSidebarTab;
export const selectedRole = (state: RootState) => state.common.role;
export const selectIsLoggedIn = (state: RootState) => state.common.isLoggedIn;
export const selectedUser = (state: RootState) => state.common.user;
export default commonSlice.reducer;
