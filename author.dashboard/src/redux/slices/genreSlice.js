import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all genres
export const fetchGenres = createAsyncThunk(
  "genre/fetchGenres",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/genres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch genres"
      );
    }
  }
);

const genreSlice = createSlice({
  name: "genre",
  initialState: {
    genres: [],

    statusFetchGenres: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetchGenres
      .addCase(fetchGenres.pending, (state) => {
        state.statusFetchGenres = "loading";
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.statusFetchGenres = "succeeded";
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.statusFetchGenres = "failed";
        state.error = action.payload;
      });
  },
});

export default genreSlice.reducer;
