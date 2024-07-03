import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import HeaderContext from ".././context/HeaderContext";
import localStorageService from "../services/localStorageService";
import { getPatientDetailsThunk } from "../store/slices/PatientSlice";
import {
  getUserProfileThunk,
  selectProfileName,
  selectUserProfile,
} from "../store/slices/UserSlice";
import { selectIsEmailVerified, selectRole } from "../store/slices/loginSlice";
import { AppDispatch } from "../store/store";
import { ROLE } from "../utils/AppConstants";
import Main from "./Main";
import Sidebar from "./Sidebar";
import LoginForm from "./loginForm/LoginForm";
import SetPassword from "./setPassword/SetPassword";

const Layout = () => {
  const user = useSelector(selectProfileName);
  const [username, setUsername] = useState(user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setUsername("Hi ," + user);
  }, [user]);

  const updateHeaderTitle = (newValue: string) => {
    setUsername(newValue);
  };
  const isLoggedIn = useSelector(selectIsEmailVerified);
  const role = useSelector(selectRole);
  const profileId = useSelector(selectUserProfile)?.id;

  useEffect(() => {
    if (profileId && role === ROLE.PATIENT)
      dispatch(getPatientDetailsThunk(profileId));
  }, [profileId]);

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      const email = localStorage.getItem("email");
      if (email) {
        dispatch(getUserProfileThunk()).then((response) => {
          if (
            localStorage.getItem("role") === "patient" &&
            response?.payload?.id
          ) {
            dispatch(getPatientDetailsThunk(response?.payload.id));
          }
        });
      }
    }
  }, []);
  const location = useLocation();
  return (
    <>
      {!isLoggedIn ? (
        location.pathname === "set-password/:id" ? (
          <SetPassword />
        ) : (
          (location.pathname === "/" || location.pathname === "/login") && (
            <LoginForm />
          )
        )
      ) : (
        <div className="flex h-full">
          <HeaderContext.Provider value={{ username, updateHeaderTitle }}>
            <Sidebar />
            <Main />
          </HeaderContext.Provider>
        </div>
      )}
    </>
  );
};

export default Layout;
