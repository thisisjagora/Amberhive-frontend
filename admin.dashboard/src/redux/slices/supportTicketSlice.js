import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create category
export const createCategory = createAsyncThunk(
  "supportTicket/createCategory",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/categories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data)
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

// Get all categories
export const fetchCategories = createAsyncThunk(
  "supportTicket/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "supportTicket/updateCategory",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/update-category/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.message);
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

// Get all tickets
export const fetchAllTickets = createAsyncThunk(
  "supportTicket/fetchAllTickets",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/all-tickets?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

// Get my tickets
export const fetchMyTickets = createAsyncThunk(
  "supportTicket/fetchMyTickets",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/my-tickets?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch my tickets"
      );
    }
  }
);

// Get open tickets
export const fetchOpenTickets = createAsyncThunk(
  "supportTicket/fetchOpenTickets",
  async (page = 1, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/open-tickets?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch open tickets"
      );
    }
  }
);

// Show ticket by ID
export const fetchTicketById = createAsyncThunk(
  "supportTicket/fetchTicketById",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/show-ticket/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket details"
      );
    }
  }
);

// Accept ticket by ID
export const acceptTicket = createAsyncThunk(
  "supportTicket/acceptTicket",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/accept-ticket/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to accept ticket"
      );
    }
  }
);

// Reply to ticket
export const replyTicket = createAsyncThunk(
  "supportTicket/replyTicket",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/reply-ticket/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reply to ticket"
      );
    }
  }
);

// Close ticket
export const closeTicket = createAsyncThunk(
  "supportTicket/closeTicket",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/close-ticket/${id}`,
        {}, // body
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
        error.response?.data?.message || "Failed to close ticket"
      );
    }
  }
);

const supportTicketSlice = createSlice({
  name: "supportTicket",
  initialState: {
    categories: [],
    allTickets: [],
    openTickets: [],
    ticketDetail: null,
    myTickets: [],

    paginationAllTickets: {
      currentPage: 1,
      lastPage: 1,
      links: [],
    },
    paginationOpenTickets: {
      currentPage: 1,
      lastPage: 1,
      links: [],
    },
    paginationMyTickets: {
      currentPage: 1,
      lastPage: 1,
      links: [],
    },

    statusCreateCategory: "idle",
    statusFetchCategories: "idle",
    statusUpdateCategory: "idle",
    statusFetchAllTickets: "idle",
    statusFetchOpenTickets: "idle",
    statusFetchTicketById: "idle",
    statusAcceptTicket: "idle",
    statusFetchMyTickets: "idle",
    statusReplyTicket: "idle",
    statusCloseTicket: "idle",

    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      // createCategory
      .addCase(createCategory.pending, (state) => {
        state.statusCreateCategory = "loading";
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.statusCreateCategory = "succeeded";
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.statusCreateCategory = "failed";
        state.error = action.payload;
      })

      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.statusFetchCategories = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.statusFetchCategories = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.statusFetchCategories = "failed";
        state.error = action.payload;
      })

      // updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.statusUpdateCategory = "loading";
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.statusUpdateCategory = "succeeded";
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.statusUpdateCategory = "failed";
        state.error = action.payload;
      })

      // fetchAllTickets
      .addCase(fetchAllTickets.pending, (state) => {
        state.statusFetchAllTickets = "loading";
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        const { data, current_page, last_page, links } = action.payload;
        state.statusFetchAllTickets = "succeeded";
        state.allTickets = data;
        state.currentPage = current_page;
        state.lastPage = last_page;
        state.links = links;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.statusFetchAllTickets = "failed";
        state.error = action.payload;
      })

      // fetchOpenTickets
      .addCase(fetchOpenTickets.pending, (state) => {
        state.statusFetchOpenTickets = "loading";
        state.error = null;
      })
      .addCase(fetchOpenTickets.fulfilled, (state, action) => {
        const { data, current_page, last_page, links } = action.payload;
        state.statusFetchOpenTickets = "succeeded";
        state.openTickets = data;
        state.currentPage = current_page;
        state.lastPage = last_page;
        state.links = links;
      })
      .addCase(fetchOpenTickets.rejected, (state, action) => {
        state.statusFetchOpenTickets = "failed";
        state.error = action.payload;
      })

      // fetchTicketById
      .addCase(fetchTicketById.pending, (state) => {
        state.statusFetchTicketById = "loading";
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.statusFetchTicketById = "succeeded";
        state.ticketDetail = action.payload || null;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.statusFetchTicketById = "failed";
        state.error = action.payload;
      })

      // acceptTicket
      .addCase(acceptTicket.pending, (state) => {
        state.statusAcceptTicket = "loading";
        state.error = null;
      })
      .addCase(acceptTicket.fulfilled, (state, action) => {
        state.statusAcceptTicket = "succeeded";
        // Update the ticket in allTickets, openTickets, myTickets if needed
        const updateLists = ["allTickets", "openTickets", "myTickets"];
        updateLists.forEach((listName) => {
          const idx = state[listName].findIndex(
            (ticket) => ticket.id === action.payload.id
          );
          if (idx !== -1) {
            state[listName][idx] = action.payload;
          }
        });
        if (state.ticketDetail?.id === action.payload.id) {
          state.ticketDetail = action.payload;
        }
      })
      .addCase(acceptTicket.rejected, (state, action) => {
        state.statusAcceptTicket = "failed";
        state.error = action.payload;
      })

      // fetchMyTickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.statusFetchMyTickets = "loading";
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        const { data, current_page, last_page, links } = action.payload;
        state.statusFetchMyTickets = "succeeded";
        state.myTickets = data;
        state.currentPage = current_page;
        state.lastPage = last_page;
        state.links = links;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.statusFetchMyTickets = "failed";
        state.error = action.payload;
      })

      // replyTicket
      .addCase(replyTicket.pending, (state) => {
        state.statusReplyTicket = "loading";
        state.error = null;
      })
      .addCase(replyTicket.fulfilled, (state, action) => {
        state.statusReplyTicket = "succeeded";
        // Update ticketDetail with latest replies if returned
        if (state.ticketDetail?.id === action.payload.id) {
          state.ticketDetail = action.payload;
        }
      })
      .addCase(replyTicket.rejected, (state, action) => {
        state.statusReplyTicket = "failed";
        state.error = action.payload;
      })

      // closeTicket
      .addCase(closeTicket.pending, (state) => {
        state.statusCloseTicket = "loading";
        state.error = null;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.statusCloseTicket = "succeeded";
        // Update the ticket in all relevant lists
        const updateLists = ["allTickets", "openTickets", "myTickets"];
        updateLists.forEach((listName) => {
          const idx = state[listName].findIndex(
            (ticket) => ticket.id === action.payload.id
          );
          if (idx !== -1) {
            state[listName][idx] = action.payload;
          }
        });
        if (state.ticketDetail?.id === action.payload.id) {
          state.ticketDetail = action.payload;
        }
      })
      .addCase(closeTicket.rejected, (state, action) => {
        state.statusCloseTicket = "failed";
        state.error = action.payload;
      });
  },
});

export default supportTicketSlice.reducer;
