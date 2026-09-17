import { Navigate } from "react-router-dom";
import { userAuth } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
    const { token } = userAuth();
    if(!token)
       return  <Navigate to="/login" />
    return children;
}

export default ProtectedRoute;