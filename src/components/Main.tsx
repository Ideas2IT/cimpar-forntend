import Header from "./Header";
import "../../node_modules/primereact/resources/themes/fluent-light/theme.css";
import "../../node_modules/primereact/resources/primereact.min.css";
import "../../node_modules/primeicons/primeicons.css";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../store/slices/loginSlice";
import { PATH_NAME, ROLE } from "../utils/AppConstants";

const Main = () => {
  const role = useSelector(selectRole);
  return (
    <div className="flex flex-col flex-grow bg-gray-100 p-6	">
      <Header />
      <Outlet />
      {role === ROLE.ADMIN && <Navigate to={PATH_NAME.APPOINTMENTS} />}
    </div>
  );
};

export default Main;
