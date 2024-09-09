import { Outlet } from "react-router-dom";
import "../../node_modules/primeicons/primeicons.css";
import "../../node_modules/primereact/resources/primereact.min.css";
import "../../node_modules/primereact/resources/themes/fluent-light/theme.css";
import Header from "./Header";

const Main = () => {
  return (
    <div className="flex flex-col flex-grow bg-gray-100 p-6	">
      <Header />
      <Outlet />
    </div>
  );
};
export default Main;
