import { Routes, Route } from "react-router";
import Overview from "@/pages/dashboard/admin/Overview";
import ViewBook from "@/pages/dashboard/admin/ViewBooks";
import BuyerManagement from "@/pages/dashboard/admin/BuyerManagement";
import Support from "@/pages/dashboard/admin/Support";
import Setting from "@/pages/dashboard/admin/Setting";
import NotFound from "@/pages/NotFound";
import Notification from "@/pages/dashboard/admin/Notification";
import Promotion from "@/pages/dashboard/admin/Promotion";
import TotalCampaigns from "@/pages/dashboard/admin/TotalCampaigns";
import TotalSubscribers from "@/pages/dashboard/admin/TotalSubscribers";
import TotalUnsubscribers from "@/pages/dashboard/admin/TotalUnsubscribers";
import TotalViews from "@/pages/dashboard/admin/TotalViews";
import Genre from "@/pages/dashboard/admin/Genre";
import AllBook from "@/pages/dashboard/admin/AllBook";
import PendingApproval from "@/pages/dashboard/admin/PendingApproval";
import ApprovedBooks from "@/pages/dashboard/admin/ApprovedBooks";
import RejectedBook from "@/pages/dashboard/admin/RejectedBook";
import TicketDetail from "@/pages/dashboard/admin/TicketDetail";
import MyTicketDetail from "@/pages/dashboard/admin/MyTicketDetail";
import OpenTicketDetail from "@/pages/dashboard/admin/OpenTicketDetail";
import FeaturedBooks from "@/pages/dashboard/admin/FeaturedBooks";
import KnowledgeBase from "@/pages/dashboard/admin/KnowledgeBase";
import KnowledgeDetail from "@/pages/dashboard/admin/KnowledgeDetail";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="overview" element={<Overview />} />
      <Route path="/content-management/all-book" element={<AllBook />} />
      <Route
        path="/content-management/pending-approvals"
        element={<PendingApproval />}
      />
      <Route
        path="/content-management/approved-book"
        element={<ApprovedBooks />}
      />

      <Route
        path="/content-management/featured-book"
        element={<FeaturedBooks />}
      />
      <Route
        path="/content-management/rejected-book"
        element={<RejectedBook />}
      />
      <Route
        path="/content-management/book-approvals/:id"
        element={<ViewBook />}
      />
      <Route path="/content-management/genre" element={<Genre />} />
      <Route path="buyer-management" element={<BuyerManagement />} />
       <Route path="knowledge-base" element={<KnowledgeBase />} />
       <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
      <Route path="notification" element={<Notification />} />
      <Route path="promotion" element={<Promotion />} />
      <Route path="promotion/total-campaigns" element={<TotalCampaigns />} />
      <Route
        path="promotion/total-subscribers"
        element={<TotalSubscribers />}
      />
      <Route
        path="promotion/total-unsubscribers"
        element={<TotalUnsubscribers />}
      />
      <Route path="promotion/total-views" element={<TotalViews />} />

      <Route path="support" element={<Support />} />
      <Route path="ticket/:id" element={<TicketDetail />} />
      <Route path="my-ticket/:id" element={<MyTicketDetail />} />
      <Route path="open-ticket/:id" element={<OpenTicketDetail />} />
      <Route path="setting" element={<Setting />} />

      {/* Catch-all for unmatched admin paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
