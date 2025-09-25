// AppRoute.jsx
import { Routes, Route, Navigate } from "react-router";
import SignIn from "@/pages/auth/SignIn";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Overview from "@/pages/dashboard/Overview";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import SignUp from "@/pages/auth/SignUp";
import ResetPassword from "@/pages/auth/ResetPassword";
import ConfirmPassword from "@/pages/auth/ConfirmPassword";
import ConfirmOTP from "@/pages/auth/ConfirmOTP";
import CreateAccount from "@/pages/auth/CreateAccount";
import LoadingAccount from "@/pages/auth/LoadingAccount";
import Notification from "@/pages/dashboard/Notification";
import Setting from "@/pages/dashboard/Setting";
import Promotion from "@/pages/dashboard/Promotion";
import Drafts from "@/pages/dashboard/publications/Drafts";
import AllBooks from "@/pages/dashboard/publications/AllBooks";
import UploadBook from "@/pages/dashboard/publications/UploadBook";
import Support from "@/pages/dashboard/Support";
import ViewBook from "@/pages/dashboard/publications/ViewBook";
import Trash from "@/pages/dashboard/publications/Trash";
import PricingPlans from "@/components/PricingPlans";
import MembershipSignup from "@/pages/dashboard/MemberShipPlan";
import MultiStepForm from "@/components/forms/MultiStepForm";
import ProfileConfirm from "@/pages/dashboard/ProfileConfirm";
import LoadingProfile from "@/pages/auth/LoadingProfile";
import PricingOnboading from "@/components/PricingOnboading";
import MemberOnboarding from "@/pages/dashboard/MemberOnboarding";
import PaymentCallback from "@/pages/PaymentCallback";
import ResetPasswordOTP from "@/pages/auth/ResetPasswordOTP";
import MySales from "@/pages/dashboard/publications/MySales";
import { TicketDetail } from "@/pages/dashboard/TicketDetail";
import EditDraft from "@/pages/dashboard/publications/EditDraft";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import KnowledgeBase from "@/pages/dashboard/KnowledgeBase";
import KnowledgeDetail from "@/pages/dashboard/KnowledgeDetial";
import EditUploadBook from "@/pages/dashboard/publications/EditUploadBook";
// import LogIn from "@/pages/auth/LogIn";

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}

      {/* <Route path="/" element={<Navigate to="/log-in" replace />} />
      <Route path="/log-in" element={<LogIn />} /> */}

      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-password" element={<ConfirmPassword />} />
      <Route path="/confirm-otp" element={<ConfirmOTP />} />
      <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/loading-account" element={<LoadingAccount />} />
      <Route path="/loading-profile" element={<LoadingProfile />} />
      <Route path="/ticket/:id" element={<TicketDetail />} />
      <Route path="/profile-detail" element={<MultiStepForm />} />
      <Route path="/profile-confirm" element={<ProfileConfirm />} />
      <Route path="/pricing" element={<PricingOnboading />} />

      <Route path="/membership" element={<MemberOnboarding />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route
        path="/membership/payment-callback"
        element={<PaymentCallback />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Each dashboard page wraps its content in Layout individually */}
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/notification" element={<Notification />} />
        <Route path="/dashboard/settings" element={<Setting />} />
        <Route path="/dashboard/support" element={<Support />} />
        <Route path="/dashboard/promotion" element={<Promotion />} />
        <Route path="/dashboard/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/dashboard/knowledge/:id" element={<KnowledgeDetail />} />
        <Route path="/dashboard/pricing" element={<PricingPlans />} />
        <Route
          path="/dashboard/publications/upload-book"
          element={<UploadBook />}
        />
         <Route
          path="/dashboard/publications/edit-upload-book/:id"
          element={<EditUploadBook />}
        />
        <Route
          path="/dashboard/publications/all-books"
          element={<AllBooks />}
        />

        <Route
          path="/dashboard/publications/edit-draft/:id"
          element={<EditDraft />}
        />
        <Route path="/dashboard/publications/my-sales" element={<MySales />} />
        <Route path="/dashboard/publications/book/:id" element={<ViewBook />} />
        <Route path="/membership/signup" element={<MembershipSignup />} />
        <Route path="/dashboard/publications/drafts" element={<Drafts />} />
        <Route path="/dashboard/publications/trash" element={<Trash />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoute;
