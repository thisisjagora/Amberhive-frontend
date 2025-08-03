import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

// POST: Review a book
export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/book/${id}/review`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    statusSubmitRe: "idle",
    error: null,
    successMessage: null,
  },
  reducers: {
    // Removed `clearReviewStatus`
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReview.pending, (state) => {
        state.statusSubmitRe = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.statusSubmitRe = "succeeded";
        state.successMessage = action.payload?.message;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.statusSubmitRe = "failed";
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
