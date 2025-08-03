import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiService";

// Helper function to get the token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Thunks
export const fetchBookReports = createAsyncThunk(
  "reports/fetchBookReports",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/book-reports", getAuthHeaders());
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch book reports"
      );
    }
  }
);

export const fetchAuthorReports = createAsyncThunk(
  "reports/fetchAuthorReports",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/author-reports", getAuthHeaders());
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch author reports"
      );
    }
  }
);

export const fetchBuyerReports = createAsyncThunk(
  "reports/fetchBuyerReports",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/buyer-reports", getAuthHeaders());
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch buyer reports"
      );
    }
  }
);

export const fetchEarningsReport = createAsyncThunk(
  "reports/fetchEarningsReport",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/sales-reports", getAuthHeaders());
      // console.log(response.data)
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch earnings report"
      );
    }
  }
);

// Slice
const reportSlice = createSlice({
  name: "reports",
  initialState: {
    bookReports: [],
    authorReports: [],
    buyerReports: [],
    earningsReport: [],

    statusBookReports: "idle",
    statusAuthorReports: "idle",
    statusBuyerReports: "idle",
    statusEarningsReport: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Book Reports
      .addCase(fetchBookReports.pending, (state) => {
        state.statusBookReports = "loading";
        state.error = null;
      })
      .addCase(fetchBookReports.fulfilled, (state, action) => {
        state.statusBookReports = "succeeded";
        state.bookReports = action.payload;
      })
      .addCase(fetchBookReports.rejected, (state, action) => {
        state.statusBookReports = "failed";
        state.error = action.payload;
      })

      // Author Reports
      .addCase(fetchAuthorReports.pending, (state) => {
        state.statusAuthorReports = "loading";
        state.error = null;
      })
      .addCase(fetchAuthorReports.fulfilled, (state, action) => {
        state.statusAuthorReports = "succeeded";
        state.authorReports = action.payload;
      })
      .addCase(fetchAuthorReports.rejected, (state, action) => {
        state.statusAuthorReports = "failed";
        state.error = action.payload;
      })

      // Buyer Reports
      .addCase(fetchBuyerReports.pending, (state) => {
        state.statusBuyerReports = "loading";
        state.error = null;
      })
      .addCase(fetchBuyerReports.fulfilled, (state, action) => {
        state.statusBuyerReports = "succeeded";
        state.buyerReports = action.payload;
      })
      .addCase(fetchBuyerReports.rejected, (state, action) => {
        state.statusBuyerReports = "failed";
        state.error = action.payload;
      })

      // Earnings Report
      .addCase(fetchEarningsReport.pending, (state) => {
        state.statusEarningsReport = "loading";
        state.error = null;
      })
      .addCase(fetchEarningsReport.fulfilled, (state, action) => {
        state.statusEarningsReport = "succeeded";
        state.earningsReport = action.payload;
      })
      .addCase(fetchEarningsReport.rejected, (state, action) => {
        state.statusEarningsReport = "failed";
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
