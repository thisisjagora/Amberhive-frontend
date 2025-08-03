import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // or from context/store

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
