import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsLoggedIn } from "../store/slices/commonSlice";
import { PATH_NAME } from "../utils/AppConstants";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(selectIsLoggedIn);
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH_NAME.HOME} />;
};

export default PrivateRoute;
