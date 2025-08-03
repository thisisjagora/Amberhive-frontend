import AdminManagament from "@/pages/dashboard/superadmin/AdminManagament";
import Announcements from "@/pages/dashboard/superadmin/Announcements";
import AuthorDetail from "@/pages/dashboard/superadmin/AuthorDetail";
import AuthorReports from "@/pages/dashboard/superadmin/AuthorReports";
import BookReports from "@/pages/dashboard/superadmin/BookReports";
import BuyerReports from "@/pages/dashboard/superadmin/BuyerReports";
import EarningsReports from "@/pages/dashboard/superadmin/EarningsReports";
import JagoraSupport from "@/pages/dashboard/superadmin/JagoraSupport";
import { JagoraSupportDetail } from "@/pages/dashboard/superadmin/JagoraSupportDetail";
import KnowledgeBase from "@/pages/dashboard/superadmin/KnowledgeBase";
import KnowledgeDetail from "@/pages/dashboard/superadmin/KnowledgeDetail";
import MyTicketDetail from "@/pages/dashboard/superadmin/MyTicketDetail";
import Notification from "@/pages/dashboard/superadmin/Notification";
import OpenTicketDetail from "@/pages/dashboard/superadmin/OpenTicketDetail";
import Overview from "@/pages/dashboard/superadmin/Overview";
import Payout from "@/pages/dashboard/superadmin/Payout";
import PromotionReports from "@/pages/dashboard/superadmin/PromotionReports";
import Setting from "@/pages/dashboard/superadmin/Setting";
import Subscription from "@/pages/dashboard/superadmin/Subscription";
import Support from "@/pages/dashboard/superadmin/Support";
import TicketDetail from "@/pages/dashboard/superadmin/TicketDetail";
import UserManagements from "@/pages/dashboard/superadmin/UserManagements";
import UserMReports from "@/pages/dashboard/superadmin/UserMReports";
import NotFound from "@/pages/NotFound";
import { Routes, Route } from "react-router";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="overview" element={<Overview />} />
      <Route path="notification" element={<Notification />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="user-managements" element={<UserManagements />} />
      <Route path="admin-management" element={<AdminManagament />} />
      <Route path="user-managements/author/:id" element={<AuthorDetail />} />
      <Route path="reports/book-reports" element={<BookReports />} />
      <Route path="reports/promotion-reports" element={<PromotionReports />} />
      <Route path="reports/author-reports" element={<AuthorReports />} />
      <Route path="reports/buyer-reports" element={<BuyerReports />} />
      <Route path="reports/earnings-reports" element={<EarningsReports />} />
      <Route path="ticket/:id" element={<TicketDetail />} />
      <Route path="my-ticket/:id" element={<MyTicketDetail />} />
      <Route path="open-ticket/:id" element={<OpenTicketDetail />} />
      <Route
        path="reports/user-management-reports"
        element={<UserMReports />}
      />
      <Route path="subscription" element={<Subscription />} />
      <Route path="payout" element={<Payout />} />

      <Route path="support" element={<Support />} />
      <Route path="setting" element={<Setting />} />
      <Route path="knowledge-base" element={<KnowledgeBase />} />
       <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
      <Route path="jagora-support" element={<JagoraSupport />} />
      <Route path="jagora-support/:id" element={<JagoraSupportDetail />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
