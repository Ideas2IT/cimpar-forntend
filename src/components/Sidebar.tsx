import ReyaLogo from "../assets/reya-logo.svg?react";
import Home from "../assets/icons/home.svg?react";
import Profile from "../assets/icons/profile.svg?react";
import AddRecord from "../assets/icons/addrecord.svg?react";
import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import HeaderContext from "../context/HeaderContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setSelectedSidebarTab } from "../store/slices/commonSlice";
import { PATH_NAME } from "../utils/AppConstants";

interface Tab {
  key: string;
  icon: React.ReactNode;
  routerLink: string;
  header: string;
}

const Sidebar = () => {
  const tabs: Tab[] = [
    {
      header: "Home",
      key: "home",
      icon: <Home />,
      routerLink: "/",
    },
    {
      header: "Health Records",
      key: "labTestResults",
      icon: <AddRecord />,
      routerLink: "/test-result",
    },
    {
      header: "Profile",
      key: "profile",
      icon: <Profile />,
      routerLink: PATH_NAME.PROFILE,
    },
  ];
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const { updateHeaderTitle } = useContext(HeaderContext);
  const location = useLocation();

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    updateHeaderTitle(tab.header);
    dispatch(setSelectedSidebarTab("personal"));
  };

  useEffect(() => {
    const pathname = location.pathname.split("/")[1];
    if (
      pathname === "profile" ||
      pathname === "editProfile" ||
      pathname === "editMedication" ||
      pathname === "editInsurance"
    ) {
      setSelectedTab(tabs[2]);
    } else if (pathname === "") {
      setSelectedTab(tabs[0]);
    } else if (pathname === "test-result") {
      setSelectedTab(tabs[1]);
    }
  }, [location.pathname]);

  return (
    <div className="w-20 flex flex-col">
      <div className="pt-7 pb-10 px-1">
        <ReyaLogo />
      </div>
      <div className="flex-grow m-3">
        {tabs.map((tab) => (
          <NavLink to={tab.routerLink} key={tab.key}>
            <button
              key={tab.key}
              className={`flex justify-center items-center h-12 rounded-lg w-14 mb-4 text-sm ${selectedTab.key === tab.key ? "bg-purple-800" : ""}`}
              onClick={() => handleOnTabClick(tab)}
            >
              <span
                className={`${selectedTab.key === tab.key ? "stroke-white" : "stroke-gray-500"}`}
              >
                {tab.icon}
              </span>
            </button>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
