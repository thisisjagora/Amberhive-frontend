import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Add a genre
export const addGenre = createAsyncThunk(
  "genre/addGenre",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/add-genre", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.message);
    }
  }
);

// Fetch all genres
export const fetchGenres = createAsyncThunk(
  "genre/fetchGenres",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/genres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.message);
    }
  }
);

// Add a sub-genre
export const addSubGenre = createAsyncThunk(
  "genre/addSubGenre",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/add-sub-genre", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.message);
    }
  }
);

// Fetch all sub-genres
export const fetchSubGenres = createAsyncThunk(
  "genre/fetchSubGenres",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/sub-genres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.message);
    }
  }
);

const genreSlice = createSlice({
  name: "genre",
  initialState: {
    genres: [],
    subGenres: [],
    statusAddGenre: "idle",
    statusFetchGenres: "idle",
    statusAddSubGenre: "idle",
    statusFetchSubGenres: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addGenre
      .addCase(addGenre.pending, (state) => {
        state.statusAddGenre = "loading";
        state.error = null;
      })
      .addCase(addGenre.fulfilled, (state, action) => {
        state.statusAddGenre = "succeeded";
        state.genres.push(action.payload);
      })
      .addCase(addGenre.rejected, (state, action) => {
        state.statusAddGenre = "failed";
        state.error = action.payload;
      })

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
      })

      // addSubGenre
      .addCase(addSubGenre.pending, (state) => {
        state.statusAddSubGenre = "loading";
        state.error = null;
      })
      .addCase(addSubGenre.fulfilled, (state, action) => {
        state.statusAddSubGenre = "succeeded";
        state.subGenres.push(action.payload);
      })
      .addCase(addSubGenre.rejected, (state, action) => {
        state.statusAddSubGenre = "failed";
        state.error = action.payload;
      })

      // fetchSubGenres
      .addCase(fetchSubGenres.pending, (state) => {
        state.statusFetchSubGenres = "loading";
        state.error = null;
      })
      .addCase(fetchSubGenres.fulfilled, (state, action) => {
        state.statusFetchSubGenres = "succeeded";
        state.subGenres = action.payload;
      })
      .addCase(fetchSubGenres.rejected, (state, action) => {
        state.statusFetchSubGenres = "failed";
        state.error = action.payload;
      });
  },
});

export default genreSlice.reducer;
