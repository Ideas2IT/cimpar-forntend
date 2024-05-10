import { useState } from "react";
import HeaderContext from ".././context/HeaderContext";
import Main from "./Main";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [value, setValue] = useState("Home");
  const updateHeaderTitle = (newValue: string) => {
    setValue(newValue);
  };
  return (
    <div className="flex h-full">
      <HeaderContext.Provider value={{ value, updateHeaderTitle }}>
        <Sidebar />
        <Main />
      </HeaderContext.Provider>
    </div>
  );
};

export default Layout;
