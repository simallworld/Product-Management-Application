import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store";

// ProtectedRoute component
// Redirects to login if user is not authenticated

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
