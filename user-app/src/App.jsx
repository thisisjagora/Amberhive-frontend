import { Routes, Route, Navigate } from "react-router";
import DefaultLayout from "./components/shared/defaultLayout";
import HomePage from "./pages/HomePage";
import Books from "./pages/Books";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favourites from "./pages/Favourites";
import MyOrders from "./pages/MyOrders";
import PricingPlans from "./components/homeComp/PricingPlans";
import BookDetails from "./pages/BookDetails";
import LoadingCheckout from "./components/LoadingCheckout";
import CheckTrack from "./pages/CheckTrack";
import TrackOrder from "./pages/TrackOrder";
import Profile from "./pages/Profile";
import PaymentMethod from "./pages/PaymentMethod";
import Notification from "./pages/Notification";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Library from "./pages/Library";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import BestSellers from "./pages/BestSellers";
import NewRelease from "./pages/NewRelease";
import ConfirmOTP from "./pages/auth/ConfirmOTP";
import CreateAccount from "./pages/auth/CreateAccount";
import LoadingAccount from "./pages/auth/LoadingAccount";
import MembershipSignup from "./pages/MemberShipPlan";
import About from "./pages/About";
import PaymentCallback from "./pages/PaymentCallback";
import ReadBook from "./pages/ReadBook";
import MemberPaymentCallback from "./pages/MemberPaymentCallback";
import { TicketDetail } from "./pages/TicketDetail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ConfirmPassword from "./pages/auth/ConfirmPassword";
import ResetPasswordOTP from "./pages/auth/ResetPasswordOTP";
import LogIn from "./pages/auth/LogIn";
import PaymentSuccess from "./pages/PaymentSuccess";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";
import SearchedBook from "./pages/SearchBook";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/confirm-otp" element={<ConfirmOTP />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/loading-account" element={<LoadingAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route element={<DefaultLayout />}>
          {/* Home page now on `/home` */}
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<About />} />
          <Route path="/books" element={<Books />} />

          <Route path="/book/:slug" element={<BookDetails />} />

          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/new-releases" element={<NewRelease />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/loading-checkout" element={<LoadingCheckout />} />
          <Route path="/checkout-tracking" element={<CheckTrack />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/membership/signup" element={<MembershipSignup />} />
          <Route
            path="/membership/payment-callback"
            element={<MemberPaymentCallback />}
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/searched-book" element={<SearchedBook />} />
          <Route path="/payment-methods" element={<PaymentMethod />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path="/notifications" element={<Notification />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/read-book/:id" element={<ReadBook />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
