import { useEffect, useState } from "react";
import HeaderContext from ".././context/HeaderContext";
import Main from "./Main";
import Sidebar from "./Sidebar";
import LoginForm from "./loginForm/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SetPassword from "./setPassword/SetPassword";
import {
  getUserProfileThunk,
  selectProfileName,
  selectUserProfile,
} from "../store/slices/UserSlice";
import {
  loginUserThunk,
  selectIsEmailVerified,
  selectRole,
} from "../store/slices/loginSlice";
import localStorageService from "../services/localStorageService";
import { AppDispatch } from "../store/store";
import { CLIENT_ID, RESPONSE, ROLE } from "../utils/AppConstants";
import { getPatientDetailsThunk } from "../store/slices/PatientSlice";

const Layout = () => {
  const user = useSelector(selectProfileName);
  const [username, setUsername] = useState(user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setUsername(user);
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
      const password = localStorage.getItem("password");
      if (email && password) {
        dispatch(
          loginUserThunk({
            username: email,
            password: password,
            client_id: CLIENT_ID,
            grant_type: "password",
          })
        ).then(({ meta }) => {
          if (meta.requestStatus === RESPONSE.FULFILLED) {
            dispatch(getUserProfileThunk());
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
