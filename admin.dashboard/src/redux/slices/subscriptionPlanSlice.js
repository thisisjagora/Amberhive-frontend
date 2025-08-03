import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiService";

// Fetch subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlans/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/get-plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription plans"
      );
    }
  }
);

// Add subscription plan
export const addSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/addSubscriptionPlan",
  async (payload, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/admin/add-plan", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add subscription plan"
      );
    }
  }
);

// Update subscription plan
export const updateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/updateSubscriptionPlan",
  async ({ id, updated }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/admin/update-plan/${id}`, updated, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update subscription plan"
      );
    }
  }
);

// Slice
const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlans",
  initialState: {
    plans: [],
    statusFetch: "idle",
    statusAdd: "idle",
    statusUpdate: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSubscriptionPlans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.statusFetch = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.statusFetch = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.statusFetch = "failed";
        state.error = action.payload;
      })

      // addSubscriptionPlan
      .addCase(addSubscriptionPlan.pending, (state) => {
        state.statusAdd = "loading";
        state.error = null;
      })
      .addCase(addSubscriptionPlan.fulfilled, (state, action) => {
        state.statusAdd = "succeeded";
        state.plans.push(action.payload);
      })
      .addCase(addSubscriptionPlan.rejected, (state, action) => {
        state.statusAdd = "failed";
        state.error = action.payload;
      })

      // updateSubscriptionPlan
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.statusUpdate = "loading";
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.statusUpdate = "succeeded";
        const index = state.plans.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.statusUpdate = "failed";
        state.error = action.payload;
      });
  },
});

export default subscriptionPlanSlice.reducer;
