import React from "react";
import { useSelector } from "react-redux";
import Unauthorized from "./Unauthorised";
import { selectRole } from "../store/slices/loginSlice";

const RoleBasedRoute = ({
  element,
  requiredRole,
}: {
  element: React.ReactElement;
  requiredRole: string;
}) => {
  const role = useSelector(selectRole);
  if (role === requiredRole) {
    return element;
  } else {
    return <Unauthorized />;
  }
};

export default RoleBasedRoute;
