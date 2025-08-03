import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiService";

// Get all campaign stats
export const fetchAllCampaignStats = createAsyncThunk(
  "promotion/fetchAllCampaignStats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/all-campaign-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data || response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch all campaign stats"
      );
    }
  }
);

const promotionSlice = createSlice({
  name: "promotion",
  initialState: {
    campaignStats: {},
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCampaignStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllCampaignStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.campaignStats = action.payload;
      })
      .addCase(fetchAllCampaignStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default promotionSlice.reducer;
