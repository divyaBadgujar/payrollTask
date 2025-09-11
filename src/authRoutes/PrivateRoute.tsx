import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/utils";

interface PrivateRouteProps {
  component: ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component }) => {
  return getAccessToken() ? component : <Navigate to="/login" replace />;
};

export default PrivateRoute;
