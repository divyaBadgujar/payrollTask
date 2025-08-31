import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/utils";

const PrivateRoute = ({component: Component}) => {
    return getAccessToken() ? Component : <Navigate to = "/login" />
}

export default PrivateRoute;