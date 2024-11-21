import { Toast } from "primereact/toast";
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
import {
  HEADER_TITLE,
  PATH_NAME,
  RESPONSE,
  ROLE,
  SYMBOL,
} from "../utils/AppConstants";
import Main from "./Main";
import Sidebar from "./Sidebar";
import LoginForm from "./loginForm/LoginForm";
import SetPassword from "./setPassword/SetPassword";
import useToast from "./useToast/UseToast";
import { getServiceCategoriesThunk } from "../store/slices/masterTableSlice";

const Layout = () => {
  const user = useSelector(selectProfileName);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast } = useToast();
  const isLoggedIn = useSelector(selectIsEmailVerified);
  const role = useSelector(selectRole);
  const profileId = useSelector(selectUserProfile)?.id;
  const location = useLocation();

  const getHeaderTitle = () => {
    const path = location.pathname;
    switch (true) {
      case path === PATH_NAME.PROFILE:
      case path === PATH_NAME.EDIT_INSURANCE:
      case path === PATH_NAME.EDIT_MEDICAL_CONDITIONS:
      case path === PATH_NAME.EDIT_PROFILE:
      case path === PATH_NAME.EIDT_MEDICATION:
      case path === PATH_NAME.EDIT_VISIT_HISTORY:
      case path.startsWith(PATH_NAME.EDIT_INSURANCE):
      case path.startsWith(PATH_NAME.EDIT_VISIT_HISTORY):
        return HEADER_TITLE.PROFILE;
      case path === PATH_NAME.TEST_RESULT:
        return HEADER_TITLE.HEALTH_RECORD;
      case path === PATH_NAME.MASTER_TABLES:
        return HEADER_TITLE.MASTER;
      case path === PATH_NAME.APPOINTMENTS:
        return HEADER_TITLE.APPOINTMENT;
      case path.includes(PATH_NAME.SERVICE_MASTER):
        return HEADER_TITLE.SERVICE_MASTER;
      case path === PATH_NAME.TRANSACTIONS:
        return HEADER_TITLE.TRANSACTION;
      case path === PATH_NAME.PRICING:
        return HEADER_TITLE.PRICING;
      case path === PATH_NAME.LOCATION:
        return HEADER_TITLE.CENTER_LOCATION;
      default:
        return "Home";
    }
  };

  useEffect(() => {
    if (
      location.pathname === SYMBOL.SLASH ||
      location.pathname.startsWith(PATH_NAME.HEALTH_RECORDS)
    ) {
      setUsername("Hi, " + user);
    } else {
      setUsername(getHeaderTitle());
    }
  }, [user]);

  const updateHeaderTitle = (newValue: string) => {
    if (newValue) {
      setUsername(newValue);
    }
  };

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
          dispatch(getServiceCategoriesThunk());
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
