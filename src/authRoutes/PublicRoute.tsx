import React, { ReactElement } from "react";

interface PublicRouteProps {
  component: ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ component }) => {
  return <div>{component}</div>;
};

export default PublicRoute;
