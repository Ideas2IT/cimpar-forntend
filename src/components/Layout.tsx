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
import {
  getServicesTitleThunk,
  selectIsEmailVerified,
  selectRole,
} from "../store/slices/loginSlice";
import { AppDispatch } from "../store/store";
import { RESPONSE, ROLE } from "../utils/AppConstants";
import Main from "./Main";
import Sidebar from "./Sidebar";
import LoginForm from "./loginForm/LoginForm";
import SetPassword from "./setPassword/SetPassword";
import useToast from "./useToast/UseToast";
import { Toast } from "primereact/toast";

const Layout = () => {
  const user = useSelector(selectProfileName);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast } = useToast();

  useEffect(() => {
    setUsername("Hi, " + user);
  }, [user]);

  const updateHeaderTitle = (newValue: string) => {
    if (newValue) {
      setUsername(newValue);
    }
  };

  const isLoggedIn = useSelector(selectIsEmailVerified);
  const role = useSelector(selectRole);
  const profileId = useSelector(selectUserProfile)?.id;

  useEffect(() => {
    if (profileId && role === ROLE.PATIENT) {
      dispatch(getPatientDetailsThunk(profileId)).then((response) => {
        if (response?.meta?.requestStatus === RESPONSE.REJECTED) {
          errorToast(
            "Failed to Load",
            "Failed to fetch patient details. Please try again later."
          );
        }
      });
      dispatch(getServicesTitleThunk());
    }
  }, [profileId]);

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      const email = localStorage.getItem("email");
      if (email) {
        dispatch(getUserProfileThunk()).then((response) => {
          if (
            localStorage.getItem("role") === ROLE.PATIENT &&
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
          <LoginForm />
        )
      ) : (
        <div className="flex h-full">
          <HeaderContext.Provider value={{ username, updateHeaderTitle }}>
            <Sidebar />
            <Main />
          </HeaderContext.Provider>
        </div>
      )}
      <Toast ref={toast} />
    </>
  );
};

export default Layout;
