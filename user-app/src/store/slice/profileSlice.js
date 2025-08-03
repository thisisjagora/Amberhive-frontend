import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

const initialState = {
  user: null,
  authors: [],
  status: "idle",
  error: null,
};

// GET: Fetch user profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// PUT: Update user profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// GET: Fetch all authors
export const fetchAllAuthors = createAsyncThunk(
  "authors/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/all-authors", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch authors"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch all authors
      .addCase(fetchAllAuthors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAuthors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.authors = action.payload;
      })
      .addCase(fetchAllAuthors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;

export default profileSlice.reducer;
