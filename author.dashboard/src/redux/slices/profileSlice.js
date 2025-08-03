import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  profile: {},
  status: "idle",
  error: null,
  banks: [],
  verificationResult: null,
};

// GET: Fetch author profile
export const fetchAuthorProfile = createAsyncThunk(
  "profile/fetchAuthorProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/me/author", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch author profile"
      );
    }
  }
);

// POST: Set up author profile
export const setupAuthorProfile = createAsyncThunk(
  "profile/setupAuthorProfile",
  async (profileData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/create-author", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set up author profile"
      );
    }
  }
);

// POST: Update author profile
export const updateAuthorProfile = createAsyncThunk(
  "profile/updateAuthorProfile",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/me/author-update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update author profile"
      );
    }
  }
);

// GET: Fetch all banks
export const fetchAllBanks = createAsyncThunk(
  "profile/fetchAllBanks",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/banks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch banks"
      );
    }
  }
);

// 🆕 Delete an author
export const deleteAuthor = createAsyncThunk(
  "profile/deleteAuthor",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/admin/delete-admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // 🔷 return the API response data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// POST: Verify bank account
export const verifyBankAccount = createAsyncThunk(
  "profile/verifyBankAccount",
  async (accountData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/verify-account", accountData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to verify bank account"
      );
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.status = "idle";
      state.error = null;
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Fetch Author Profile =====
      .addCase(fetchAuthorProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuthorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchAuthorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ===== Setup Author Profile =====
      .addCase(setupAuthorProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(setupAuthorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(setupAuthorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ===== Update Author Profile =====
      .addCase(updateAuthorProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateAuthorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateAuthorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ===== Fetch All Banks =====
      .addCase(fetchAllBanks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllBanks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banks = action.payload;
      })
      .addCase(fetchAllBanks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ===== Verify Bank Account =====
      .addCase(verifyBankAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyBankAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.verificationResult = action.payload;
      })
      .addCase(verifyBankAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ===== Delete Author Profile =====
      .addCase(deleteAuthor.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state) => {
        state.status = "succeeded";
        state.profile = null; // clear the deleted profile
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;

export default profileSlice.reducer;
