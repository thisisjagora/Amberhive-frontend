import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiService";

// Fetch pending royalty payments in Naira
export const fetchPendingRoyaltyNaira = createAsyncThunk(
  "royalty/fetchPendingRoyaltyNaira",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/pending-royalty-payments-naira", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending Naira royalties"
      );
    }
  }
);

// Fetch pending royalty payments in USD
export const fetchPendingRoyaltyUSD = createAsyncThunk(
  "royalty/fetchPendingRoyaltyUSD",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/pending-royalty-payments-usd", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending USD royalties"
      );
    }
  }
);

const royaltySlice = createSlice({
  name: "royalty",
  initialState: {
    pendingNaira: [],
    pendingUSD: [],
    statusNaira: "idle",
    statusUSD: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPendingRoyaltyNaira
      .addCase(fetchPendingRoyaltyNaira.pending, (state) => {
        state.statusNaira = "loading";
        state.error = null;
      })
      .addCase(fetchPendingRoyaltyNaira.fulfilled, (state, action) => {
        state.statusNaira = "succeeded";
        state.pendingNaira = action.payload;
      })
      .addCase(fetchPendingRoyaltyNaira.rejected, (state, action) => {
        state.statusNaira = "failed";
        state.error = action.payload;
      })

      // fetchPendingRoyaltyUSD
      .addCase(fetchPendingRoyaltyUSD.pending, (state) => {
        state.statusUSD = "loading";
        state.error = null;
      })
      .addCase(fetchPendingRoyaltyUSD.fulfilled, (state, action) => {
        state.statusUSD = "succeeded";
        state.pendingUSD = action.payload;
      })
      .addCase(fetchPendingRoyaltyUSD.rejected, (state, action) => {
        state.statusUSD = "failed";
        state.error = action.payload;
      });
  },
});

export default royaltySlice.reducer;
