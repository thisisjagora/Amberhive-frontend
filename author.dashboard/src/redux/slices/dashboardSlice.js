import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  status: "idle",
  error: null,
};


export const fetchAuthorStats = createAsyncThunk(
  "dashboard/fetchAuthorStats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/me/author/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch author stats"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.status = "idle";
      state.error = null;
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthorStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuthorStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchAuthorStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
