import ReyaLogo from "../assets/reya-logo.svg";
import Home from "../assets/icons/home.svg";
import Profile from "../assets/icons/profile.svg";
import AddRecord from "../assets/icons/addrecord.svg";
import Logout from "../assets/icons/logout.svg";
import { useState } from "react";

interface Tab {
  key: string;
  icon: string;
}

const Sidebar = () => {
  const tabs: Tab[] = [
    {
      key: "home",
      icon: Home,
    },
    {
      key: "labTestResults",
      icon: AddRecord,
    },
    {
      key: "profile",
      icon: Profile,
    },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="w-20 flex flex-col">
      <div className="pt-7 pb-10 px-1">
        <img src={ReyaLogo} />
      </div>
      <div className="flex-grow m-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex justify-center items-center h-12 rounded-lg w-14 mb-4 text-sm ${selectedTab.key === tab.key ? "bg-purple-800" : ""}`}
            onClick={() => handleOnTabClick(tab)}
          >
            <img src={tab.icon} />
          </button>
        ))}
      </div>
      <div className="h-14 m-auto">
        <button>
          <img src={Logout} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
