import Header from "./Header";
import "../../node_modules/primereact/resources/themes/fluent-light/theme.css";
import "../../node_modules/primereact/resources/primereact.min.css";
import "../../node_modules/primeicons/primeicons.css";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex flex-col flex-grow bg-gray-100 p-8">
      <Header />
      <Outlet />
    </div>
  );
};

export default Main;
