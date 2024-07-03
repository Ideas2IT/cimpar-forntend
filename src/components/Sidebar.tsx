import ReyaLogo from "../assets/reya-logo.svg?react";
import Home from "../assets/icons/home.svg?react";
import Profile from "../assets/icons/profile.svg?react";
import AddRecord from "../assets/icons/addrecord.svg?react";
import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import HeaderContext from "../context/HeaderContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import { setSelectedSidebarTab } from "../store/slices/commonSlice";
import { PATH_NAME } from "../utils/AppConstants";
import { selectProfileName } from "../store/slices/UserSlice";
import { selectRole } from "../store/slices/loginSlice";
interface Tab {
  key: string;
  icon: React.ReactNode;
  routerLink: string;
  header: string;
}

const Sidebar = () => {
  const tabs = {
    patient: [
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
    admin: [
      {
        header: "Appointments",
        key: "appointment",
        icon: <i className="pi pi-calendar-minus text-2xl" />,
        routerLink: PATH_NAME.APPOINTMENTS,
      },
    ],
    other: [],
  };
  const role = useSelector(selectRole);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[role][0]);
  const { updateHeaderTitle } = useContext(HeaderContext);
  const location = useLocation();
  const username = useSelector(selectProfileName);

  useEffect(() => {
    updateHeaderTitle("Hi, " + username);
  }, [username]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    if (tab.header === "Home") {
      updateHeaderTitle("Hi, " + username);
    } else {
      updateHeaderTitle(tab.header);
    }
    dispatch(setSelectedSidebarTab("personal"));
  };

  useEffect(() => {
    changeMenuOption();
  }, [location.pathname]);

  const changeMenuOption = () => {
    const pathname = location.pathname.split("/")[1];
    let tabIndex;
    switch (pathname) {
      case "profile":
      case "editProfile":
      case "editMedication":
      case "editInsurance":
        tabIndex = 2;
        break;
      case "":
        tabIndex = 0;
        break;
      case "test-result":
        tabIndex = 1;
        break;
      default:
        tabIndex = null;
    }
    if (tabIndex) {
      setSelectedTab(tabs[role][tabIndex]);
    }
  };

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
