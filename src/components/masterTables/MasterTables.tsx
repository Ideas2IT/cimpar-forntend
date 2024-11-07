import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tests from "../../assets/icons/microscope-icon.svg";
import HeaderContext from "../../context/HeaderContext";
import { HEADER_TITLE, PATH_NAME } from "../../utils/AppConstants";
import dollarIcon from "../../assets/icons/currency-icon.svg";
import locationIcon from "../../assets/icons/locationIcon.svg";
import "./Masters.css";

const MasterTables = () => {
  const { updateHeaderTitle } = useContext(HeaderContext);

  const tables = [
    {
      title: "Lab Tests",
      icon: tests,
      routeLink: "tests",
    },
    {
      title: "Pricing",
      icon: dollarIcon,
      routeLink: PATH_NAME.PRICING,
    },
    {
      title: "Service Center Location",
      icon: locationIcon,
      routeLink: PATH_NAME.LOCATION,
    },
  ];

  useEffect(() => {
    updateHeaderTitle(HEADER_TITLE.MASTER);
  }, []);

  return (
    <div className="tile-wrapper">
      {tables.map((table, index) => {
        return (
          <Tile
            icon={table.icon}
            title={table.title}
            route={table.routeLink}
            key={index}
          />
        );
      })}
    </div>
  );
};

const Tile = ({
  icon,
  title,
  route,
}: {
  icon: string;
  title: string;
  route: string;
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(route)}
      className="tile-icon-container corsor-pointer"
    >
      <div className="flex w-full h-[50%] justify-start">
        <img src={icon} className="tile-img" />
      </div>
      <div className="tile-title">{title}</div>
    </div>
  );
};

export default MasterTables;
