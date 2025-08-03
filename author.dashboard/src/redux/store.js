import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slices/bookSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import dashboardReducer from "./slices/dashboardSlice";
import subscribeReducer from "./slices/subscribeSlice";
import genreReducer from "./slices/genreSlice";
import emailCampaignReducer from "./slices/emailCampaignSlice";
import announcementReducer from "./slices/announcementSlice";
import resetPasswordReducer from "./slices/resetPasswordSlice";
import ticketReducer from "./slices/ticketSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
    subscribe: subscribeReducer,
    genre: genreReducer,
    emailCampaign: emailCampaignReducer,
    announcement: announcementReducer,
    resetPassword: resetPasswordReducer,
    tickets: ticketReducer,
  },
});

export default store;
