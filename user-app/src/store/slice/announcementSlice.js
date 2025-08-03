
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

// Fetch all announcements
export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcements"
      );
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    announcements: [],
    statusFetchAnnouncements: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAnnouncements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.statusFetchAnnouncements = "loading";
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.statusFetchAnnouncements = "succeeded";
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.statusFetchAnnouncements = "failed";
        state.error = action.payload;
      });
  },
});

export default announcementSlice.reducer;
