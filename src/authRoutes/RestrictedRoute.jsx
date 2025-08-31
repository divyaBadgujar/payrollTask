import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/utils";

const RestrictedRoute = ({component: Component}) => {
    return !getAccessToken() ? <Navigate to = "/login" /> : Component;
}

export default RestrictedRoute;