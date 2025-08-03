import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

const initialState = {
  favorites: [],
  status: "idle",
  statusFavorite: "idle",
  error: null,
};

// GET - Fetch all favorites
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// POST - Toggle favorite (add/remove)
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (bookId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/favorite/${bookId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(toggleFavorite.pending, (state) => {
        state.statusFavorite = "loading";
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.statusFavorite = "succeeded";
        const productId = action.payload?.id;
        const exists = state.favorites.find((fav) => fav.id === productId);

        if (exists) {
          state.favorites = state.favorites.filter(
            (fav) => fav.id !== productId
          );
        } else {
          state.favorites.push(action.payload);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.statusFavorite = "failed";
        state.error = action.payload;
      });
  },
});

export default favoritesSlice.reducer;
