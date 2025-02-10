import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import AddRecord from "../assets/icons/addrecord.svg?react";
import Home from "../assets/icons/home.svg?react";
import Profile from "../assets/icons/profile.svg?react";
import ReyaLogo from "../assets/reya-logo.svg?react";
import HeaderContext from "../context/HeaderContext";
import { selectProfileName } from "../store/slices/UserSlice";
import { setSelectedSidebarTab } from "../store/slices/commonSlice";
import { selectRole } from "../store/slices/loginSlice";
import { AppDispatch } from "../store/store";
import { ABSOLUTE_PATH, HEADER_TITLE, PATH_NAME, SYMBOL, } from "../utils/AppConstants";

interface Tab {
  key: string;
  icon: React.ReactNode;
  routerLink: string;
  header: string;
}

const tabs = {
  patient: [
    {
      header: HEADER_TITLE.HOME,
      key: "home",
      icon: <Home />,
      routerLink: PATH_NAME.HOME,
      title: "Home",
    },
    {
      header: HEADER_TITLE.HEALTH_RECORD,
      key: "labTestResults",
      icon: <AddRecord />,
      routerLink: PATH_NAME.HEALTH_RECORDS,
      title: "Health Record",
    },
    {
      header: HEADER_TITLE.PROFILE,
      key: "profile",
      icon: <Profile />,
      routerLink: PATH_NAME.PROFILE,
      title: "Profile",
    },
  ],
  admin: [
    {
      header: HEADER_TITLE.APPOINTMENT,
      key: "appointment",
      icon: <i className="pi pi-calendar-minus text-2xl" />,
      routerLink: PATH_NAME.APPOINTMENTS,
      title: "Appointments",
    },
    {
      header: HEADER_TITLE.MASTER,
      key: "master",
      icon: <i className="pi pi-wallet text-2xl" />,
      routerLink: PATH_NAME.MASTER_TABLES,
      title: "Master",
    },
    {
      header: HEADER_TITLE.TRANSACTION,
      key: "transaction",
      icon: <i className="pi pi-clock text-2xl" />,
      routerLink: PATH_NAME.TRANSACTIONS,
      title: "Transactions",
    },
  ],
  other: [],
};



const Sidebar = () => {


  const role = useSelector(selectRole);

  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const username = useSelector(selectProfileName);

  const { updateHeaderTitle } = useContext(HeaderContext);
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[role][0]);


  useEffect(() => {
    if (location.pathname === SYMBOL.SLASH) {
      updateHeaderTitle("Hi, " + username);
    } else {
      updateHeaderTitle(selectedTab.header);
    }

  }, [username, selectedTab]);

  useEffect(() => {
    changeMenuOption();
  }, [location.pathname]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    if (tab.header === HEADER_TITLE.HOME) {
      updateHeaderTitle("Hi, " + username);
    } else {
      updateHeaderTitle(tab.header);
    }
    dispatch(setSelectedSidebarTab("Personal"));
  };



  const changeMenuOption = () => {
    const pathname = location.pathname.split(SYMBOL.SLASH)[1];
    let tabIndex;
    switch (pathname) {
      case ABSOLUTE_PATH.PROFILE:
      case ABSOLUTE_PATH.EDIT_PROFILE:
      case ABSOLUTE_PATH.EDIT_MEDICATION:
      case ABSOLUTE_PATH.EDIT_MEDICAL_CONDITION:
      case ABSOLUTE_PATH.EDIT_INSURANCE:
      case ABSOLUTE_PATH.EDIT_VISIT_HISTORY:
      case ABSOLUTE_PATH.TRANSACTIONS:
        tabIndex = 2;
        break;
      case ABSOLUTE_PATH.HEALTH_RECORDS:
      case ABSOLUTE_PATH.MASTER_TABS:
      case ABSOLUTE_PATH.SERVICE_MASTER:
        tabIndex = 1;
        break;
      default:
        tabIndex = 0;
    }
    if (role)
      setSelectedTab(tabs[role][tabIndex]);
  };

  return (
    <div className="md:w-20 w-10 flex flex-col bg-white">
      <div className="pt-7 pb-10 px-1">
        <ReyaLogo />
      </div>
      <div className="flex-grow md:m-3">
        {tabs[role]?.map((tab) => (
          <NavLink to={tab.routerLink} title={tab.title} key={tab?.key}>
            <button
              key={tab?.key}
              className={`flex justify-center items-center h-12 rounded-lg md:w-14 w-7 mb-4 text-sm ${selectedTab?.key === tab?.key ? "bg-purple-800" : ""}`}
              onClick={() => handleOnTabClick(tab)}
            >
              <span
                className={`${selectedTab?.key === tab?.key ? "stroke-white text-white" : "stroke-gray-500 text-gray-500"}`}
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
