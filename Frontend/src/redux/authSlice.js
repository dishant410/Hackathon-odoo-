import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    token: null
  },
  reducers: {
    setAuthUser: (state, action) => {
      const { user, token } = action.payload;
      state.authUser = user;
      state.token = token;
     
    },
    logout: (state) => {
      state.authUser = null;
      state.token = null;
    
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
