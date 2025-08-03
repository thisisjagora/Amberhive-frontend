import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

// Fetch all books
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/all-books?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

export const fetchNewReleases = createAsyncThunk(
  "books/fetchNewReleases",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/new-releases?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch new releases");
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  "books/fetchBestSellers",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/best-sellers?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch best sellers");
    }
  }
);

// View single book
export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/view-book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Accept: "application/epub+zip",
        },
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch book details");
    }
  }
);

// Fetch user's library books
export const fetchMyLibrary = createAsyncThunk(
  "books/fetchMyLibrary",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/my-library", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch library books"
      );
    }
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (queryData, thunkAPI) => {
    try {
      const response = await api.get("/search-books", {
        params: queryData, // correctly passed as params
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Fetch featured books
export const fetchFeaturedBooks = createAsyncThunk(
  "books/fetchFeaturedBooks",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/featured-books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured books"
      );
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    newReleases: [],
    bestSellers: [],
    featuredBooks: [],
    statusFeaturedBooks: "idle",
    bookDetail: null,
    myLibrary: [],
    searchResults: [],
    statusMyLibrary: "idle",
    statusBooks: "idle",
    statusNewReleases: "idle",
    statusBestSellers: "idle",
    statusBookDetail: "idle",
    statusSearch: "idle",
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
      total: 0,
      per_page: 10,
      from: 0,
      to: 0,
    },
    paginationNewReleases: {
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
      total: 0,
      per_page: 10,
      from: 0,
      to: 0,
    },
    paginationBestSellers: {
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
      total: 0,
      per_page: 10,
      from: 0,
      to: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== fetchBooks =====
      .addCase(fetchBooks.pending, (state) => {
        state.statusBooks = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.statusBooks = "succeeded";
        state.books = action.payload.data || [];

        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          next_page_url: action.payload.next_page_url,
          prev_page_url: action.payload.prev_page_url,
          total: action.payload.total,
          per_page: action.payload.per_page,
          from: action.payload.from,
          to: action.payload.to,
        };
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.statusBooks = "failed";
        state.error = action.payload;
      })

      // ===== fetchNewReleases =====
      .addCase(fetchNewReleases.pending, (state) => {
        state.statusNewReleases = "loading";
      })
      .addCase(fetchNewReleases.fulfilled, (state, action) => {
        state.statusNewReleases = "succeeded";
        state.newReleases = action.payload.data || [];

        state.paginationNewReleases = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          next_page_url: action.payload.next_page_url,
          prev_page_url: action.payload.prev_page_url,
          total: action.payload.total,
          per_page: action.payload.per_page,
          from: action.payload.from,
          to: action.payload.to,
        };
      })

      .addCase(fetchNewReleases.rejected, (state, action) => {
        state.statusNewReleases = "failed";
        state.error = action.payload;
      })

      // ===== fetchBestSellers =====
      .addCase(fetchBestSellers.pending, (state) => {
        state.statusBestSellers = "loading";
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.statusBestSellers = "succeeded";
        state.bestSellers = action.payload.data || [];

        state.paginationBestSellers = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          next_page_url: action.payload.next_page_url,
          prev_page_url: action.payload.prev_page_url,
          total: action.payload.total,
          per_page: action.payload.per_page,
          from: action.payload.from,
          to: action.payload.to,
        };
      })

      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.statusBestSellers = "failed";
        state.error = action.payload;
      })

      // ===== fetchBookById =====
      .addCase(fetchBookById.pending, (state) => {
        state.statusBookDetail = "loading";
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.statusBookDetail = "succeeded";
        state.bookDetail = action.payload || null;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.statusBookDetail = "failed";
        state.error = action.payload;
      })

      .addCase(fetchMyLibrary.pending, (state) => {
        state.statusMyLibrary = "loading";
      })
      .addCase(fetchMyLibrary.fulfilled, (state, action) => {
        state.statusMyLibrary = "succeeded";
        state.myLibrary = action.payload.data || [];
      })
      .addCase(fetchMyLibrary.rejected, (state, action) => {
        state.statusMyLibrary = "failed";
        state.error = action.payload;
      })

      // ===== searchBooks =====
      .addCase(searchBooks.pending, (state) => {
        state.statusSearch = "loading";
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.statusSearch = "succeeded";
        state.searchResults = action.payload || [];
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.statusSearch = "failed";
        state.error = action.payload;
      })

      // fetchFeaturedBooks
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.statusFeaturedBooks = "loading";
        state.error = null;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.statusFeaturedBooks = "succeeded";
        state.featuredBooks = action.payload;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.statusFeaturedBooks = "failed";
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
