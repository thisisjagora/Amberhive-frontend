import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "@/store/slice/bookSlice";
import authReducer from "@/store/slice/authSlice";
import favoritesReducer from "@/store/slice/favoritesSlice";
import cartsReducer from "@/store/slice/cartSlice";
import profileReducer from "@/store/slice/profileSlice";
import ticketReducer from "@/store/slice/ticketSlice";
import subscribeReducer from "@/store/slice/subscribeSlice";
import reviewsReducer from "@/store/slice/reviewSlice";
import announcementReducer from "@/store/slice/announcementSlice";
import resetPasswordReducer from "@/store/slice/resetPasswordSlice";
import genreReducer from "@/store/slice/genreSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    favorites: favoritesReducer,
    carts: cartsReducer,
    profile: profileReducer,
    subscribe: subscribeReducer,
    tickets: ticketReducer,
    reviews: reviewsReducer,
    announcement: announcementReducer,
    resetPassword: resetPasswordReducer,
    genre: genreReducer,
  },
});

export default store;
