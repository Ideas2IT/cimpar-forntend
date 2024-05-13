import { useEffect, useState } from "react";
import HeaderContext from ".././context/HeaderContext";
import Main from "./Main";
import Sidebar from "./Sidebar";
import LoginForm from "./loginForm/LoginForm";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/commonSlice";
const Layout = () => {
  const [value, setValue] = useState("Home");
  const updateHeaderTitle = (newValue: string) => {
    setValue(newValue);
  };
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <div className="flex h-full">
          <HeaderContext.Provider value={{ value, updateHeaderTitle }}>
            <Sidebar />
            <Main />
          </HeaderContext.Provider>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default Layout;
