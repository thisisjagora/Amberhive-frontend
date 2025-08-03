import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

const initialState = {
  status: "idle",
  step: "request", // "request" → "verify" → "reset"
  error: null,
  message: null,
};

// Step 1: Request password reset
export const requestPasswordReset = createAsyncThunk(
  "resetPassword/request",
  async (payload, thunkAPI) => {
    try {
      const response = await api.post("/password/reset-request", payload);

      return response.data.message || "Reset link sent.";
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Request failed"
      );
    }
  }
);

// Step 2: Verify OTP
export const verifyPasswordOtp = createAsyncThunk(
  "resetPassword/verifyOtp",
  async ({ otp }, thunkAPI) => {
    try {
      const response = await api.post("/password/verifyotp", { otp });
      return response.data.message || "OTP verified.";
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Step 3: Reset password
export const resetPassword = createAsyncThunk(
  "resetPassword/reset",
  async ({ email, password, confirm_password }, thunkAPI) => {
    try {
      const res = await api.post("/password/reset", {
        email,
        password,
        confirm_password,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Password reset failed"
      );
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    clearResetState: (state) => {
      state.status = "idle";
      state.step = "request";
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.step = "verify";
        state.message = action.payload;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyPasswordOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyPasswordOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.step = "reset";
        state.message = action.payload;
      })
      .addCase(verifyPasswordOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearResetState } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
