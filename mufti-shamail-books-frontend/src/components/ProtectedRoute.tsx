import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
	allowedRoles?: ("admin" | "user")[];
	restrictWhenAuth?: boolean; // Restrict access to login/register when authenticated
};

// THIS DOES NOT WORK, CHANGE IT
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	allowedRoles,
	restrictWhenAuth = false,
}) => {
	const { isAuthenticated, user } = useAuth();
	const role = user?.role;

	// Redirect unauthenticated users
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// Restrict access for authenticated users (e.g., to /login or /register)
	if (restrictWhenAuth && isAuthenticated) {
		return (
			<Navigate
				to={role === "admin" ? "/admin/dashboard" : "/dashboard"}
				replace
			/>
		);
	}

	// Restrict access based on roles
	if (allowedRoles && !allowedRoles.includes(role as "admin" | "user")) {
		return (
			<Navigate
				to={role === "admin" ? "/admin/dashboard" : "/dashboard"}
				replace
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoute;
