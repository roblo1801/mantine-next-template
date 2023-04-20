// Import necessary Redux libraries
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cartSlice';

// Create a Redux store
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});
