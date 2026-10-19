
import { Navigate } from "react-router-dom";
import { userAuth } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, user } = userAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to={user.role === "admin" ? "/dashboard" : "/menu"}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
