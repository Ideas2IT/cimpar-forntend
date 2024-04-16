import { useState } from "react";
import Tab from "../interfaces/Tab";

interface VerticalTabProps {
  tabs: Tab[];
  hideTabs: boolean
}

const VerticalTabView: React.FC<VerticalTabProps> = ({ tabs, hideTabs }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleOnTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex flex-grow">
      {!hideTabs && (
        <ul className="w-52 bg-gray-50">
          {tabs.map((tab) => (
            <li
              key={tab.key}
              className={`cursor-pointer px-6 py-4 text-sm font-medium border-b ${selectedTab.key === tab.key ? "bg-cyan-700 text-white" : "text-gray-600"}`}
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
