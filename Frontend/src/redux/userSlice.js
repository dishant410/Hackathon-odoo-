import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    publicUsers: [],
    searchResults: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchPublicUsers = createAsyncThunk(
    "user/fetchPublicUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/user/public");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
        }
    }
);

export const searchUsersBySkill = createAsyncThunk(
    "user/searchUsersBySkill",
    async (skill, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/user/search?skill=${skill}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to search users");
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    "user/updateProfile",
    async (profileData, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(
                "http://localhost:8080/api/v1/user/profile",
                profileData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearSearchResults: (state = initialState) => {
            state.searchResults = [];
        },
        clearError: (state = initialState) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch public users
            .addCase(fetchPublicUsers.pending, (state = initialState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicUsers.fulfilled, (state = initialState, action) => {
                state.loading = false;
                state.publicUsers = action.payload;
            })
            .addCase(fetchPublicUsers.rejected, (state = initialState, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Search users by skill
            .addCase(searchUsersBySkill.pending, (state = initialState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchUsersBySkill.fulfilled, (state = initialState, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchUsersBySkill.rejected, (state = initialState, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update profile
            .addCase(updateUserProfile.pending, (state = initialState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state = initialState, action) => {
                state.loading = false;
                // Update the user in localStorage and Redux auth state if present
                try {
                    const user = action.payload;
                    const token = localStorage.getItem("token");
                    if (user && token) {
                        localStorage.setItem("user", JSON.stringify(user));
                    }
                } catch (e) { }
            })
            .addCase(updateUserProfile.rejected, (state = initialState, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSearchResults, clearError } = userSlice.actions;
export default userSlice.reducer; 