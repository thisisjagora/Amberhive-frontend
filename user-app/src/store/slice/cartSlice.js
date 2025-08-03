import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/apiService";

// GET - Fetch cart
export const fetchCarts = createAsyncThunk(
  "cart/fetchCarts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      // console.error("fetchCarts error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// POST - Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (itemData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/add-to-cart", itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// PUT - Update quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/update-item/${itemId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// DELETE - Remove single item
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/remove-item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// DELETE - Clear all items
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete("/clear-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// POST - Checkout
export const checkout = createAsyncThunk(
  "cart/checkout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/checkout", checkoutData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.message || error.message);
    }
  }
);

const initialState = {
  carts: [],
  status: "idle",
  statusAddToCart: "idle",
  statusUpdateQuantity: "idle",
  statusRemoveItem: "idle",
  statusClearCart: "idle",
  statusCheckout: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH CARTS
      .addCase(fetchCarts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.carts = action.payload;
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.statusAddToCart = "loading";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.statusAddToCart = "succeeded";
        state.carts.items.push(action.payload);
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.statusAddToCart = "failed";
        state.error = action.payload;
      })

      // UPDATE CART QUANTITY
      .addCase(updateCartQuantity.pending, (state) => {
        state.statusUpdateQuantity = "loading";
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.statusUpdateQuantity = "succeeded";
        const index = state.carts.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.carts.items[index] = action.payload;
        }
      })

      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.statusUpdateQuantity = "failed";
        state.error = action.payload;
      })

      // REMOVE CART ITEM
      .addCase(removeCartItem.pending, (state) => {
        state.statusRemoveItem = "loading";
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.statusRemoveItem = "succeeded";
        state.carts = state.carts.items.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.statusRemoveItem = "failed";
        state.error = action.payload;
      })

      // CLEAR CART
      .addCase(clearCart.pending, (state) => {
        state.statusClearCart = "loading";
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.statusClearCart = "succeeded";
        state.carts = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.statusClearCart = "failed";
        state.error = action.payload;
      })

      // CHECKOUT
      .addCase(checkout.pending, (state) => {
        state.statusCheckout = "loading";
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.statusCheckout = "succeeded";
        state.carts = [];
      })
      .addCase(checkout.rejected, (state, action) => {
        state.statusCheckout = "failed";
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
