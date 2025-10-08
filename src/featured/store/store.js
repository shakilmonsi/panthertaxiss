import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // The path to your authSlice

export const store = configureStore({
  reducer: {
    auth: authReducer, // Added auth Slice reducer under 'auth' key
    // Add your other slice reducers here
  },
});
