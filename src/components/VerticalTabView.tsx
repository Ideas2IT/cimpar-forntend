import { useEffect, useState } from "react";
import Tab from "../interfaces/Tab";
import { useSelector } from "react-redux";
import { selectTab } from "../store/slices/commonSlice";
import { useLocation } from "react-router-dom";
import { PATH_NAME } from "../utils/AppConstants";

interface VerticalTabProps {
  tabs: Tab[];
  hideTabs: boolean;
  changeTab: (value: string) => void;
}

const VerticalTabView: React.FC<VerticalTabProps> = ({
  tabs,
  hideTabs,
  changeTab,
}) => {
  const selectedOption = useSelector(selectTab);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname) {
      if (location.pathname === PATH_NAME.PROFILE && selectedOption !== "") {
        setSelectedTab(
          tabs.find((t) => {
            return t.value.toLowerCase() === selectedOption.toLowerCase();
          }) || tabs[0]
        );
      }
    }
  }, [location.pathname]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    changeTab(tab.value);
  };

  return (
    <div className="flex flex-grow">
      {!hideTabs && (
        <ul className="w-52 bg-gray-50">
          {tabs.map((tab) => (
            <li
              key={tab.key}
              className={`cursor-pointer px-6 py-4 text-md font-secondary border-b ${selectedTab.key === tab.key ? "bg-cyan-700 text-white" : "text-gray-600"}`}
              onClick={() => handleOnTabClick(tab)}
            >
              {tab.value}
            </li>
          ))}
        </ul>
      )}
      <div className="bg-white flex-grow">{selectedTab.content}</div>
    </div>
  );
};

export default VerticalTabView;
