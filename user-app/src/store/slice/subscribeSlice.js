import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

// Fetch subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  "subscribe/fetchPlans",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/subscription-plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription plans"
      );
    }
  }
);

// Subscribe using Paystack
export const subscribeWithPaystack = createAsyncThunk(
  "subscribe/withPaystack",
  async (payload, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/subscribe/paystack/initialize",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to subscribe with Paystack"
      );
    }
  }
);

// Subscribe using Stripe
export const subscribeWithStripe = createAsyncThunk(
  "subscribe/withStripe",
  async (payload, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/subscribe/stripe/initialize", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to subscribe with Stripe"
      );
    }
  }
);

export const freeSubscribe = createAsyncThunk(
  "subscribe/free",
  async ({ authorId, planId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { plan_id: planId }; // payload contains plan_id only
      const response = await api.post(
        `/subscribe/free/initialize/${authorId}/${planId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to initialize free subscription"
      );
    }
  }
);

const subscribeSlice = createSlice({
  name: "subscribe",
  initialState: {
    data: null,
    plans: [], // <--- new state for subscription plans
    statusPaystack: "idle",
    statusStripe: "idle",
    statusPlans: "idle", // <--- status for fetching plans
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== fetchSubscriptionPlans =====
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.statusPlans = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.statusPlans = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.statusPlans = "failed";
        state.error = action.payload;
      })

      // ===== subscribeWithPaystack =====
      .addCase(subscribeWithPaystack.pending, (state) => {
        state.statusPaystack = "loading";
      })
      .addCase(subscribeWithPaystack.fulfilled, (state, action) => {
        state.statusPaystack = "succeeded";
        state.data = action.payload;
      })
      .addCase(subscribeWithPaystack.rejected, (state, action) => {
        state.statusPaystack = "failed";
        state.error = action.payload;
      })

      // ===== subscribeWithStripe =====
      .addCase(subscribeWithStripe.pending, (state) => {
        state.statusStripe = "loading";
      })
      .addCase(subscribeWithStripe.fulfilled, (state, action) => {
        state.statusStripe = "succeeded";
        state.data = action.payload;
      })
      .addCase(subscribeWithStripe.rejected, (state, action) => {
        state.statusStripe = "failed";
        state.error = action.payload;
      })

      // ===== freeSubscribe =====
      .addCase(freeSubscribe.pending, (state) => {
        state.statusFree = "loading";
      })
      .addCase(freeSubscribe.fulfilled, (state, action) => {
        state.statusFree = "succeeded";
        state.data = action.payload;
      })
      .addCase(freeSubscribe.rejected, (state, action) => {
        state.statusFree = "failed";
        state.error = action.payload;
      });
  },
});

export default subscribeSlice.reducer;
