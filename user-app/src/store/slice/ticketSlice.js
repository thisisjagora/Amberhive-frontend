import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "tickets/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // assuming data is here
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Create ticket
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (ticketData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/create-ticket", ticketData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create ticket"
      );
    }
  }
);

// Fetch my tickets
export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMyTickets",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/my-tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch my tickets"
      );
    }
  }
);

// Show single ticket by id
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/show-ticket/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket"
      );
    }
  }
);

// Reply to ticket
export const replyTicket = createAsyncThunk(
  "tickets/replyTicket",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/reply-ticket/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reply to ticket"
      );
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    categories: [],
    myTickets: [],
    ticketDetail: null,
    statusCategories: "idle",
    statusMyTickets: "idle",
    statusTicketDetail: "idle",
    statusCreateTicket: "idle",
    statusReplyTicket: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.statusCategories = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.statusCategories = "succeeded";
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.statusCategories = "failed";
        state.error = action.payload;
      })

      // createTicket
      .addCase(createTicket.pending, (state) => {
        state.statusCreateTicket = "loading";
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.statusCreateTicket = "succeeded";
        // Optionally push new ticket to myTickets or handle otherwise
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.statusCreateTicket = "failed";
        state.error = action.payload;
      })

      // fetchMyTickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.statusMyTickets = "loading";
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.statusMyTickets = "succeeded";
        state.myTickets = action.payload || [];
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.statusMyTickets = "failed";
        state.error = action.payload;
      })

      // fetchTicketById
      .addCase(fetchTicketById.pending, (state) => {
        state.statusTicketDetail = "loading";
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.statusTicketDetail = "succeeded";
        state.ticketDetail = action.payload || null;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.statusTicketDetail = "failed";
        state.error = action.payload;
      })

      // replyTicket
      .addCase(replyTicket.pending, (state) => {
        state.statusReplyTicket = "loading";
      })
      .addCase(replyTicket.fulfilled, (state, action) => {
        state.statusReplyTicket = "succeeded";
        // Optionally update ticketDetail with new reply here
      })
      .addCase(replyTicket.rejected, (state, action) => {
        state.statusReplyTicket = "failed";
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;
