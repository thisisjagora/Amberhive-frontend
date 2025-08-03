import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --- Thunks ---

export const requestPasswordReset = createAsyncThunk(
  "resetPassword/requestReset",
  async ({ email }, thunkAPI) => {
    try {
      const res = await api.post("/password/reset-request", { email });
      return res.data;
    } catch (err) {
      console.log(err.response?.data); // <-- ✅ Correct way to log error response
      return thunkAPI.rejectWithValue(err.response?.data); // <-- ✅ Fix here
    }
  }
);

export const verifyResetOtp = createAsyncThunk(
  "resetPassword/verifyOtp",
  async ({ otp }, thunkAPI) => {
    try {
      const res = await api.post("/password/verifyotp", { otp });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "OTP verification failed"
      );
    }
  }
);

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

// --- Slice ---

const initialState = {
  resetStatus: "idle", // request/reset status
  resetError: null,

  otpStatus: "idle",
  otpError: null,

  completeStatus: "idle",
  completeError: null,
};

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    clearResetState(state) {
      state.resetStatus = "idle";
      state.resetError = null;
      state.otpStatus = "idle";
      state.otpError = null;
      state.completeStatus = "idle";
      state.completeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.resetStatus = "loading";
        state.resetError = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.resetStatus = "succeeded";
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.resetStatus = "failed";
        state.resetError = action.payload;
      })

      // Verify OTP
      .addCase(verifyResetOtp.pending, (state) => {
        state.otpStatus = "loading";
        state.otpError = null;
      })
      .addCase(verifyResetOtp.fulfilled, (state) => {
        state.otpStatus = "succeeded";
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.otpStatus = "failed";
        state.otpError = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.completeStatus = "loading";
        state.completeError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.completeStatus = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.completeStatus = "failed";
        state.completeError = action.payload;
      });
  },
});

export const { clearResetState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
