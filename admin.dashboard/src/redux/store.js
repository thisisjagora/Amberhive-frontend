import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookApprovalReducer from "./slices/bookApprovalSlice";
import genreReducer from "./slices/genreSlice";
import subscriptionPlansReducer from "./slices/subscriptionPlanSlice";
import usersReducer from "./slices/usersSlice";
import supportTicketReducer from "./slices/supportTicketSlice";
import announcementReducer from "./slices/announcementSlice";
import dashboardReducer from "./slices/dashboardSlice";
import reportReducer from "./slices/reportSlice";
import promotionReducer from "./slices/promotionSlice";
import ticketJagoraReducer from "./slices/ticketJagoraSlice";
import royaltyReducer from "./slices/royaltySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookApproval: bookApprovalReducer,
    genre: genreReducer,
    subscriptionPlans: subscriptionPlansReducer,
    users: usersReducer,
    supportTicket: supportTicketReducer,
    announcement: announcementReducer,
    dashboard: dashboardReducer,
    report: reportReducer,
    promotion: promotionReducer,
    ticketJagora: ticketJagoraReducer,
    royalty: royaltyReducer,
  },
});

export default store;
