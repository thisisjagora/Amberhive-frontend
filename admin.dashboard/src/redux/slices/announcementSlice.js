import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// -----------------------------
// Thunks
// -----------------------------

// 1. Fetch All Announcements
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

// 2. Get Draft Announcements
export const fetchDrafts = createAsyncThunk(
  "announcement/fetchDrafts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/announcement-drafts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch drafts"
      );
    }
  }
);

// 3. Create or Draft Announcement
export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/create-announcement", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create announcement"
      );
    }
  }
);

// 4. Send Out a Drafted Announcement
export const sendOutAnnouncement = createAsyncThunk(
  "announcement/sendOutAnnouncement",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/send-announcement/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send announcement"
      );
    }
  }
);

// -----------------------------
// Slice
// -----------------------------

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    announcements: [],
    drafts: [],
    statusFetchAnnouncements: "idle",
    statusFetchDrafts: "idle",
    statusCreateAnnouncement: "idle",
    statusSendOutAnnouncement: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch announcements
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
      })

      // Fetch drafts
      .addCase(fetchDrafts.pending, (state) => {
        state.statusFetchDrafts = "loading";
        state.error = null;
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.statusFetchDrafts = "succeeded";
        state.drafts = action.payload;
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.statusFetchDrafts = "failed";
        state.error = action.payload;
      })

      // Create announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.statusCreateAnnouncement = "loading";
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.statusCreateAnnouncement = "succeeded";
        // Add to correct list
        const newItem = action.payload;
        if (newItem.draft === 1) {
          state.drafts.push(newItem);
        } else {
          state.announcements.push(newItem);
        }
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.statusCreateAnnouncement = "failed";
        state.error = action.payload;
      })

      // Send out draft
      .addCase(sendOutAnnouncement.pending, (state) => {
        state.statusSendOutAnnouncement = "loading";
        state.error = null;
      })
      .addCase(sendOutAnnouncement.fulfilled, (state, action) => {
        state.statusSendOutAnnouncement = "succeeded";
        const updated = action.payload;
        // Remove from drafts, add to announcements
        state.drafts = state.drafts.filter((d) => d.id !== updated.id);
        state.announcements.push(updated);
      })
      .addCase(sendOutAnnouncement.rejected, (state, action) => {
        state.statusSendOutAnnouncement = "failed";
        state.error = action.payload;
      });
  },
});

export default announcementSlice.reducer;
