import ReyaLogo from "../assets/reya-logo.svg?react";
import Home from "../assets/icons/home.svg?react";
import Profile from "../assets/icons/profile.svg?react";
import AddRecord from "../assets/icons/addrecord.svg?react";
import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import HeaderContext from "../context/HeaderContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  selectedRole,
  setSelectedSidebarTab,
} from "../store/slices/commonSlice";
import { PATH_NAME } from "../utils/AppConstants";
import { selectUser } from "../store/slices/UserSlice";

interface Tab {
  key: string;
  icon: React.ReactNode;
  routerLink: string;
  header: string;
}

const Sidebar = () => {
  const tabs = {
    PATIENT: [
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
    ],
    ADMIN: [
      {
        header: "Appointments",
        key: "appointment",
        icon: <i className="pi pi-calendar-minus text-2xl" />,
        // icon: <Calendar />,
        routerLink: PATH_NAME.APPOINTMENTS,
      },
    ],
  };

  const role = useSelector(selectedRole);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[role][0]);
  const { updateHeaderTitle } = useContext(HeaderContext);
  const location = useLocation();
  const user = useSelector(selectUser);

  useEffect(() => {
    updateHeaderTitle("Hi, " + user);
  }, [user]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    if (tab.header.toLowerCase() === "home") {
      updateHeaderTitle("Hi, " + user);
    } else {
      updateHeaderTitle(tab.header);
    }
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
      setSelectedTab(tabs[role][2]);
    } else if (pathname === "") {
      setSelectedTab(tabs[role][0]);
    } else if (pathname === "test-result") {
      setSelectedTab(tabs[role][1]);
    }
  }, [location.pathname]);

  return (
    <div className="w-20 flex flex-col bg-white">
      <div className="pt-7 pb-10 px-1">
        <ReyaLogo />
      </div>
      <div className="flex-grow m-3">
        {tabs[role].map((tab) => (
          <NavLink to={tab.routerLink} key={tab.key}>
            <button
              key={tab.key}
              className={`flex justify-center items-center h-12 rounded-lg w-14 mb-4 text-sm ${selectedTab.key === tab.key ? "bg-purple-800" : ""}`}
              onClick={() => handleOnTabClick(tab)}
            >
              <span
                className={`${selectedTab.key === tab.key ? "stroke-white text-white" : "stroke-gray-500 text-gray-500"}`}
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
