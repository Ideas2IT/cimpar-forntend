import ReyaLogo from "../assets/reya-logo.svg?react";
import Home from "../assets/icons/home.svg?react";
import Profile from "../assets/icons/profile.svg?react";
import AddRecord from "../assets/icons/addrecord.svg?react";
import { useState } from "react";

interface Tab {
  key: string;
  icon: React.ReactNode;
  routerLink: string;
}

const Sidebar = () => {
  const tabs: Tab[] = [
    {
      key: "home",
      icon: <Home />,
      routerLink: "/",
    },
    {
      key: "labTestResults",
      icon: <AddRecord />,
      routerLink: "/health-records",
    },
    {
      key: "profile",
      icon: <Profile />,
      routerLink: "/profile",
    },
  ];
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="w-20 flex flex-col">
      <div className="pt-7 pb-10 px-1">
        <ReyaLogo />
      </div>
      <div className="flex-grow m-auto">
        {tabs.map((tab) => (
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
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
