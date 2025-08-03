import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all books
export const fetchAllBooks = createAsyncThunk(
  "bookApproval/fetchAllBooks",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/all-books?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return {
        books: response.data.data,
        pagination: {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
          total: response.data.total,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch all books"
      );
    }
  }
);

// Fetch pending book approvals
export const fetchPendingBooks = createAsyncThunk(
  "bookApproval/fetchPendingBooks",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/pending-books?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        books: response.data.data,
        pagination: {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
          total: response.data.total,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending books"
      );
    }
  }
);

// Fetch approved books
// When calling: dispatch(fetchApprovedBooks({ page: 1 }))
export const fetchApprovedBooks = createAsyncThunk(
  "bookApproval/fetchApprovedBooks",
  async ({ page = 1 }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/approved-books?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        data: response.data.data,
        pagination: {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
          total: response.data.total,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch approved books"
      );
    }
  }
);

// Fetch rejected books
export const fetchRejectedBooks = createAsyncThunk(
  "bookApproval/fetchRejectedBooks",
  async ({ page = 1 }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/rejected-books?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        data: response.data.data,
        pagination: {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
          total: response.data.total,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch rejected books"
      );
    }
  }
);

// View book by ID
export const fetchBookById = createAsyncThunk(
  "bookApproval/fetchBookById",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/show-book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch book details");
    }
  }
);

// Approve a book by ID
export const approveBook = createAsyncThunk(
  "bookApproval/approveBook",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/admin/approve-book/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to approve book"
      );
    }
  }
);

// Reject a book by ID
export const rejectBook = createAsyncThunk(
  "bookApproval/rejectBook",
  async ({ id, rejection_reason }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/admin/reject-book/${id}`,
        { rejection_reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reject book"
      );
    }
  }
);

// Toggle feature/unfeature a book
export const toggleFeatureBook = createAsyncThunk(
  "bookApproval/toggleFeatureBook",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/books/${id}/feature`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle featured status"
      );
    }
  }
);

// Fetch featured books with pagination
export const fetchFeaturedBooks = createAsyncThunk(
  "bookApproval/fetchFeaturedBooks",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/featured-books?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        books: response.data.data, // array of books
        pagination: {
          currentPage: response.data.meta?.current_page || 1,
          lastPage: response.data.meta?.last_page || 1,
          total: response.data.meta?.total || 0,
          from: response.data.meta?.from || 0,
          to: response.data.meta?.to || 0,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured books"
      );
    }
  }
);

const bookApprovalSlice = createSlice({
  name: "bookApproval",
  initialState: {
    allBooks: [],
    pendingBooks: [],
    approvedBooks: [],
    rejectedBooks: [],
    bookDetail: null,
    featuredBooks: [],
    statusFeaturedBooks: "idle",
    statusToggleFeature: "idle",
    statusAllBooks: "idle",
    statusPendingBooks: "idle",
    statusApproveBook: "idle",
    statusRejectBook: "idle",
    statusApprovedBooks: "idle",
    statusRejectedBooks: "idle",
    statusBookDetail: "idle",
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 10,
      from: 0,
      to: 0,
    },
    paginationPending: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 10,
      from: 0,
      to: 0,
    },
    paginationApproved: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      from: 0,
      to: 0,
      total: 0,
    },
    paginationRejected: {
      currentPage: 1,
      lastPage: 1,
      from: 0,
      to: 0,
      total: 0,
    },
    paginationFeatured: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      from: 0,
      to: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllBooks
      .addCase(fetchAllBooks.pending, (state) => {
        state.statusAllBooks = "loading";
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.statusAllBooks = "succeeded";
        state.allBooks = action.payload.books;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllBooks.rejected, (state) => {
        state.statusAllBooks = "failed";
      })

      // fetchPendingBooks
      .addCase(fetchPendingBooks.pending, (state) => {
        state.statusPendingBooks = "loading";
        state.error = null;
      })
      .addCase(fetchPendingBooks.fulfilled, (state, action) => {
        state.statusPendingBooks = "succeeded";
        state.pendingBooks = action.payload.books;
        state.paginationPending = action.payload.pagination;
      })
      .addCase(fetchPendingBooks.rejected, (state, action) => {
        state.statusPendingBooks = "failed";
        state.error = action.payload;
      })

      // approveBook
      .addCase(approveBook.pending, (state) => {
        state.statusApproveBook = "loading";
        state.error = null;
      })
      .addCase(approveBook.fulfilled, (state, action) => {
        state.statusApproveBook = "succeeded";
        // Remove approved book from pendingBooks
        state.pendingBooks = state.pendingBooks.filter(
          (book) => book.id !== action.payload.id
        );
        // Add to approvedBooks list
        state.approvedBooks.push(action.payload);
      })
      .addCase(approveBook.rejected, (state, action) => {
        state.statusApproveBook = "failed";
        state.error = action.payload;
      })

      // rejectBook
      .addCase(rejectBook.pending, (state) => {
        state.statusRejectBook = "loading";
        state.error = null;
      })
      .addCase(rejectBook.fulfilled, (state, action) => {
        state.statusRejectBook = "succeeded";
        // Remove rejected book from pendingBooks
        state.pendingBooks = state.pendingBooks.filter(
          (book) => book.id !== action.payload.id
        );
        // Add to rejectedBooks list
        state.rejectedBooks.push(action.payload);
      })
      .addCase(rejectBook.rejected, (state, action) => {
        state.statusRejectBook = "failed";
        state.error = action.payload;
      })

      // fetchApprovedBooks
      .addCase(fetchApprovedBooks.pending, (state) => {
        state.statusApprovedBooks = "loading";
        state.error = null;
      })
      .addCase(fetchApprovedBooks.fulfilled, (state, action) => {
        state.statusApprovedBooks = "succeeded";
        state.approvedBooks = action.payload?.data;
        state.paginationApproved = action.payload?.pagination;
      })
      .addCase(fetchApprovedBooks.rejected, (state, action) => {
        state.statusApprovedBooks = "failed";
        state.error = action.payload;
      })

      // fetchRejectedBooks
      .addCase(fetchRejectedBooks.pending, (state) => {
        state.statusRejectedBooks = "loading";
      })
      .addCase(fetchRejectedBooks.fulfilled, (state, action) => {
        state.statusRejectedBooks = "succeeded";
        state.rejectedBooks = action.payload.data;
        state.paginationRejected = action.payload.pagination;
      })
      .addCase(fetchRejectedBooks.rejected, (state, action) => {
        state.statusRejectedBooks = "failed";
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

      // fetchFeaturedBooks
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.statusFeaturedBooks = "loading";
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.statusFeaturedBooks = "succeeded";
        state.featuredBooks = action.payload.books;
        state.paginationFeatured = action.payload.pagination;
      })
      .addCase(fetchFeaturedBooks.rejected, (state) => {
        state.statusFeaturedBooks = "failed";
      })

      // toggleFeatureBook
      .addCase(toggleFeatureBook.pending, (state) => {
        state.statusToggleFeature = "loading";
        state.error = null;
      })
      .addCase(toggleFeatureBook.fulfilled, (state, action) => {
        state.statusToggleFeature = "succeeded";
        // No need to update state here unless you want to reflect changes locally
      })
      .addCase(toggleFeatureBook.rejected, (state, action) => {
        state.statusToggleFeature = "failed";
        state.error = action.payload;
      });
  },
});

export default bookApprovalSlice.reducer;
