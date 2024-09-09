import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectRole } from "../store/slices/loginSlice";
import { PATH_NAME, ROLE } from "../utils/AppConstants";
import Appointments from "./appointments/Appointments";
import HomePage from "./homePage/HomePage";

export const ConditionalRoute = () => {
  const location = useLocation();
  const role = useSelector(selectRole);

  if (role === ROLE.ADMIN && location.pathname === PATH_NAME.HOME) {
    return <Appointments />;
  }

  if (role === ROLE.PATIENT && location.pathname === PATH_NAME.HOME) {
    return <HomePage />;
  }
  return <div>Page not found or access denied.</div>;
};

export default ConditionalRoute;
