import { Toast } from "primereact/toast";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import HeaderContext from ".././context/HeaderContext";
import localStorageService from "../services/localStorageService";
import { getPatientDetailsThunk } from "../store/slices/PatientSlice";
import { getUserProfileThunk, selectProfileName, selectUserProfile } from "../store/slices/UserSlice";
import { getServicesTitleThunk, selectIsEmailVerified, selectRole, } from "../store/slices/loginSlice";
import { AppDispatch } from "../store/store";
import { HEADER_TITLE, PATH_NAME, RESPONSE, ROLE, SYMBOL, } from "../utils/AppConstants";
import Main from "./Main";
import Sidebar from "./Sidebar";
import LoginForm from "./loginForm/LoginForm";
import SetPassword from "./setPassword/SetPassword";
import useToast from "./useToast/UseToast";
import { getServiceCategoriesThunk } from "../store/slices/masterTableSlice";

const Layout = () => {

  const isLoggedIn = useSelector(selectIsEmailVerified);
  const user = useSelector(selectProfileName);
  const role = useSelector(selectRole);
  const profileId = useSelector(selectUserProfile)?.id;

  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();

  const { toast, errorToast } = useToast();

  const [username, setUsername] = useState("");

  const getHeaderTitle = useMemo(() => {
    const path = location.pathname;
    const pathToTitleMap = {
      [PATH_NAME.PROFILE]: HEADER_TITLE.PROFILE,
      [PATH_NAME.EDIT_INSURANCE]: HEADER_TITLE.PROFILE,
      [PATH_NAME.EDIT_MEDICAL_CONDITIONS]: HEADER_TITLE.PROFILE,
      [PATH_NAME.EDIT_PROFILE]: HEADER_TITLE.PROFILE,
      [PATH_NAME.EDIT_MEDICATION]: HEADER_TITLE.PROFILE,
      [PATH_NAME.EDIT_VISIT_HISTORY]: HEADER_TITLE.PROFILE,
      [PATH_NAME.HEALTH_RECORDS]: HEADER_TITLE.HEALTH_RECORD,
      [PATH_NAME.MASTER_TABLES]: HEADER_TITLE.MASTER,
      [PATH_NAME.APPOINTMENTS]: HEADER_TITLE.APPOINTMENT,
      [PATH_NAME.TRANSACTIONS]: HEADER_TITLE.TRANSACTION,
      [PATH_NAME.PRICING]: HEADER_TITLE.PRICING,
      [PATH_NAME.LOCATION]: HEADER_TITLE.CENTER_LOCATION,
    };
    if (
      path.startsWith(PATH_NAME.EDIT_INSURANCE) ||
      path.startsWith(PATH_NAME.EDIT_VISIT_HISTORY)
    ) {
      return HEADER_TITLE.PROFILE;
    }
    if (path.includes(PATH_NAME.SERVICE_MASTER)) {
      return HEADER_TITLE.SERVICE_MASTER;
    }
    return pathToTitleMap[path] || "Home";
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname === SYMBOL.SLASH ||
      location.pathname.startsWith(PATH_NAME.CREATE_APPOINTMENT)
    ) {
      setUsername("Hi, " + user);
    } else {
      setUsername(getHeaderTitle);
    }
  }, [user]);

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

  const updateHeaderTitle = (newValue: string) => {
    if (newValue) {
      setUsername(newValue);
    }
  };

  const headerContextValue = useMemo(
    () => ({ username, updateHeaderTitle }),
    [username]
  );

  return (
    <>
      {!isLoggedIn ? (
        <>
          {location.pathname === "set-password/:id" ? (
            <SetPassword />
          ) : (
            <LoginForm />
          )}
        </>
      ) : (
        <div className="flex h-full overflow-auto">
          <HeaderContext.Provider value={headerContextValue}>
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
