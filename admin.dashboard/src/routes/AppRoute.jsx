import { Routes, Route, Navigate } from "react-router";
import SignIn from "@/pages/auth/SignIn";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ConfirmPassword from "@/pages/auth/ConfirmPassword";
import NotFound from "@/pages/NotFound";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoutes from "@/routes/AdminRoutes";
import SuperAdminRoutes from "@/routes/SuperAdminRoutes";
// import LogIn from "@/pages/auth/LogIn";

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {/* <Route path="/" element={<Navigate to="/log-in" replace />} />
      <Route path="/log-in" element={<LogIn />} /> */}

      <Route path="/" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-password" element={<ConfirmPassword />} />

      {/* Role-Based Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoute;
