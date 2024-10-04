import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tests from "../../assets/icons/microscope.svg";
import HeaderContext from "../../context/HeaderContext";
import { HEADER_TITLE } from "../../utils/AppConstants";

const MasterTables = () => {
  const { updateHeaderTitle } = useContext(HeaderContext);

  useEffect(() => {
    updateHeaderTitle(HEADER_TITLE.MASTER);
  }, []);
  const tables = [
    {
      title: "Lab Tests",
      icon: tests,
      routeLink: "tests",
    },
    // {
    //   title: "Pricing",
    //   icon: dollarIcon,
    //   routeLink: "tests",
    // },
  ];
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-3">
      {tables?.map((table, index) => {
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
      className={`flex bg-white cursor-pointer flex-col justify-start items-center w-full h-[12rem] p-4 corsor-pointer border-2 rounded-2xl text-white font-medium hover:bg-purple-800`}
    >
      <div className="flex w-full h-[50%] justify-start">
        <img
          src={icon}
          className="h-[2rem] w-[2rem] bg-purple-100 p-4 box-content rounded-lg"
        />
      </div>
      <div className="ml-2 h-[50%] font-primary text-2xl w-full text-start flex items-end ">
        {title}
      </div>
    </div>
  );
};

export default MasterTables;
