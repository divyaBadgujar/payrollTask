import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/utils";

interface RestrictedRouteProps {
  component: ReactElement;
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({ component }) => {
  return !getAccessToken() ? <Navigate to="/login" replace /> : component;
};

export default RestrictedRoute;
