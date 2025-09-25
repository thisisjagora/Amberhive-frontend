import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch my books
export const fetchMyBooks = createAsyncThunk(
  "books/fetchMyBooks",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/my-books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch my books");
    }
  }
);

// Fetch my books
export const fetchMySales = createAsyncThunk(
  "books/fetchMySales",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/my-sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch my books");
    }
  }
);

// Fetch my drafts
export const fetchMyDrafts = createAsyncThunk(
  "books/fetchMyDrafts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/my-drafts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch drafts");
    }
  }
);

// Save a book
export const saveBook = createAsyncThunk(
  "books/saveBook",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/add-book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      // Only return message from the backend; no fallback
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Update a draft book
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/update-book/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data.message)
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

// View book by ID
export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
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

// Trash a book
export const trashBook = createAsyncThunk(
  "books/trashBook",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/trash-book/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to trash book");
    }
  }
);

// Fetch trashed books
export const fetchTrashedBooks = createAsyncThunk(
  "books/fetchTrashedBooks",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/trashed-books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch trashed books");
    }
  }
);

// Edit a published book
export const editBook = createAsyncThunk(
  "books/editBook",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/edit-book/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to edit book"
      );
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    myBooks: [],
    mySales: [],
    myDrafts: [],
    trashedBooks: [],
    bookDetail: null,
    statusMyBooks: "idle",
    statusMySales: "idle",
    statusMyDrafts: "idle",
    statusSaveBook: "idle",
    statusUpdateBook: "idle",
    statusEditBook: "idle",
    statusBookDetail: "idle",
    statusTrashBook: "idle",
    statusTrashedBooks: "idle",

    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ===== fetchMyBooks =====
      .addCase(fetchMyBooks.pending, (state) => {
        state.statusMyBooks = "loading";
      })
      .addCase(fetchMyBooks.fulfilled, (state, action) => {
        state.statusMyBooks = "succeeded";
        state.myBooks = action.payload || [];
      })
      .addCase(fetchMyBooks.rejected, (state, action) => {
        state.statusMyBooks = "failed";
        state.error = action.payload;
      })

      // ===== editBook =====
      .addCase(editBook.pending, (state) => {
        state.statusEditBook = "loading"; // Reuse or create new status like `statusEditBook`
      })
      .addCase(editBook.fulfilled, (state, action) => {
        state.statusEditBook = "succeeded";
        // Update the book in myBooks list if needed
        const index = state.myBooks.findIndex(
          (b) => b.id === action.payload?.id
        );
        if (index !== -1) {
          state.myBooks[index] = action.payload;
        }
      })
      .addCase(editBook.rejected, (state, action) => {
        state.statusEditBook = "failed";
        state.error = action.payload;
      })

      // ===== fetchMySales =====
      .addCase(fetchMySales.pending, (state) => {
        state.statusMySales = "loading";
      })
      .addCase(fetchMySales.fulfilled, (state, action) => {
        state.statusMySales = "succeeded";
        state.mySales = action.payload || [];
      })
      .addCase(fetchMySales.rejected, (state, action) => {
        state.statusMySales = "failed";
        state.error = action.payload;
      })

      // ===== fetchMyDrafts =====
      .addCase(fetchMyDrafts.pending, (state) => {
        state.statusMyDrafts = "loading";
      })
      .addCase(fetchMyDrafts.fulfilled, (state, action) => {
        state.statusMyDrafts = "succeeded";
        state.myDrafts = action.payload || [];
      })
      .addCase(fetchMyDrafts.rejected, (state, action) => {
        state.statusMyDrafts = "failed";
        state.error = action.payload;
      })

      // ===== saveBook =====
      .addCase(saveBook.pending, (state) => {
        state.statusSaveBook = "loading";
      })
      .addCase(saveBook.fulfilled, (state, action) => {
        state.statusSaveBook = "succeeded";
        state.myDrafts.push(action.payload);
      })
      .addCase(saveBook.rejected, (state, action) => {
        state.statusSaveBook = "failed";
        state.error = action.payload;
      })

      // ===== updateBook =====
      .addCase(updateBook.pending, (state) => {
        state.statusUpdateBook = "loading";
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.statusUpdateBook = "succeeded";
        const index = state.myDrafts.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.myDrafts[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.statusUpdateBook = "failed";
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

      // ===== trashBook =====
      .addCase(trashBook.pending, (state) => {
        state.statusTrashBook = "loading";
      })
      .addCase(trashBook.fulfilled, (state, action) => {
        state.statusTrashBook = "succeeded";
        // Optionally remove from myBooks if needed
        state.myBooks = state.myBooks.filter((b) => b.id !== action.payload.id);
      })
      .addCase(trashBook.rejected, (state, action) => {
        state.statusTrashBook = "failed";
        state.error = action.payload;
      })

      // ===== fetchTrashedBooks =====
      .addCase(fetchTrashedBooks.pending, (state) => {
        state.statusTrashedBooks = "loading";
      })
      .addCase(fetchTrashedBooks.fulfilled, (state, action) => {
        state.statusTrashedBooks = "succeeded";
        state.trashedBooks = action.payload || [];
      })
      .addCase(fetchTrashedBooks.rejected, (state, action) => {
        state.statusTrashedBooks = "failed";
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
