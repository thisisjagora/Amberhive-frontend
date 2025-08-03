import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiService";

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Fetch new users (last 7 days)
export const fetchNewUsers = createAsyncThunk(
  "users/fetchNewUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/new-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch new users"
      );
    }
  }
);

// Fetch all authors
export const fetchAllAuthors = createAsyncThunk(
  "users/fetchAllAuthors",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/all-authors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch authors"
      );
    }
  }
);

// Fetch author profile
export const fetchAuthorProfile = createAsyncThunk(
  "users/fetchAuthorProfile",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/author/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch author profile"
      );
    }
  }
);

// Block author
export const blockAuthor = createAsyncThunk(
  "users/blockAuthor",
  async (userId, thunkAPI) => {
    try {
      const id = userId;
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/admin/block-user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
     
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch author profile"
      );
    }
  }
);

// Fetch all roles
export const fetchAllRoles = createAsyncThunk(
  "users/fetchAllRoles",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles"
      );
    }
  }
);

// 🆕 Fetch only admins
export const fetchAdmins = createAsyncThunk(
  "users/fetchAdmins",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

// 🆕 Delete an admin
export const deleteAdmin = createAsyncThunk(
  "users/deleteAdmin",
  async (adminId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/admin/delete-admin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // 🔷 return the API response data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    newUsers: [],
    authors: [],
    roles: [],
    admins: [],
    authorProfile: null,
    blockAuthor: null,
    statusAdmins: "idle", // 🆕
    statusBlockAuthor: "idle", // 🆕
    statusDeleteAdmin: "idle", // 👈 NEW
    statusAllUsers: "idle",
    statusNewUsers: "idle",
    statusAuthors: "idle",
    statusRoles: "idle",
    statusAuthorProfile: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.statusAllUsers = "loading";
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.statusAllUsers = "succeeded";
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.statusAllUsers = "failed";
        state.error = action.payload;
      })

      // 🆕 fetchAdmins
      .addCase(fetchAdmins.pending, (state) => {
        state.statusAdmins = "loading";
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.statusAdmins = "succeeded";
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.statusAdmins = "failed";
        state.error = action.payload;
      })

      // deleteAdmin
      .addCase(deleteAdmin.pending, (state) => {
        state.statusDeleteAdmin = "loading";
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.statusDeleteAdmin = "succeeded";
        state.admins = state.admins.filter(
          (admin) => admin.id !== action.payload
        );
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.statusDeleteAdmin = "failed";
        state.error = action.payload;
      })

      // fetchNewUsers
      .addCase(fetchNewUsers.pending, (state) => {
        state.statusNewUsers = "loading";
        state.error = null;
      })
      .addCase(fetchNewUsers.fulfilled, (state, action) => {
        state.statusNewUsers = "succeeded";
        state.newUsers = action.payload;
      })
      .addCase(fetchNewUsers.rejected, (state, action) => {
        state.statusNewUsers = "failed";
        state.error = action.payload;
      })

      // fetchAllAuthors
      .addCase(fetchAllAuthors.pending, (state) => {
        state.statusAuthors = "loading";
        state.error = null;
      })
      .addCase(fetchAllAuthors.fulfilled, (state, action) => {
        state.statusAuthors = "succeeded";
        state.authors = action.payload;
      })
      .addCase(fetchAllAuthors.rejected, (state, action) => {
        state.statusAuthors = "failed";
        state.error = action.payload;
      })

      // blockAuthor
      .addCase(blockAuthor.pending, (state) => {
        state.statusBlockAuthor = "loading";
        state.error = null;
      })
      .addCase(blockAuthor.fulfilled, (state, action) => {
        state.statusBlockAuthor = "succeeded";
        state.blockAuthor = action.payload;
      })
      .addCase(blockAuthor.rejected, (state, action) => {
        state.statusBlockAuthor = "failed";
        state.error = action.payload;
      })

      // fetchAllRoles
      .addCase(fetchAllRoles.pending, (state) => {
        state.statusRoles = "loading";
        state.error = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.statusRoles = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.statusRoles = "failed";
        state.error = action.payload;
      })

      // fetchAuthorProfile
      .addCase(fetchAuthorProfile.pending, (state) => {
        state.statusAuthorProfile = "loading";
        state.error = null;
      })
      .addCase(fetchAuthorProfile.fulfilled, (state, action) => {
        state.statusAuthorProfile = "succeeded";
        state.authorProfile = action.payload;
      })
      .addCase(fetchAuthorProfile.rejected, (state, action) => {
        state.statusAuthorProfile = "failed";
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
