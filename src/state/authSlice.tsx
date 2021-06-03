import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleAuthState: (state) => {
      state.isAuthenticated = !state.isAuthenticated;
    },
  },
});

export const { toggleAuthState } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
