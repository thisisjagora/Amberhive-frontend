import api from "@/services/apiService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import subscribers
export const importSubscribers = createAsyncThunk(
  "emailCampaign/importSubscribers",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/import-subscribers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data;",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to import subscribers"
      );
    }
  }
);

// Add subscribers
export const addSubscribers = createAsyncThunk(
  "emailCampaign/addSubscribers",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/add-subscriber", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to import subscribers"
      );
    }
  }
);

// Get my subscribers
export const getMySubscribers = createAsyncThunk(
  "emailCampaign/getMySubscribers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/my-subscribers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //   console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.data?.message || "Failed to fetch subscribers"
      );
    }
  }
);

// Create campaign
export const createCampaign = createAsyncThunk(
  "emailCampaign/createCampaign",
  async (payload, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/create-campaign", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create campaign"
      );
    }
  }
);

// Send campaign
export const sendCampaign = createAsyncThunk(
  "emailCampaign/sendCampaign",
  async ({ authorId, campaign_id }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/send-campaign/${authorId}/${campaign_id}`,
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
        error.response?.data?.message || "Failed to send campaign"
      );
    }
  }
);

// Get campaign stats
export const getCampaignStats = createAsyncThunk(
  "emailCampaign/getCampaignStats",
  async (author_id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/campaign-stats/${author_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch campaign stats"
      );
    }
  }
);

// Get newsletter subscribers by ID
export const getNewsletterSubscribers = createAsyncThunk(
  "emailCampaign/getNewsletterSubscribers",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/newsletter-subscribers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data; // adjust if response shape is different
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.data?.message ||
          "Failed to fetch newsletter subscribers"
      );
    }
  }
);

// Fetch campaign drafts
export const getCampaignDrafts = createAsyncThunk(
  "emailCampaign/getCampaignDrafts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/campaign-drafts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // adjust if response shape is different
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch campaign drafts"
      );
    }
  }
);

const emailCampaignSlice = createSlice({
  name: "emailCampaign",
  initialState: {
    subscribers: [],
    newsletterSubscribers: [],
    campaignDrafts: [],
    campaignStats: null,
    data: null,
    statusImport: "idle",
    statusAdd: "idle",
    statusFetchSubscribers: "idle",
    statusFetchNewsletterSubscribers: "idle",
    statusFetchCampaignDrafts: "idle",
    statusCreateCampaign: "idle",
    statusSendCampaign: "idle",
    statusCampaignStats: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Import Subscribers
      .addCase(importSubscribers.pending, (state) => {
        state.statusImport = "loading";
      })
      .addCase(importSubscribers.fulfilled, (state, action) => {
        state.statusImport = "succeeded";
        state.data = action.payload;
      })
      .addCase(importSubscribers.rejected, (state, action) => {
        state.statusImport = "failed";
        state.error = action.payload;
      })

      // Add Subscribers
      .addCase(addSubscribers.pending, (state) => {
        state.statusAdd = "loading";
      })
      .addCase(addSubscribers.fulfilled, (state, action) => {
        state.statusAdd = "succeeded";
        state.data = action.payload;
      })
      .addCase(addSubscribers.rejected, (state, action) => {
        state.statusAdd = "failed";
        state.error = action.payload;
      })

      // Get Subscribers
      .addCase(getMySubscribers.pending, (state) => {
        state.statusFetchSubscribers = "loading";
      })
      .addCase(getMySubscribers.fulfilled, (state, action) => {
        state.statusFetchSubscribers = "succeeded";
        state.subscribers = action.payload;
      })
      .addCase(getMySubscribers.rejected, (state, action) => {
        state.statusFetchSubscribers = "failed";
        state.error = action.payload;
      })

      // ✅ Get Campaign Drafts
      .addCase(getCampaignDrafts.pending, (state) => {
        state.statusFetchCampaignDrafts = "loading";
      })
      .addCase(getCampaignDrafts.fulfilled, (state, action) => {
        state.statusFetchCampaignDrafts = "succeeded";
        state.campaignDrafts = action.payload;
      })
      .addCase(getCampaignDrafts.rejected, (state, action) => {
        state.statusFetchCampaignDrafts = "failed";
        state.error = action.payload;
      })

      // Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.statusCreateCampaign = "loading";
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.statusCreateCampaign = "succeeded";
        state.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.statusCreateCampaign = "failed";
        state.error = action.payload;
      })

      // Send Campaign
      .addCase(sendCampaign.pending, (state) => {
        state.statusSendCampaign = "loading";
      })
      .addCase(sendCampaign.fulfilled, (state, action) => {
        state.statusSendCampaign = "succeeded";
        state.data = action.payload;
      })
      .addCase(sendCampaign.rejected, (state, action) => {
        state.statusSendCampaign = "failed";
        state.error = action.payload;
      })

      // Get Campaign Stats
      .addCase(getCampaignStats.pending, (state) => {
        state.statusCampaignStats = "loading";
      })
      .addCase(getCampaignStats.fulfilled, (state, action) => {
        state.statusCampaignStats = "succeeded";
        state.campaignStats = action.payload;
      })
      .addCase(getCampaignStats.rejected, (state, action) => {
        state.statusCampaignStats = "failed";
        state.error = action.payload;
      })

      // Get newsletter subscribers by ID
      .addCase(getNewsletterSubscribers.pending, (state) => {
        state.statusFetchNewsletterSubscribers = "loading";
      })
      .addCase(getNewsletterSubscribers.fulfilled, (state, action) => {
        state.statusFetchNewsletterSubscribers = "succeeded";
        state.newsletterSubscribers = action.payload;
      })
      .addCase(getNewsletterSubscribers.rejected, (state, action) => {
        state.statusFetchNewsletterSubscribers = "failed";
        state.error = action.payload;
      });
  },
});

export default emailCampaignSlice.reducer;
