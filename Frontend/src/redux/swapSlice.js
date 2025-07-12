import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks
export const createSwapRequest = createAsyncThunk(
    "swap/createRequest",
    async (swapData, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(
                "http://localhost:8080/api/v1/swap/create",
                swapData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create swap request");
        }
    }
);

export const acceptSwapRequest = createAsyncThunk(
    "swap/acceptRequest",
    async (requestId, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(
                `http://localhost:8080/api/v1/swap/accept/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to accept swap request");
        }
    }
);

export const rejectSwapRequest = createAsyncThunk(
    "swap/rejectRequest",
    async (requestId, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(
                `http://localhost:8080/api/v1/swap/reject/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to reject swap request");
        }
    }
);

export const cancelSwapRequest = createAsyncThunk(
    "swap/cancelRequest",
    async (requestId, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(
                `http://localhost:8080/api/v1/swap/cancel/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to cancel swap request");
        }
    }
);

export const fetchUserSwapRequests = createAsyncThunk(
    "swap/fetchUserRequests",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(
                "http://localhost:8080/api/v1/swap/my-requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch swap requests");
        }
    }
);

const swapSlice = createSlice({
    name: "swap",
    initialState: {
        sentRequests: [],
        receivedRequests: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create swap request
            .addCase(createSwapRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSwapRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createSwapRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Accept swap request
            .addCase(acceptSwapRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptSwapRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Update the request in receivedRequests
                const index = state.receivedRequests.findIndex(req => req._id === action.payload._id);
                if (index !== -1) {
                    state.receivedRequests[index] = action.payload;
                }
            })
            .addCase(acceptSwapRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reject swap request
            .addCase(rejectSwapRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectSwapRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Update the request in receivedRequests
                const index = state.receivedRequests.findIndex(req => req._id === action.payload._id);
                if (index !== -1) {
                    state.receivedRequests[index] = action.payload;
                }
            })
            .addCase(rejectSwapRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cancel swap request
            .addCase(cancelSwapRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelSwapRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the request from sentRequests
                state.sentRequests = state.sentRequests.filter(req => req._id !== action.payload._id);
            })
            .addCase(cancelSwapRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user swap requests
            .addCase(fetchUserSwapRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserSwapRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.sentRequests = action.payload.sent;
                state.receivedRequests = action.payload.received;
            })
            .addCase(fetchUserSwapRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = swapSlice.actions;
export default swapSlice.reducer; 