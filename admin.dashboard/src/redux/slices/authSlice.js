import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/signup", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Something went wrong. Please try again later."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/login", data);

      // ✅ Store token & user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Server error. Please try again later."
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/verifyotp", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Server error. Please try again later."
      );
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
      return thunkAPI.rejectWithValue(
        err.response?.data || "Server error. Please try again later."
      );
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
      // console.log(res)
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Server error. Please try again later."
      );
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
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const res = await api.post("/update-profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
           "Content-Type": "multipart/form-data",
        },
      });
      // Optionally update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Profile update failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    status: "idle",
    error: null,
    otpSent: false,
    otpVerified: false,
    updatePasswordStatus: "idle",
    updatePasswordError: null,

    profile: {},
    fetchProfileStatus: "idle",
    fetchProfileError: null,
    updateProfileStatus: "idle",
    updateProfileError: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.otpVerified = false;

      // ✅ Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Login
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

      // Verify OTP
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

      // Resend OTP
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

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.fetchProfileStatus = "loading";
        state.fetchProfileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.fetchProfileStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.fetchProfileStatus = "failed";
        state.fetchProfileError = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileStatus = "loading";
        state.updateProfileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileStatus = "failed";
        state.updateProfileError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
