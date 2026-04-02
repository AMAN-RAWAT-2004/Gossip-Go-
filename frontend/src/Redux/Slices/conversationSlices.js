import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔐 Helper: get token
const getAuthConfig = () => {
  const token = localStorage.getItem("userToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// 🔥 1. CREATE or GET CONVERSATION
export const createOrGetConversation = createAsyncThunk(
  "conversation/createOrGet",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversations`,
        { receiverId },
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Failed to create conversation" }
      );
    }
  }
);


// 🔥 2. GET ALL CONVERSATIONS
export const fetchConversations = createAsyncThunk(
  "conversation/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversations`,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Failed to fetch conversations" }
      );
    }
  }
);


// 🧠 Initial State
const initialState = {
  conversations: [],
  activeConversation: null,
  loading: false,
  error: null,
};


// 🧠 Slice
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // 👉 manually set active chat
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    clearActiveConversation: (state) => {
      state.activeConversation = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔄 CREATE / GET
      .addCase(createOrGetConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrGetConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.activeConversation = action.payload;

        // optional: add to list if not exists
        const exists = state.conversations.find(
          (c) => c._id === action.payload._id
        );

        if (!exists) {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(createOrGetConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Error creating conversation";
      })

      // 🔄 FETCH ALL
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Error fetching conversations";
      });
  },
});


// 🔥 Actions
export const {
  setActiveConversation,
  clearActiveConversation,
} = conversationSlice.actions;

// 🔥 Reducer
export default conversationSlice.reducer;