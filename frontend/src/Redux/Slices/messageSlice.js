import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  Auth header helper
const getConfig = () => {
  const token = localStorage.getItem("userToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};



//  1. GET MESSAGES
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/${conversationId}`,
        getConfig()
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Failed to fetch messages" }
      );
    }
  }
);



//  2. SEND MESSAGE
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
        { conversationId, text },
        getConfig()
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Failed to send message" }
      );
    }
  }
);



//  3. DELETE MESSAGE
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/${messageId}`,
        getConfig()
      );

      return messageId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Failed to delete message" }
      );
    }
  }
);



//  4. MARK AS SEEN
export const markAsSeen = createAsyncThunk(
  "messages/markAsSeen",
  async ({ conversationId, userId }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/seen/${conversationId}`,
        { userId },
        getConfig()
      );

      return conversationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Failed to mark seen" }
      );
    }
  }
);



const initialState = {
  messages: [],
  loading: false,
  error: null,
};



const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg;
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (msg) => msg._id !== action.payload
        );
      })

      .addCase(markAsSeen.fulfilled, (state) => {
        state.messages = state.messages.map((msg) => ({
          ...msg,
          isSeen: true,
        }));
      });
  },
});



export const { addMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;