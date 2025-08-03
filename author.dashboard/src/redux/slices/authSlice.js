import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --- Thunks ---

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/signup", data);

      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data);

      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/verifyotp", formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/resendotp", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const res = await api.post("/update-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const res = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      console.error("Fetch profile error:", err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// --- Slice ---

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  status: "idle", // for register/login/otp
  error: null,

  otpSent: false,
  otpVerified: false,

  updatePasswordStatus: "idle",
  updatePasswordError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.otpVerified = false;

      state.updatePasswordStatus = "idle";
      state.updatePasswordError = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Register ---
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Login ---
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.otpVerified = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Verify OTP ---
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Resend OTP ---
      .addCase(resendOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Update Password ---
      .addCase(updatePassword.pending, (state) => {
        state.updatePasswordStatus = "loading";
        state.updatePasswordError = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.updatePasswordStatus = "succeeded";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updatePasswordStatus = "failed";
        state.updatePasswordError = action.payload;
      })

      // --- Fetch Profile ---
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // adjust if your API returns `{ user: {…} }`
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
