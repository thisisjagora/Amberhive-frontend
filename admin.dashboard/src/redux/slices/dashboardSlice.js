import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch Admin Dashboard
export const fetchAdminDashborad = createAsyncThunk(
  "dashboard/fetchAdminDashborad",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/dashboard-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch adminDash"
      );
    }
  }
);

// Fetch Super Admin Dashboard
export const fetchSuperAdminDashboard = createAsyncThunk(
  "dashboard/fetchSuperAdminDashboard",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch superAdminDash"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    adminDash: [],
    superAdminDash: [],
    statusAdminDash: "idle",
    statusSuperAdminDash: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Admin Dashboard
      .addCase(fetchAdminDashborad.pending, (state) => {
        state.statusAdminDash = "loading";
        state.error = null;
      })
      .addCase(fetchAdminDashborad.fulfilled, (state, action) => {
        state.statusAdminDash = "succeeded";
        state.adminDash = action.payload;
      })
      .addCase(fetchAdminDashborad.rejected, (state, action) => {
        state.statusAdminDash = "failed";
        state.error = action.payload;
      })

      // Super Admin Dashboard
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.statusSuperAdminDash = "loading";
        state.error = null;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        state.statusSuperAdminDash = "succeeded";
        state.superAdminDash = action.payload;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.statusSuperAdminDash = "failed";
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
